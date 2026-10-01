import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import fs from 'fs';
import path from 'path';
import { parseInternsCSV, mergeInternsWithGroups, loadApplicationsPhoneMap } from '@/lib/internsParser';
import { supabase } from '@/lib/supabase';
import { INITIAL_CHAPTERS, INITIAL_AMBASSADORS } from '@/lib/chaptersData';
import { getBlockedInterns, blockIntern, unblockIntern } from '@/lib/blockedInterns';

const INTERNS_CSV_PATH = path.join(process.cwd(), 'interns.csv');
const APPLICATIONS_CSV_PATH = path.join(process.cwd(), 'number_email - Applications.csv');

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    // Read CSV content from file system
    let csvContent = '';
    if (fs.existsSync(INTERNS_CSV_PATH)) {
      csvContent = fs.readFileSync(INTERNS_CSV_PATH, 'utf8');
    }

    const rawInterns = parseInternsCSV(csvContent);

    // Read Applications phone number data
    let phoneMap: { byEmail: Map<string, string>; byName: Map<string, string> } | undefined;
    if (fs.existsSync(APPLICATIONS_CSV_PATH)) {
      const appsContent = fs.readFileSync(APPLICATIONS_CSV_PATH, 'utf8');
      phoneMap = loadApplicationsPhoneMap(appsContent);
    }

    // Read Blocked interns list
    const blockedMap = getBlockedInterns();

    // Fetch chapters and ambassadors from Supabase
    let chapters = INITIAL_CHAPTERS;
    let ambassadors = INITIAL_AMBASSADORS as any[];

    try {
      const { data: dbChapters, error: cErr } = await supabase
        .from('chapters')
        .select('*')
        .order('name', { ascending: true });

      if (!cErr && dbChapters && dbChapters.length > 0) {
        chapters = dbChapters;
      }

      const { data: dbAmbassadors, error: aErr } = await supabase
        .from('ambassadors')
        .select('*')
        .order('created_at', { ascending: false });

      if (!aErr && dbAmbassadors && dbAmbassadors.length > 0) {
        ambassadors = dbAmbassadors;
      }
    } catch (dbErr) {
      console.warn('Admin Interns DB query fallback to defaults:', dbErr);
    }

    const mergedRecords = mergeInternsWithGroups(rawInterns, ambassadors, chapters, phoneMap, blockedMap);

    const total = mergedRecords.length;
    const joined = mergedRecords.filter(r => r.hasJoinedGroup && !r.isBlocked).length;
    const pending = mergedRecords.filter(r => !r.hasJoinedGroup && !r.isBlocked).length;
    const blocked = mergedRecords.filter(r => r.isBlocked).length;
    const adoptionRate = total > 0 ? Math.round((joined / total) * 100) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        total,
        joined,
        pending,
        blocked,
        adoptionRate,
        chaptersCount: chapters.length,
      },
      interns: mergedRecords,
      chapters: chapters.map(c => ({
        id: c.id,
        name: c.name,
        whatsapp_link: c.whatsapp_link,
      })),
    });
  } catch (err: any) {
    console.error('Error fetching admin interns:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { action } = body;

    // Action 1: Upload or update interns CSV file
    if (action === 'upload_csv') {
      const { csvText } = body;
      if (!csvText || typeof csvText !== 'string') {
        return NextResponse.json({ error: 'Missing csvText' }, { status: 400 });
      }

      fs.writeFileSync(INTERNS_CSV_PATH, csvText, 'utf8');
      return NextResponse.json({ success: true, message: 'interns.csv updated successfully' });
    }

    // Action 2: Manually assign intern to a Chapter / WhatsApp Group
    if (action === 'assign_group') {
      const { email, name, phone, chapterId, chapterName, university } = body;

      if (!email || !chapterName) {
        return NextResponse.json({ error: 'Email and Chapter Name are required' }, { status: 400 });
      }

      // Upsert or insert into Supabase ambassadors
      const newAmbassador = {
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        phone: phone || '+92 300 0000000',
        university: university || chapterName,
        chapter_id: chapterId || null,
        chapter_name: chapterName,
        status: 'Active',
      };

      try {
        const { error: insertErr } = await supabase
          .from('ambassadors')
          .insert([newAmbassador]);

        if (insertErr) {
          console.warn('Supabase insert error (continuing with local confirmation):', insertErr);
        }
      } catch (dbErr) {
        console.warn('Supabase database insert caught error:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: `Successfully assigned ${name || email} to ${chapterName}`,
        record: newAmbassador,
      });
    }

    // Action 3: Block intern
    if (action === 'block_intern') {
      const { email, reason, name } = body;
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const blockedRecord = blockIntern(email, reason, name, auth.email);

      // Also update ambassadors table if exists
      try {
        await supabase
          .from('ambassadors')
          .update({ status: 'Blocked' })
          .eq('email', email.toLowerCase().trim());
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }

      return NextResponse.json({
        success: true,
        message: `Intern ${name || email} has been blocked`,
        record: blockedRecord,
      });
    }

    // Action 4: Unblock intern
    if (action === 'unblock_intern') {
      const { email } = body;
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      unblockIntern(email);

      // Also update ambassadors table if exists
      try {
        await supabase
          .from('ambassadors')
          .update({ status: 'Active' })
          .eq('email', email.toLowerCase().trim());
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }

      return NextResponse.json({
        success: true,
        message: `Intern ${email} has been unblocked`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in admin interns POST:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

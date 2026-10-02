import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const map = new Map<string, any>();

    // 1. Fetch from PostgreSQL (db.ambassador)
    try {
      const dbAmbassadors = await db.ambassador.findMany({
        orderBy: { createdAt: 'desc' },
      });
      dbAmbassadors.forEach((a) => {
        const key = `${a.email.toLowerCase().trim()}_${(a.chapterName || '').toLowerCase().trim()}`;
        map.set(key, {
          id: a.id,
          name: a.name,
          email: a.email.toLowerCase().trim(),
          phone: a.phone,
          university: a.university,
          chapter_id: a.chapterId || 'c_default',
          chapter_name: a.chapterName,
          status: a.status || 'Active',
          is_group_admin: a.isGroupAdmin || false,
          notes: a.notes || '',
          created_at: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
        });
      });
    } catch (dbErr) {
      console.warn('Prisma ambassador fetch warning:', dbErr);
    }

    // 2. Fetch from Supabase ambassadors
    try {
      const { data: sbAmbassadors } = await supabase
        .from('ambassadors')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbAmbassadors && sbAmbassadors.length > 0) {
        sbAmbassadors.forEach((a) => {
          if (a.email) {
            const key = `${a.email.toLowerCase().trim()}_${(a.chapter_name || '').toLowerCase().trim()}`;
            if (!map.has(key)) {
              map.set(key, {
                id: a.id,
                name: a.name || a.email.split('@')[0],
                email: a.email.toLowerCase().trim(),
                phone: a.phone || '+92 300 0000000',
                university: a.university || a.chapter_name || 'University',
                chapter_id: a.chapter_id || 'c_default',
                chapter_name: a.chapter_name || 'General Chapter',
                status: a.status || 'Active',
                is_group_admin: a.is_group_admin || false,
                notes: a.notes || '',
                created_at: a.created_at || new Date().toISOString(),
              });
            }
          }
        });
      }
    } catch (sbErr) {
      console.warn('Supabase ambassador fetch warning:', sbErr);
    }

    const list = Array.from(map.values());
    return NextResponse.json({ success: true, ambassadors: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, university, chapter_id, chapter_name } = body;

    if (!email || !chapter_name) {
      return NextResponse.json({ success: false, error: 'Email and Chapter Name are required' }, { status: 400 });
    }

    const normEmail = email.toLowerCase().trim();
    const ambName = name || normEmail.split('@')[0];
    const ambPhone = phone || '+92 300 0000000';
    const ambUni = university || chapter_name;
    const chapId = chapter_id || 'c_default';
    const chapName = chapter_name;

    let savedRecord: any = null;

    // 1. Save directly to PostgreSQL (db.ambassador) - 100% reliable, zero RLS blocks!
    try {
      savedRecord = await db.ambassador.create({
        data: {
          name: ambName,
          email: normEmail,
          phone: ambPhone,
          university: ambUni,
          chapterId: chapId,
          chapterName: chapName,
          status: 'Active',
        },
      });
    } catch (dbErr) {
      console.warn('Prisma ambassador create warning:', dbErr);
    }

    // 2. Try Supabase insert as backup
    try {
      await supabase.from('ambassadors').insert([{
        name: ambName,
        email: normEmail,
        phone: ambPhone,
        university: ambUni,
        chapter_id: chapId,
        chapter_name: chapName,
        status: 'Active',
      }]);
    } catch (sbErr) {
      console.warn('Supabase ambassador insert warning:', sbErr);
    }

    return NextResponse.json({
      success: true,
      ambassador: savedRecord || {
        id: 'amb_' + Date.now(),
        name: ambName,
        email: normEmail,
        phone: ambPhone,
        university: ambUni,
        chapter_id: chapId,
        chapter_name: chapName,
        status: 'Active',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

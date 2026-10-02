import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ambassadors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ambassadors: data || [] });
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

    // Check if existing ambassador
    const { data: existing } = await supabase
      .from('ambassadors')
      .select('id')
      .eq('email', normEmail)
      .eq('chapter_name', chapter_name)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already registered', ambassador: existing });
    }

    // Insert into Supabase ambassadors
    const { data: newAmb, error: insertErr } = await supabase
      .from('ambassadors')
      .insert([{
        name: name || normEmail.split('@')[0],
        email: normEmail,
        phone: phone || '+92 300 0000000',
        university: university || chapter_name,
        chapter_id: chapter_id || 'c_default',
        chapter_name: chapter_name,
        status: 'Active'
      }])
      .select()
      .single();

    if (insertErr) {
      console.warn('Supabase ambassador insert warning:', insertErr);
    }

    // Increment chapter members_count in Supabase if chapter_id is provided
    if (chapter_id) {
      try {
        const { data: chap } = await supabase.from('chapters').select('members_count').eq('id', chapter_id).maybeSingle();
        if (chap) {
          await supabase.from('chapters').update({ members_count: (chap.members_count || 0) + 1 }).eq('id', chapter_id);
        }
      } catch (cErr) {
        console.warn('Chapter members_count update warning:', cErr);
      }
    }

    return NextResponse.json({ success: true, ambassador: newAmb || { name, email: normEmail, phone, chapter_name } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

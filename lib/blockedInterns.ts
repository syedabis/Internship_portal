import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const BLOCKED_FILE_PATH = path.join(process.cwd(), 'blocked_interns.json');

export interface BlockedInternRecord {
  email: string;
  name?: string;
  reason: string;
  blockedAt: string;
  blockedBy?: string;
}

/**
 * Reads blocked interns from local JSON file & Supabase ambassadors table (status = 'Blocked').
 */
export async function getBlockedInterns(): Promise<Map<string, BlockedInternRecord>> {
  const map = new Map<string, BlockedInternRecord>();

  // 1. Load records from local JSON file
  try {
    if (fs.existsSync(BLOCKED_FILE_PATH)) {
      const content = fs.readFileSync(BLOCKED_FILE_PATH, 'utf8');
      const list: BlockedInternRecord[] = JSON.parse(content);
      list.forEach(item => {
        if (item.email) {
          const norm = item.email.toLowerCase().trim();
          map.set(norm, {
            email: norm,
            name: item.name || '',
            reason: item.reason || 'Due to inconsistent performance and unfulfilled milestone requirements',
            blockedAt: item.blockedAt || new Date().toISOString(),
            blockedBy: item.blockedBy || 'Admin',
          });
        }
      });
    }
  } catch (err) {
    console.warn('Error reading blocked_interns.json:', err);
  }

  // 2. Sync with Supabase ambassadors table (status = 'Blocked')
  try {
    const { data, error } = await supabase
      .from('ambassadors')
      .select('email, name, status, created_at')
      .eq('status', 'Blocked');

    if (!error && data && data.length > 0) {
      data.forEach(item => {
        if (item.email) {
          const norm = item.email.toLowerCase().trim();
          if (!map.has(norm)) {
            map.set(norm, {
              email: norm,
              name: item.name || '',
              reason: 'Due to inconsistent performance and unfulfilled milestone requirements',
              blockedAt: item.created_at || new Date().toISOString(),
              blockedBy: 'Admin',
            });
          }
        }
      });
    }
  } catch (sbErr) {
    console.warn('Supabase query for blocked ambassadors warning:', sbErr);
  }

  return map;
}

export function saveBlockedInternsJson(records: BlockedInternRecord[]) {
  try {
    fs.writeFileSync(BLOCKED_FILE_PATH, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving blocked_interns.json:', err);
  }
}

export async function blockIntern(
  email: string,
  reason: string,
  name?: string,
  blockedBy?: string
): Promise<BlockedInternRecord> {
  const normalized = email.toLowerCase().trim();
  const defaultReason = 'Due to inconsistent performance and unfulfilled milestone requirements';
  const finalReason = reason || defaultReason;
  const finalBlockedBy = blockedBy || 'Admin';

  const record: BlockedInternRecord = {
    email: normalized,
    name: name || '',
    reason: finalReason,
    blockedAt: new Date().toISOString(),
    blockedBy: finalBlockedBy,
  };

  // 1. Update/Insert into Supabase ambassadors table with status = 'Blocked'
  try {
    const { data: existing } = await supabase
      .from('ambassadors')
      .select('id')
      .eq('email', normalized)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('ambassadors')
        .update({ status: 'Blocked' })
        .eq('email', normalized);
    } else {
      await supabase
        .from('ambassadors')
        .insert([{
          name: name || normalized.split('@')[0],
          email: normalized,
          phone: '+92 300 0000000',
          chapter_name: 'Blocked Candidate',
          status: 'Blocked',
        }]);
    }
  } catch (sbErr) {
    console.warn('Supabase status update error when blocking intern:', sbErr);
  }

  // 2. Save to local JSON file
  const map = await getBlockedInterns();
  map.set(normalized, record);
  saveBlockedInternsJson(Array.from(map.values()));

  return record;
}

export async function unblockIntern(email: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();

  // 1. Update status in Supabase ambassadors table to 'Active'
  try {
    await supabase
      .from('ambassadors')
      .update({ status: 'Active' })
      .eq('email', normalized);
  } catch (sbErr) {
    console.warn('Supabase status update error when unblocking intern:', sbErr);
  }

  // 2. Update local JSON file
  const map = await getBlockedInterns();
  let found = map.has(normalized);
  if (found) {
    map.delete(normalized);
    saveBlockedInternsJson(Array.from(map.values()));
  }

  return found;
}

export async function checkInternBlocked(
  email: string | null | undefined
): Promise<{ isBlocked: boolean; record?: BlockedInternRecord }> {
  if (!email) return { isBlocked: false };
  const normalized = email.toLowerCase().trim();

  // 1. Check local JSON map
  const map = await getBlockedInterns();
  let record = map.get(normalized);

  if (record) {
    return { isBlocked: true, record };
  }

  // 2. Fallback check directly in Supabase
  try {
    const { data, error } = await supabase
      .from('ambassadors')
      .select('email, name, status, created_at')
      .eq('email', normalized)
      .eq('status', 'Blocked')
      .maybeSingle();

    if (!error && data) {
      const rec: BlockedInternRecord = {
        email: normalized,
        name: data.name || '',
        reason: 'Due to inconsistent performance and unfulfilled milestone requirements',
        blockedAt: data.created_at || new Date().toISOString(),
        blockedBy: 'Admin',
      };
      return { isBlocked: true, record: rec };
    }
  } catch (sbErr) {
    console.warn('Supabase check for blocked status warning:', sbErr);
  }

  return { isBlocked: false };
}

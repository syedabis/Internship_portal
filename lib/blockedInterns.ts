import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
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
 * Reads blocked interns from Prisma PostgreSQL DB first, falling back to local JSON file.
 */
export async function getBlockedInterns(): Promise<Map<string, BlockedInternRecord>> {
  const map = new Map<string, BlockedInternRecord>();

  // 1. Primary source: Prisma PostgreSQL database (internship_blocked_interns)
  try {
    const dbRecords = await db.blockedIntern.findMany();
    if (dbRecords && dbRecords.length > 0) {
      dbRecords.forEach(item => {
        if (item.email) {
          const norm = item.email.toLowerCase().trim();
          map.set(norm, {
            email: norm,
            name: item.name || '',
            reason: item.reason || 'Due to inconsistent performance and unfulfilled milestone requirements',
            blockedAt: item.blockedAt ? item.blockedAt.toISOString() : new Date().toISOString(),
            blockedBy: item.blockedBy || 'Admin',
          });
        }
      });
      return map;
    }
  } catch (dbErr) {
    console.warn('Prisma db.blockedIntern.findMany fallback to local JSON:', dbErr);
  }

  // 2. Fallback: local JSON file
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

  // 1. Save to Prisma PostgreSQL database (bypasses Supabase RLS policies & survives Vercel refreshes)
  try {
    await db.blockedIntern.upsert({
      where: { email: normalized },
      update: {
        name: name || '',
        reason: finalReason,
        blockedBy: finalBlockedBy,
        blockedAt: new Date(),
      },
      create: {
        email: normalized,
        name: name || '',
        reason: finalReason,
        blockedBy: finalBlockedBy,
        blockedAt: new Date(),
      },
    });
  } catch (dbErr) {
    console.error('Error saving blocked intern to Prisma DB:', dbErr);
  }

  // 2. Also attempt Supabase ambassador status update if row exists
  try {
    await supabase
      .from('ambassadors')
      .update({ status: 'Blocked' })
      .eq('email', normalized);
  } catch (sbErr) {
    console.warn('Supabase status update info:', sbErr);
  }

  // 3. Save to local JSON file fallback
  const map = await getBlockedInterns();
  map.set(normalized, record);
  saveBlockedInternsJson(Array.from(map.values()));

  return record;
}

export async function unblockIntern(email: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();

  // 1. Delete from Prisma PostgreSQL database
  try {
    await db.blockedIntern.deleteMany({
      where: { email: normalized },
    });
  } catch (dbErr) {
    console.error('Error deleting blocked intern from Prisma DB:', dbErr);
  }

  // 2. Update status in Supabase ambassadors table if exists
  try {
    await supabase
      .from('ambassadors')
      .update({ status: 'Active' })
      .eq('email', normalized);
  } catch (sbErr) {
    console.warn('Supabase status update info:', sbErr);
  }

  // 3. Update local JSON file
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

  // 1. Check Prisma DB directly
  try {
    const dbRecord = await db.blockedIntern.findUnique({
      where: { email: normalized },
    });
    if (dbRecord) {
      const record: BlockedInternRecord = {
        email: normalized,
        name: dbRecord.name || '',
        reason: dbRecord.reason || 'Due to inconsistent performance and unfulfilled milestone requirements',
        blockedAt: dbRecord.blockedAt ? dbRecord.blockedAt.toISOString() : new Date().toISOString(),
        blockedBy: dbRecord.blockedBy || 'Admin',
      };
      return { isBlocked: true, record };
    }
  } catch (dbErr) {
    console.warn('DB check for blocked intern warning:', dbErr);
  }

  // 2. Fallback check in local map
  const map = await getBlockedInterns();
  const record = map.get(normalized);
  return {
    isBlocked: !!record,
    record,
  };
}

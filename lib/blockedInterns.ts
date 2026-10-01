import fs from 'fs';
import path from 'path';

const BLOCKED_FILE_PATH = path.join(process.cwd(), 'blocked_interns.json');

export interface BlockedInternRecord {
  email: string;
  name?: string;
  reason: string;
  blockedAt: string;
  blockedBy?: string;
}

export function getBlockedInterns(): Map<string, BlockedInternRecord> {
  const map = new Map<string, BlockedInternRecord>();
  try {
    if (fs.existsSync(BLOCKED_FILE_PATH)) {
      const content = fs.readFileSync(BLOCKED_FILE_PATH, 'utf8');
      const list: BlockedInternRecord[] = JSON.parse(content);
      list.forEach(item => {
        if (item.email) {
          map.set(item.email.toLowerCase().trim(), item);
        }
      });
    }
  } catch (err) {
    console.warn('Error reading blocked_interns.json:', err);
  }
  return map;
}

export function saveBlockedInterns(records: BlockedInternRecord[]) {
  try {
    fs.writeFileSync(BLOCKED_FILE_PATH, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving blocked_interns.json:', err);
  }
}

export function blockIntern(email: string, reason: string, name?: string, blockedBy?: string): BlockedInternRecord {
  const normalized = email.toLowerCase().trim();
  const map = getBlockedInterns();
  
  const record: BlockedInternRecord = {
    email: normalized,
    name: name || '',
    reason: reason || 'Due to inconsistent performance and unfulfilled milestone requirements',
    blockedAt: new Date().toISOString(),
    blockedBy: blockedBy || 'Admin',
  };

  map.set(normalized, record);
  saveBlockedInterns(Array.from(map.values()));
  return record;
}

export function unblockIntern(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  const map = getBlockedInterns();
  if (map.has(normalized)) {
    map.delete(normalized);
    saveBlockedInterns(Array.from(map.values()));
    return true;
  }
  return false;
}

export function checkInternBlocked(email: string | null | undefined): { isBlocked: boolean; record?: BlockedInternRecord } {
  if (!email) return { isBlocked: false };
  const normalized = email.toLowerCase().trim();
  const map = getBlockedInterns();
  const record = map.get(normalized);
  return {
    isBlocked: !!record,
    record,
  };
}

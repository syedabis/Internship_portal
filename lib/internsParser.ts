export interface RawInternRow {
  candidateId: string;
  name: string;
  email: string;
  phone?: string;
  domain: string;
  university: string;
  score?: string;
  offerStatus: string;
  offerSentDate?: string;
  responseDate?: string;
  whatsappLinkStatus?: string;
  whatsappSentDate?: string;
  replySent?: string;
  replySentDate?: string;
  aiIntent?: string;
  aiConfidence?: string;
  aiSummary?: string;
  emailReplySnippet?: string;
}

export interface MergedInternRecord extends RawInternRow {
  hasJoinedGroup: boolean;
  joinedChapterId?: string;
  joinedChapterName?: string;
  joinedPhone?: string;
  joinedAt?: string;
  chapterWhatsappLink?: string;
  isBlocked?: boolean;
  blockedReason?: string;
  blockedAt?: string;
}

/**
 * Robust CSV parser handling escaped quotes, embedded commas, and CRLF line breaks.
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentVal.trim());
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Parses raw CSV string of interns into typed RawInternRow records.
 */
export function parseInternsCSV(csvContent: string): RawInternRow[] {
  const rawRows = parseCSV(csvContent);
  if (rawRows.length <= 1) return [];

  const headers = rawRows[0].map(h => h.toLowerCase().trim());
  const getCol = (row: string[], colName: string) => {
    const idx = headers.findIndex(h => h.includes(colName.toLowerCase()));
    return idx !== -1 && row[idx] !== undefined ? row[idx] : '';
  };

  const interns: RawInternRow[] = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0 || !row[0]) continue;

    const candidateId = getCol(row, 'candidate id') || row[0] || `cand-${i}`;
    const name = getCol(row, 'candidate name') || row[1] || 'Unknown';
    const email = getCol(row, 'email address') || row[2] || '';
    const domain = getCol(row, 'domain') || row[3] || 'ChangerMaker';
    const university = getCol(row, 'university') || row[4] || '';
    const phone = getCol(row, 'phone') || getCol(row, 'mobile') || getCol(row, 'contact') || getCol(row, 'whatsapp number') || '';
    const score = getCol(row, 'score');
    const offerStatus = getCol(row, 'offer status') || 'ACCEPTED';
    const offerSentDate = getCol(row, 'offer sent date');
    const responseDate = getCol(row, 'response date') || getCol(row, 'signed');
    const whatsappLinkStatus = getCol(row, 'whatsapp link status');
    const whatsappSentDate = getCol(row, 'whatsapp sent date');
    const replySent = getCol(row, 'reply sent?');
    const replySentDate = getCol(row, 'reply sent date');
    const aiIntent = getCol(row, 'ai intent');
    const aiConfidence = getCol(row, 'ai confidence');
    const aiSummary = getCol(row, 'ai summary');
    const emailReplySnippet = getCol(row, 'email reply snippet');

    interns.push({
      candidateId,
      name,
      email,
      phone,
      domain,
      university,
      score,
      offerStatus,
      offerSentDate,
      responseDate,
      whatsappLinkStatus,
      whatsappSentDate,
      replySent,
      replySentDate,
      aiIntent,
      aiConfidence,
      aiSummary,
      emailReplySnippet,
    });
  }

  return interns;
}

/**
 * Parses number_email - Applications.csv to extract phone numbers mapped by email and candidate name.
 */
export function loadApplicationsPhoneMap(applicationsCsvContent: string): {
  byEmail: Map<string, string>;
  byName: Map<string, string>;
} {
  const byEmail = new Map<string, string>();
  const byName = new Map<string, string>();

  const rows = parseCSV(applicationsCsvContent);
  if (rows.length <= 1) return { byEmail, byName };

  const headers = rows[0].map(h => h.toLowerCase().trim());
  const nameIdx = headers.findIndex(h => h.includes('name'));
  const emailIdx = headers.findIndex(h => h.includes('email'));
  const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('contact') || h.includes('mobile'));

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim().toLowerCase() : '';
    const email = emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim().toLowerCase() : '';
    const phone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].trim() : '';

    if (phone) {
      if (email) byEmail.set(email, phone);
      if (name) byName.set(name, phone);
    }
  }

  return { byEmail, byName };
}

/**
 * Cross-references interns with ambassadors and chapters to identify who joined which group.
 */
export function mergeInternsWithGroups(
  interns: RawInternRow[],
  ambassadors: Array<{
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    chapter_id?: string;
    chapter_name: string;
    created_at?: string;
  }>,
  chapters: Array<{
    id: string;
    name: string;
    whatsapp_link?: string;
  }>,
  phoneMap?: {
    byEmail: Map<string, string>;
    byName: Map<string, string>;
  },
  blockedMap?: Map<string, { email: string; reason: string; blockedAt: string }>
): MergedInternRecord[] {
  const chapterMap = new Map<string, { id: string; name: string; whatsapp_link?: string }>();
  chapters.forEach(c => {
    chapterMap.set(c.id, c);
    chapterMap.set(c.name.toLowerCase().trim(), c);
  });

  return interns.map(intern => {
    const normEmail = intern.email.toLowerCase().trim();
    const normName = intern.name.toLowerCase().trim();

    // Check if intern is blocked / failed
    const blockedInfo = blockedMap?.get(normEmail);
    const isBlocked = !!blockedInfo;
    const blockedReason = blockedInfo?.reason;
    const blockedAt = blockedInfo?.blockedAt;

    // Look up real phone number from Applications data
    const appPhone = phoneMap?.byEmail.get(normEmail) || phoneMap?.byName.get(normName) || '';

    // Match against registered ambassadors by email, or name fallback
    const match = ambassadors.find(a => {
      const aEmail = (a.email || '').toLowerCase().trim();
      if (aEmail && normEmail && aEmail === normEmail) return true;
      const aName = (a.name || '').toLowerCase().trim();
      return aName && normName && (aName === normName || aName.includes(normName) || normName.includes(aName));
    });

    // Check if ambassador phone is a real number (not placeholder +92 300 0000000)
    const matchPhoneIsPlaceholder = match?.phone === '+92 300 0000000';
    const resolvedPhone = (!matchPhoneIsPlaceholder && match?.phone) || appPhone || intern.phone || match?.phone || '';

    if (match) {
      const matchedChapter = (match.chapter_id && chapterMap.get(match.chapter_id)) ||
        chapterMap.get((match.chapter_name || '').toLowerCase().trim());

      return {
        ...intern,
        phone: resolvedPhone,
        hasJoinedGroup: true,
        joinedChapterId: match.chapter_id || matchedChapter?.id,
        joinedChapterName: match.chapter_name || matchedChapter?.name,
        joinedPhone: resolvedPhone,
        joinedAt: match.created_at,
        chapterWhatsappLink: matchedChapter?.whatsapp_link,
        isBlocked,
        blockedReason,
        blockedAt,
      };
    }

    return {
      ...intern,
      phone: resolvedPhone,
      hasJoinedGroup: false,
      joinedPhone: resolvedPhone,
      isBlocked,
      blockedReason,
      blockedAt,
    };
  });
}

import type { LinkItem, Profile } from './types';
import localProfile from '../data/profile.json';

/**
 * Convert Google Drive sharing link to direct image display URL
 */
function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // Pattern: https://drive.google.com/file/d/ID/view...
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Pattern: https://drive.google.com/open?id=ID
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  return trimmed;
}

interface SheetFetchResult {
  links: LinkItem[];
  avatar?: string;
  name?: string;
  bio?: string;
}

/**
 * Fetch links and profile overrides dynamically from Google Sheets (Headless CMS).
 * Requirement on Google Sheet: "Anyone with the link can view".
 */
export async function fetchFromGoogleSheets(sheetId: string): Promise<SheetFetchResult> {
  const fallbackLinks = (localProfile as Profile).links || [];

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.warn(`[CMS] Failed to fetch Google Sheet (${res.status}): ${res.statusText}`);
      return { links: fallbackLinks };
    }

    const text = await res.text();
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!jsonMatch || !jsonMatch[1]) {
      console.warn('[CMS] Invalid Google Sheet response format');
      return { links: fallbackLinks };
    }

    const data = JSON.parse(jsonMatch[1]);
    const table = data.table;
    if (!table || !table.rows) {
      return { links: fallbackLinks };
    }

    const rows = table.rows;
    const links: LinkItem[] = [];
    let customAvatar: string | undefined;
    let customName: string | undefined;
    let customBio: string | undefined;

    for (let i = 0; i < rows.length; i++) {
      const c = rows[i].c;
      if (!c || !c[1]) continue;

      const id = c[0]?.v?.toString()?.trim() || `${i + 1}`;
      const title = c[1]?.v?.toString()?.trim() || '';
      let targetUrl = c[3]?.v?.toString()?.trim() || '';

      // Skip the header row if present
      const lowerTitle = title.toLowerCase();
      const lowerId = id.toLowerCase();
      if (lowerTitle === 'title' || lowerTitle === 'tên' || targetUrl.toLowerCase() === 'url') {
        continue;
      }

      // Check if this row is a profile configuration row
      if (lowerId === 'avatar' || lowerTitle === 'avatar' || lowerTitle === 'ảnh đại diện') {
        if (targetUrl) {
          customAvatar = normalizeImageUrl(targetUrl);
        }
        continue; // Do not render as a link card
      }

      if (lowerId === 'name' || lowerTitle === 'họ và tên') {
        customName = targetUrl || c[2]?.v?.toString()?.trim();
        continue;
      }

      if (lowerId === 'bio' || lowerTitle === 'giới thiệu') {
        customBio = targetUrl || c[2]?.v?.toString()?.trim();
        continue;
      }

      // If it's a regular link, targetUrl is required
      if (!targetUrl) continue;

      // Auto-prefix https:// if user only entered domain
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('mailto:') && !targetUrl.startsWith('tel:')) {
        targetUrl = `https://${targetUrl}`;
      }

      const subtitle = c[2]?.v?.toString()?.trim() || '';
      const icon = c[4]?.v?.toString()?.trim()?.toLowerCase() || 'link';
      const category = c[5]?.v?.toString()?.trim() || 'Liên Kết';
      
      const highlightRaw = c[6]?.v?.toString()?.toLowerCase();
      const highlight = highlightRaw === 'true' || highlightRaw === '1' || highlightRaw === 'yes';

      const pinnedRaw = c[7]?.v?.toString()?.toLowerCase();
      const pinned = pinnedRaw === 'true' || pinnedRaw === '1' || pinnedRaw === 'yes';

      const activeRaw = c[8]?.v?.toString()?.toLowerCase();
      const active = activeRaw !== 'false' && activeRaw !== '0' && activeRaw !== 'no';

      if (active) {
        links.push({
          id,
          title,
          subtitle,
          url: targetUrl,
          icon,
          category,
          highlight,
          pinned,
          active: true,
        });
      }
    }

    return {
      links: links.length > 0 ? links : fallbackLinks,
      avatar: customAvatar,
      name: customName,
      bio: customBio,
    };
  } catch (error) {
    console.error('[CMS] Error fetching from Google Sheets:', error);
    return { links: fallbackLinks };
  }
}

/**
 * Get the full profile data with links & avatar resolved from Headless CMS or local fallback
 */
export async function getProfileData(): Promise<Profile> {
  const profile = localProfile as Profile;
  const sheetId = import.meta.env.PUBLIC_GOOGLE_SHEET_ID;

  if (sheetId && sheetId.trim() !== '') {
    const sheetData = await fetchFromGoogleSheets(sheetId.trim());
    return {
      ...profile,
      links: sheetData.links,
      avatar: sheetData.avatar || profile.avatar,
      name: sheetData.name || profile.name,
      bio: sheetData.bio || profile.bio,
    };
  }

  return profile;
}

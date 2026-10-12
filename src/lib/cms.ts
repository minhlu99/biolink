import type { LinkItem, Profile } from './types';
import localProfile from '../data/profile.json';

/**
 * Fetch links dynamically from Google Sheets (used as zero-cost Headless CMS).
 * Requirement on Google Sheet: "Anyone with the link can view".
 * Endpoint: https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json
 */
export async function fetchLinksFromGoogleSheets(sheetId: string): Promise<LinkItem[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      // Cache with 30-second TTL at edge/client
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.warn(`[CMS] Failed to fetch Google Sheet (${res.status}): ${res.statusText}`);
      return (localProfile as Profile).links;
    }

    const text = await res.text();
    // Google gviz returns /*O_o*/ google.visualization.Query.setResponse({...});
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!jsonMatch || !jsonMatch[1]) {
      console.warn('[CMS] Invalid Google Sheet response format');
      return (localProfile as Profile).links;
    }

    const data = JSON.parse(jsonMatch[1]);
    const table = data.table;
    if (!table || !table.rows) {
      return (localProfile as Profile).links;
    }

    // Map column headers if present or standard indexes:
    // Col 0: id, Col 1: title, Col 2: subtitle, Col 3: url, Col 4: icon, Col 5: category, Col 6: highlight, Col 7: pinned, Col 8: active
    const rows = table.rows;
    const links: LinkItem[] = [];

    for (let i = 0; i < rows.length; i++) {
      const c = rows[i].c;
      if (!c || !c[1] || !c[3]) continue; // Title and URL are required

      const title = c[1]?.v?.toString()?.trim() || '';
      let url = c[3]?.v?.toString()?.trim() || '';

      // Skip the header row if present
      if (title.toLowerCase() === 'title' || url.toLowerCase() === 'url' || title.toLowerCase() === 'tên') {
        continue;
      }

      if (!url) continue;

      // Auto-prefix https:// if user only entered domain
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
        url = `https://${url}`;
      }

      const id = c[0]?.v?.toString()?.trim() || `${i + 1}`;
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
          url,
          icon,
          category,
          highlight,
          pinned,
          active: true,
        });
      }
    }

    return links.length > 0 ? links : (localProfile as Profile).links;
  } catch (error) {
    console.error('[CMS] Error fetching from Google Sheets:', error);
    return (localProfile as Profile).links;
  }
}

/**
 * Get the full profile data with links resolved from Headless CMS or local fallback
 */
export async function getProfileData(): Promise<Profile> {
  const profile = localProfile as Profile;
  const sheetId = import.meta.env.PUBLIC_GOOGLE_SHEET_ID;

  if (sheetId && sheetId.trim() !== '') {
    const liveLinks = await fetchLinksFromGoogleSheets(sheetId.trim());
    return {
      ...profile,
      links: liveLinks,
    };
  }

  return profile;
}

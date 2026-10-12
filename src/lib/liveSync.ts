import { processUrlAndIcon, iconRegistry } from './icons';
import type { LinkItem } from './types';

const CACHE_TIME_KEY = 'biolink_sheet_last_fetch';
const CACHE_DATA_KEY = 'biolink_sheet_cached_data';
const TTL_MS = 60 * 1000; // 60 seconds (1 minute cooldown)

function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }
  return trimmed;
}

interface ParsedSheetData {
  links: LinkItem[];
  avatar?: string;
  name?: string;
  bio?: string;
}

function parseSheetJson(jsonText: string): ParsedSheetData | null {
  try {
    const jsonMatch = jsonText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!jsonMatch || !jsonMatch[1]) return null;

    const data = JSON.parse(jsonMatch[1]);
    const table = data.table;
    if (!table || !table.rows) return null;

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

      const lowerTitle = title.toLowerCase();
      const lowerId = id.toLowerCase();
      if (lowerTitle === 'title' || lowerTitle === 'tên' || targetUrl.toLowerCase() === 'url') {
        continue;
      }

      // 1. Name configuration row
      if (lowerId === 'name' || lowerId === 'tên') {
        customName = (lowerTitle !== 'name' && lowerTitle !== 'tên' ? title : '') || c[2]?.v?.toString()?.trim() || targetUrl;
        continue;
      }
      if (lowerTitle === 'name' || lowerTitle === 'họ và tên' || lowerTitle === 'tên') {
        customName = c[2]?.v?.toString()?.trim() || targetUrl;
        continue;
      }

      // 2. Bio configuration row
      if (lowerId === 'bio' || lowerId === 'tiểu sử') {
        customBio = (lowerTitle !== 'bio' && lowerTitle !== 'tiểu sử' ? title : '') || c[2]?.v?.toString()?.trim() || targetUrl;
        continue;
      }
      if (lowerTitle === 'bio' || lowerTitle === 'giới thiệu' || lowerTitle === 'tiểu sử' || lowerTitle === 'mô tả') {
        customBio = c[2]?.v?.toString()?.trim() || targetUrl;
        continue;
      }

      // 3. Avatar configuration row
      if (lowerId === 'avatar') {
        const avatarLink = targetUrl || c[2]?.v?.toString()?.trim() || (lowerTitle !== 'avatar' ? title : '');
        if (avatarLink) customAvatar = normalizeImageUrl(avatarLink);
        continue;
      }
      if (lowerTitle === 'avatar' || lowerTitle === 'ảnh đại diện' || lowerTitle === 'avatar url') {
        const avatarLink = targetUrl || c[2]?.v?.toString()?.trim();
        if (avatarLink) customAvatar = normalizeImageUrl(avatarLink);
        continue;
      }

      if (!targetUrl) continue;

      const manualIcon = c[4]?.v?.toString()?.trim() || '';
      const { url: processedUrl, icon: detectedIcon } = processUrlAndIcon(targetUrl, manualIcon);
      const subtitle = c[2]?.v?.toString()?.trim() || '';
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
          url: processedUrl,
          icon: detectedIcon,
          category,
          highlight,
          pinned,
          active: true,
        });
      }
    }

    links.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

    return {
      links,
      avatar: customAvatar,
      name: customName,
      bio: customBio,
    };
  } catch (err) {
    console.error('[LiveSync] Error parsing Google Sheet JSON:', err);
    return null;
  }
}

function updateDOM(data: ParsedSheetData) {
  // 1. Update Avatar
  if (data.avatar) {
    const avatarImgs = document.querySelectorAll<HTMLImageElement>('header img, #qr-modal img');
    avatarImgs.forEach((img) => {
      if (img.src !== data.avatar) img.src = data.avatar!;
    });
  }

  // 2. Update Name
  if (data.name) {
    const nameEl = document.querySelector('header h1, #qr-modal-title');
    if (nameEl && nameEl.textContent !== data.name) {
      nameEl.textContent = data.name;
    }
  }

  // 3. Update Bio
  if (data.bio) {
    const bioEl = document.querySelector<HTMLElement>('header p[data-bilingual]');
    if (bioEl) {
      bioEl.setAttribute('data-bilingual', data.bio);
      const isEn = document.documentElement.lang === 'en';
      if (data.bio.includes('|')) {
        const parts = data.bio.split('|').map((s) => s.trim());
        bioEl.textContent = isEn && parts[1] ? parts[1] : parts[0];
      } else {
        bioEl.textContent = data.bio;
      }
    }
  }

  // 4. Update Link Cards
  const container = document.getElementById('links-container');
  if (!container || !data.links || data.links.length === 0) return;

  // Group by category
  const grouped: Record<string, LinkItem[]> = {};
  for (const l of data.links) {
    const cat = l.category || 'Liên Kết';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(l);
  }

  const isEn = document.documentElement.lang === 'en';
  let html = '';

  const categories = Object.keys(grouped);
  for (const cat of categories) {
    let catTitle = cat;
    if (cat.includes('|')) {
      const parts = cat.split('|').map((s) => s.trim());
      catTitle = isEn && parts[1] ? parts[1] : parts[0];
    }

    html += `<section class="w-full space-y-2.5">`;
    if (categories.length > 1 && cat !== 'Liên Kết') {
      html += `
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span data-bilingual="${cat}">${catTitle}</span>
        </h2>
      `;
    }

    html += `<div class="space-y-2.5">`;
    for (const link of grouped[cat]) {
      const iconKey = (link.icon || 'link').toLowerCase();
      const iconDef = iconRegistry[iconKey] || iconRegistry.link;
      const isPhone = iconKey === 'phone';
      const isEmail = iconKey === 'email';

      let displayTitle = link.title;
      if (link.title.includes('|')) {
        const parts = link.title.split('|').map((s) => s.trim());
        displayTitle = isEn && parts[1] ? parts[1] : parts[0];
      }

      let displaySubtitle = link.subtitle || '';
      if (displaySubtitle.includes('|')) {
        const parts = displaySubtitle.split('|').map((s) => s.trim());
        displaySubtitle = isEn && parts[1] ? parts[1] : parts[0];
      }

      const cardClass = link.highlight ? 'highlight-border-light' : 'link-card';
      const targetAttr = isPhone || isEmail ? '' : 'target="_blank" rel="noopener noreferrer"';

      html += `
        <a
          href="${link.url}"
          ${targetAttr}
          class="group relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl w-full transition-all duration-200 active:scale-[0.99] ${cardClass}"
        >
          <div class="flex items-center gap-3.5 min-w-0 pr-2">
            <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9">
              <svg
                class="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:scale-110 drop-shadow-sm ${iconDef.brandColor || 'text-slate-800'}"
                viewBox="0 0 24 24"
                fill="${iconDef.isFillOnly ? 'currentColor' : 'none'}"
                stroke="${iconDef.isFillOnly ? 'none' : 'currentColor'}"
              >${iconDef.svg}</svg>
            </div>
            <div class="min-w-0 text-left">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 
                  data-bilingual="${link.title}"
                  class="text-sm sm:text-base font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors"
                >${displayTitle}</h3>
                ${link.pinned ? `
                  <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80">
                    <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                    <span data-i18n="pinned">${isEn ? 'Pinned' : 'Ghim'}</span>
                  </span>
                ` : ''}
                ${link.highlight ? `
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm">
                    <span data-i18n="hot">Hot</span>
                  </span>
                ` : ''}
              </div>
              ${displaySubtitle ? `
                <p data-bilingual="${link.subtitle}" class="text-xs text-slate-500 truncate mt-0.5">
                  ${displaySubtitle}
                </p>
              ` : ''}
            </div>
          </div>
          <div class="flex-shrink-0 text-slate-400 group-hover:text-blue-600 transition-all duration-200 transform group-hover:translate-x-1 pl-2">
            ${isPhone ? `
              <span data-i18n="callNow" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
                ${isEn ? 'Call now' : 'Gọi ngay'}
              </span>
            ` : isEmail ? `
              <span data-i18n="sendMail" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm">
                ${isEn ? 'Email' : 'Gửi thư'}
              </span>
            ` : `
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            `}
          </div>
        </a>
      `;
    }
    html += `</div></section>`;
  }

  container.innerHTML = html;
}

export async function initLiveSync(sheetId: string) {
  if (!sheetId) return;

  const now = Date.now();
  const lastFetchStr = localStorage.getItem(CACHE_TIME_KEY);
  const lastFetch = lastFetchStr ? parseInt(lastFetchStr, 10) : 0;

  // If cached within the last 60 seconds (1 minute cooldown), use cached data to prevent over-fetching
  if (now - lastFetch < TTL_MS) {
    const cachedDataStr = localStorage.getItem(CACHE_DATA_KEY);
    if (cachedDataStr) {
      try {
        const cachedData: ParsedSheetData = JSON.parse(cachedDataStr);
        updateDOM(cachedData);
        return;
      } catch {
        // Fallback to fetch
      }
    }
  }

  // Cooldown expired (> 1 minute) -> Fetch fresh data from Google Sheet
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const res = await fetch(url);
    if (!res.ok) return;

    const text = await res.text();
    const data = parseSheetJson(text);
    if (!data) return;

    // Cache to localStorage with timestamp
    localStorage.setItem(CACHE_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIME_KEY, now.toString());

    // Update DOM seamlessly
    updateDOM(data);
  } catch (err) {
    // Fail silently, preserving existing static content
    console.debug('[LiveSync] Sheet sync offline, using current view');
  }
}

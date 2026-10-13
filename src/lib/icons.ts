/**
 * Utility to auto-detect icon, brand styling, and sanitize URLs
 */

export interface IconDefinition {
  name: string;
  svg: string;
  isFillOnly?: boolean;
  brandColor?: string; // Tailwind text & border accent
  bgAccent?: string;   // Tailwind soft background accent
}

/**
 * Detect icon name and normalize URL based on target string
 */
export function processUrlAndIcon(rawUrl: string, manualIcon?: string): { url: string; icon: string } {
  let url = (rawUrl || '').trim();
  let manual = (manualIcon || '').trim().toLowerCase();

  // 1. Phone number detection (e.g. 0912345678, +84912345678, tel:0912345678)
  const isPhone = url.startsWith('tel:') || /^(\+?[0-9\s.-]{9,15})$/.test(url);
  if (isPhone) {
    const cleanNumber = url.replace(/[^0-9+]/g, '');
    return {
      url: `tel:${cleanNumber}`,
      icon: 'phone',
    };
  }

  // 2. Email detection (e.g. mailto:abc@gmail.com, abc@gmail.com)
  const isEmail = url.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url);
  if (isEmail) {
    const cleanEmail = url.replace(/^mailto:/i, '').trim();
    return {
      url: `mailto:${cleanEmail}`,
      icon: 'email',
    };
  }

  // Ensure standard web protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // If user already specified a valid manual non-link icon, respect it unless it's just 'link'
  if (manual && manual !== 'link' && manual !== '') {
    const normalizedManual = manual === 'thread' ? 'threads' : manual;
    return { url, icon: normalizedManual };
  }

  // 3. Auto-detect from URL domains
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('threads.net') || lowerUrl.includes('threads.com')) return { url, icon: 'threads' };
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com') || lowerUrl.includes('fb.me')) return { url, icon: 'facebook' };
  if (lowerUrl.includes('tiktok.com')) return { url, icon: 'tiktok' };
  if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) return { url, icon: 'instagram' };
  if (lowerUrl.includes('zalo.me') || lowerUrl.includes('zalo.vn')) return { url, icon: 'zalo' };
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return { url, icon: 'youtube' };
  if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.me')) return { url, icon: 'telegram' };
  if (lowerUrl.includes('shopee.vn') || lowerUrl.includes('shopee.com')) return { url, icon: 'shopee' };
  if (lowerUrl.includes('github.com')) return { url, icon: 'github' };
  if (lowerUrl.includes('x.com') || lowerUrl.includes('twitter.com')) return { url, icon: 'x' };
  if (lowerUrl.includes('linkedin.com')) return { url, icon: 'linkedin' };
  if (lowerUrl.includes('m.me') || lowerUrl.includes('messenger.com')) return { url, icon: 'messenger' };
  if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp.com')) return { url, icon: 'whatsapp' };

  return { url, icon: manual || 'link' };
}

/**
 * Registry of all supported icons with SVGs and tailored brand colors
 */
export const iconRegistry: Record<string, IconDefinition> = {
  threads: {
    name: 'Threads',
    svg: `<path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098c1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015c-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164c1.43 1.783 3.631 2.698 6.54 2.717c2.623-.02 4.358-.631 5.8-2.045c1.647-1.613 1.618-3.593 1.09-4.798c-.31-.71-.873-1.3-1.634-1.75c-.192 1.352-.622 2.446-1.284 3.272c-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801c-1.063-.694-1.623-1.72-1.623-2.968c0-2.359 1.83-3.626 5.378-3.626h.896v-.615c0-1.849-.933-2.527-2.607-2.527c-.96 0-2.083.33-2.623.905l-1.306-1.378c.883-.933 2.308-1.472 3.929-1.472c2.476 0 4.542 1.157 4.542 4.417v5.992c0 .927.324 1.688.948 2.217c.725.611 1.761.854 3.109.704c1.42-.158 2.617-.872 3.456-2.065c1.11-1.564 1.173-3.955-.176-5.275c-1.63-1.597-4.225-1.921-7.797-1.921h-.963c-1.996 0-3.327.674-3.327 1.954c0 1.056.812 1.644 1.988 1.644c1.666 0 3.323-.744 3.996-2.019c.197-.375.313-.81.33-1.298V9.165h-.933c-3.13 0-4.664 1.258-4.664 3.097c0 1.096.533 1.96 1.545 2.502c.875.47 1.968.614 3.012.399c1.636-.334 2.637-1.503 2.637-3.217v-1.127z"/>`,
    isFillOnly: true,
    brandColor: 'text-black group-hover:text-black',
    bgAccent: 'bg-zinc-100 group-hover:bg-zinc-200 border-zinc-200',
  },
  facebook: {
    name: 'Facebook',
    svg: `<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#1877F2] group-hover:text-[#1877F2]',
    bgAccent: 'bg-blue-50 group-hover:bg-blue-100 border-blue-100',
  },
  messenger: {
    name: 'Messenger',
    svg: `<path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.909 1.455 5.518 3.735 7.151-.186 1.05-.678 2.665-1.725 3.702 1.48-.157 3.323-.67 4.606-1.558.455.071.923.109 1.384.109 5.523 0 10-4.145 10-9.258C20 6.145 17.523 2 12 2zm1.096 12.435l-2.607-2.78-5.086 2.78 5.594-5.937 2.673 2.78 5.02-2.78-5.594 5.937z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#0084FF] group-hover:text-[#0084FF]',
    bgAccent: 'bg-blue-50 group-hover:bg-blue-100 border-blue-100',
  },
  tiktok: {
    name: 'TikTok',
    svg: `<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23 1.01.12 2.13.88 2.82.71.65 1.73.91 2.67.73.98-.16 1.83-.87 2.17-1.8.18-.54.24-1.12.24-1.69.01-4.99.01-9.98.01-14.97z"/>`,
    isFillOnly: true,
    brandColor: 'text-black group-hover:text-black',
    bgAccent: 'bg-zinc-100 group-hover:bg-zinc-200 border-zinc-200',
  },
  instagram: {
    name: 'Instagram',
    svg: `<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#E4405F] group-hover:text-[#E4405F]',
    bgAccent: 'bg-pink-50 group-hover:bg-pink-100 border-pink-100',
  },
  zalo: {
    name: 'Zalo',
    svg: `<path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.86 7.03-.17.95-.69 2.5-1.57 3.47 1.34-.14 3.14-.64 4.35-1.52.44.07.9.11 1.36.11 5.52 0 10-4.03 10-9s-4.48-9-10-9zm-1.8 11.8h-3.6v-1.2l2.3-2.6H6.6v-1.2h3.6v1.2l-2.3 2.6h2.3v1.2zm3.8 0h-1.2V8.8h1.2v4.8zm3.6 0h-3.4V8.8h1.2v3.6h2.2v1.2z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#0068FF] group-hover:text-[#0068FF]',
    bgAccent: 'bg-blue-50 group-hover:bg-blue-100 border-blue-100',
  },
  phone: {
    name: 'Số điện thoại',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>`,
    isFillOnly: false,
    brandColor: 'text-emerald-600 group-hover:text-emerald-600',
    bgAccent: 'bg-emerald-50 group-hover:bg-emerald-100 border-emerald-100',
  },
  email: {
    name: 'Email',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>`,
    isFillOnly: false,
    brandColor: 'text-amber-600 group-hover:text-amber-600',
    bgAccent: 'bg-amber-50 group-hover:bg-amber-100 border-amber-100',
  },
  youtube: {
    name: 'YouTube',
    svg: `<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#FF0000] group-hover:text-[#FF0000]',
    bgAccent: 'bg-red-50 group-hover:bg-red-100 border-red-100',
  },
  telegram: {
    name: 'Telegram',
    svg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.03.46z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#229ED9] group-hover:text-[#229ED9]',
    bgAccent: 'bg-sky-50 group-hover:bg-sky-100 border-sky-100',
  },
  shopee: {
    name: 'Shopee',
    svg: `<path d="M19.9 8.2c-.2-.7-.6-1.3-1.2-1.7-.6-.4-1.3-.6-2-.6h-.4c-.1-1.6-.7-3.1-1.7-4.2-1-1.1-2.5-1.7-4-1.7s-3 .6-4 1.7C5.6 2.8 5 4.3 4.9 5.9h-.4c-.7 0-1.4.2-2 .6-.6.4-1 1-1.2 1.7L0 19.3c-.1.8.1 1.7.6 2.4.5.7 1.3 1.1 2.2 1.1h18.4c.9 0 1.7-.4 2.2-1.1.5-.7.7-1.6.6-2.4l-1.3-11.1zm-9.3-6.2c.9 0 1.8.4 2.5 1 .7.6 1.1 1.5 1.3 2.5H6.8c.2-1 .6-1.9 1.3-2.5.7-.6 1.6-1 2.5-1zm3.8 11.2c-.4.5-.9.9-1.5 1.2-.6.3-1.3.4-2 .4s-1.4-.1-2-.4c-.6-.3-1.1-.7-1.5-1.2-.4-.5-.6-1.1-.7-1.8H5c.1 1.1.5 2.1 1.1 2.9.7.8 1.5 1.4 2.5 1.7.5.2 1 .3 1.5.3s1-.1 1.5-.3c1-.4 1.8-1 2.5-1.7.6-.8 1-1.8 1.1-2.9h-1.6c-.1.7-.3 1.3-.7 1.8z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#EE4D2D] group-hover:text-[#EE4D2D]',
    bgAccent: 'bg-orange-50 group-hover:bg-orange-100 border-orange-100',
  },
  github: {
    name: 'GitHub',
    svg: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>`,
    isFillOnly: true,
    brandColor: 'text-black group-hover:text-black',
    bgAccent: 'bg-zinc-100 group-hover:bg-zinc-200 border-zinc-200',
  },
  x: {
    name: 'X',
    svg: `<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`,
    isFillOnly: true,
    brandColor: 'text-black group-hover:text-black',
    bgAccent: 'bg-zinc-100 group-hover:bg-zinc-200 border-zinc-200',
  },
  linkedin: {
    name: 'LinkedIn',
    svg: `<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0-.04-3.36 1.68 1.68 0 0 0 .04 3.36M5.07 18.5h2.79v-8.37H5.07v8.37z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#0A66C2] group-hover:text-[#0A66C2]',
    bgAccent: 'bg-blue-50 group-hover:bg-blue-100 border-blue-100',
  },
  whatsapp: {
    name: 'WhatsApp',
    svg: `<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>`,
    isFillOnly: true,
    brandColor: 'text-[#25D366] group-hover:text-[#25D366]',
    bgAccent: 'bg-emerald-50 group-hover:bg-emerald-100 border-emerald-100',
  },
  rocket: {
    name: 'Dự án',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>`,
    isFillOnly: false,
    brandColor: 'text-indigo-600 group-hover:text-indigo-600',
    bgAccent: 'bg-indigo-50 group-hover:bg-indigo-100 border-indigo-100',
  },
  book: {
    name: 'Sách / Blog',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`,
    isFillOnly: false,
    brandColor: 'text-teal-600 group-hover:text-teal-600',
    bgAccent: 'bg-teal-50 group-hover:bg-teal-100 border-teal-100',
  },
  calendar: {
    name: 'Lịch hẹn',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`,
    isFillOnly: false,
    brandColor: 'text-blue-600 group-hover:text-blue-600',
    bgAccent: 'bg-blue-50 group-hover:bg-blue-100 border-blue-100',
  },
  coffee: {
    name: 'Cà phê',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>`,
    isFillOnly: false,
    brandColor: 'text-amber-700 group-hover:text-amber-700',
    bgAccent: 'bg-amber-50 group-hover:bg-amber-100 border-amber-100',
  },
  globe: {
    name: 'Website',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>`,
    isFillOnly: false,
    brandColor: 'text-slate-700 group-hover:text-blue-600',
    bgAccent: 'bg-slate-100 group-hover:bg-blue-50 border-slate-200/60',
  },
  link: {
    name: 'Liên kết',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>`,
    isFillOnly: false,
    brandColor: 'text-slate-700 group-hover:text-blue-600',
    bgAccent: 'bg-slate-100 group-hover:bg-blue-50 border-slate-200/60',
  },
};

export interface SocialItem {
  platform: 'github' | 'x' | 'twitter' | 'linkedin' | 'telegram' | 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'threads' | 'discord' | 'email' | 'website';
  url: string;
  label?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
  category?: string;
  highlight?: boolean;
  pinned?: boolean;
  active?: boolean;
}

export interface Profile {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  status?: {
    text: string;
    dotColor?: string; // e.g. "bg-emerald-400"
  };
  location?: string;
  verified?: boolean;
  socials: SocialItem[];
  links: LinkItem[];
}

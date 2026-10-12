export interface SocialItem {
  platform: string;
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
  handle?: string;
  bio?: string;
  avatar?: string;
  status?: {
    text: string;
    dotColor?: string;
  };
  location?: string;
  verified?: boolean;
  socials?: SocialItem[];
  links?: LinkItem[];
}

export type ProgramStatus = "ongoing" | "completed" | "upcoming";

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailed_content?: string;
  status: ProgramStatus;
  cover_image: string;
  start_date: string;
  end_date?: string;
  location?: string;
  beneficiaries?: string;
  pillars?: string[];
}

export type ResourceCategory = 
  | "Zero Waste"
  | "Biodiversity"
  | "Climate Action"
  | "Community Guides"
  | "Eco-Living Tips";

export interface Resource {
  id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  summary: string;
  content: string;
  cover_image: string;
  read_time: string;
  read_time_minutes?: number;
  published_at: string;
  tags?: string[];
  file_url?: string;
}

export type NewsEventType = "news" | "event";

export interface NewsEvent {
  id: string;
  type: NewsEventType;
  title: string;
  slug: string;
  excerpt: string;
  summary?: string;
  body: string;
  event_date: string;
  location: string;
  cover_image: string;
  organizer?: string;
  is_featured?: boolean;
}

export type GalleryMediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  title?: string;
  album: string;
  caption: string;
  media_url: string;
  media_type: GalleryMediaType;
  video_embed_url?: string;
  location?: string;
  date?: string;
}

export type PartnerType = 
  | "Environmental NGOs"
  | "Academic & Schools"
  | "Government Units"
  | "Industry & Eco-Enterprises";

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  logo_url: string;
  website: string;
  description: string;
}

export interface Officer {
  id?: string;
  name: string;
  role: string;
  category: "Executive Leadership" | "Board of Trustees" | "Team Leads" | string;
  bio?: string;
  image?: string;
  quote?: string;
}

export interface MissionPathway {
  id: string;
  number: string;
  title: string;
  description: string;
  actionText: string;
  iconName: string;
  tag: string;
  colorVariant: "blue" | "red" | "yellow" | "green" | "brown";
}

export interface ImpactStat {
  label: string;
  value: string;
  description: string;
  iconName: string;
}

export interface SiteSettings {
  gcash_name: string;
  gcash_number: string;
  gcash_qr_url: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  contact_email: string;
  contact_phone: string;
  office_address: string;
  office_hours: string;
  email?: string;
  phone?: string;
  address?: string;
}

import { Program, Resource, NewsEvent, GalleryItem, Partner, Officer, ImpactStat, SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  gcash_name: "",
  gcash_number: "",
  gcash_qr_url: "",
  bank_name: "",
  bank_account_name: "",
  bank_account_number: "",
  contact_email: "ugnayan@kapwakalikasan.org.ph",
  contact_phone: "+63 917 829 5279",
  office_address: "Hannah Grace Bldg, Block 21 Lot 9, Mango Village, Salitran IV, 4114 City of Dasmariñas, Cavite, Philippines",
  office_hours: "Monday - Friday: 8:30 AM - 5:30 PM (PST)",
  email: "ugnayan@kapwakalikasan.org.ph",
  phone: "+63 917 829 5279",
  address: "Hannah Grace Bldg, Block 21 Lot 9, Mango Village, Salitran IV, 4114 City of Dasmariñas, Cavite, Philippines",
  dpo_name: "",
  dpo_email: "",
  stat_trees_planted: "",
  stat_volunteers: "",
  stat_waste_diverted: "",
  stat_hectares: "",
  stat_survival_rate: "",
  stat_gps_tracked: "",
  stat_donation_percentage: "",
};

export const impactStats: ImpactStat[] = [];

// Real data is strictly fetched live from Supabase. No demo or mock rows.
export const programsData: Program[] = [];
export const resourcesData: Resource[] = [];
export const newsEventsData: NewsEvent[] = [];
export const galleryData: GalleryItem[] = [];
export const defaultPartners: Partner[] = [
  {
    id: "part-1",
    name: "Haribon Foundation",
    type: "Environmental NGOs",
    logo_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80",
    website: "https://haribon.org.ph",
    description: "Pioneering biodiversity conservation, rainforest restoration, and community awareness since 1972.",
  },
  {
    id: "part-2",
    name: "Philippine Native Plants Conservation Society, Inc. (PNPCSI)",
    type: "Environmental NGOs",
    logo_url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=200&q=80",
    website: "https://pnpcsi.org",
    description: "Dedicated to the protection, preservation, and study of Philippine native trees and endemic flora.",
  },
  {
    id: "part-3",
    name: "University of the Philippines Los Baños - College of Forestry",
    type: "Academic & Schools",
    logo_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80",
    website: "https://uplb.edu.ph",
    description: "Research partner for long-term tree biomass carbon sequestration and seed nursery studies.",
  },
  {
    id: "part-4",
    name: "Ateneo Environmental Science Society",
    type: "Academic & Schools",
    logo_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=200&q=80",
    website: "https://ateneo.edu",
    description: "Youth volunteer mobilization and campus sustainability audits.",
  },
  {
    id: "part-5",
    name: "Department of Environment and Natural Resources (DENR-NCR)",
    type: "Government Units",
    logo_url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=200&q=80",
    website: "https://denr.gov.ph",
    description: "Public sector partner under the National Greening Program and protected landscape surveillance.",
  },
  {
    id: "part-6",
    name: "Quezon City Climate Change and Environmental Sustainability Dept.",
    type: "Government Units",
    logo_url: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=200&q=80",
    website: "https://quezoncity.gov.ph",
    description: "Barangay ecological solid waste management rollout and community composting nodes.",
  },
  {
    id: "part-7",
    name: "Luntiang Ani Agri-Enterprises",
    type: "Industry & Eco-Enterprises",
    logo_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=200&q=80",
    website: "https://luntiangani.ph",
    description: "Providing subsidized organic bokashi bran and buying community urban farm harvest.",
  },
  {
    id: "part-8",
    name: "Kawayan Eco-Packaging Solutions",
    type: "Industry & Eco-Enterprises",
    logo_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200&q=80",
    website: "https://kawayaneco.ph",
    description: "Funding biodegradable shoreline barriers and volunteer field kits.",
  },
];

export const partnersData: Partner[] = defaultPartners;

export const organizationVision = {
  title: "Aming Bisyon (Vision)",
  statement:
    "A Philippines where every community, bound by the deep Filipino virtue of pakikipagkapwa, lives in conscious harmony with kalikasan—protecting, restoring, and celebrating the nation’s forests, waters, coasts, and biodiversity so that present and future generations inherit a thriving, resilient natural heritage.",
  filipinoContext:
    "Isang bansang pinagbubuklod ng pakikipagkapwa, kung saan ang bawat pamayanan ay namumuhay sa ganap na kaisahan sa kalikasan para sa kasalukuyan at susunod na salinlahi.",
};

export const organizationMission = {
  title: "Aming Misyon (Mission)",
  statement:
    "Kamalayang Kapwa Kalikasan was formed to awaken environmental consciousness, be proactive in protecting and preserving the environment and nature and empower communities to become lifelong stewards of nature and champions of sustainable communities.",
  conclusion:
    "Through these pathways, we empower individuals and communities to protect and restore ecosystems, champion sustainable ways of living, and ensure that the spirit of kapwa becomes the foundation of a greener, more just Philippines.",
};

export const missionPathways = [
  {
    id: "pathway-1",
    number: "01",
    title: "Environmental Education",
    tag: "Edukasyon",
    symbolColor: "blue",
    description:
      "Equipping schools and communities with ecological literacy and practical conservation skills.",
    actionText: "Explore Resources",
    href: "/resources",
  },
  {
    id: "pathway-2",
    number: "02",
    title: "Community Empowerment",
    tag: "Komunidad",
    symbolColor: "brown",
    description:
      "Strengthening indigenous and local stewardship through sustainable livelihood and nursery programs.",
    actionText: "View Programs",
    href: "/programs",
  },
  {
    id: "pathway-3",
    number: "03",
    title: "Mobilized Volunteerism",
    tag: "Bayanihan",
    symbolColor: "red",
    description:
      "Uniting citizens for hands-on tree planting, seedbed nurturing, and coastal cleanups.",
    actionText: "Join as Volunteer",
    href: "/get-involved",
  },
  {
    id: "pathway-4",
    number: "04",
    title: "Green Partnerships",
    tag: "Katuwang",
    symbolColor: "yellow",
    description:
      "Collaborating with mission-aligned organizations and ethical businesses for lasting ecological impact.",
    actionText: "Partner With Us",
    href: "/partners",
  },
  {
    id: "pathway-5",
    number: "05",
    title: "Advocacy & Campaigns",
    tag: "Adbokasiya",
    symbolColor: "green",
    description:
      "Championing climate justice, forest protection laws, and just transitions for vulnerable ecosystems.",
    actionText: "Our Campaigns",
    href: "/news-events",
  },
];

export const officersData: Officer[] = [
  {
    name: "Jennifer Gutierrez Baltazar",
    role: "Executive Director / President",
    category: "Executive Leadership",
    bio: "Pinangungunahan ang pangkalahatang direksyon, misyon, at estratehikong pagpapatupad ng mga programang pangkalikasan at pakikipagkapwa sa buong kapuluan.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    quote: "Ang tunay na malasakit sa kapwa Pilipino ay nakatali sa ating pag-aaruga sa lupang nagpapakain sa atin.",
  },
  {
    name: "Jahziel Tayco Ferrer",
    role: "Vice President",
    category: "Executive Leadership",
    bio: "Katuwang sa pamamahala ng mga inisyatiba sa komunidad, ugnayang panlabas, at pagpapakilos ng mga boluntaryo.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    quote: "Sa proactive na aksyon, tapat na pamamahala, at bayanihan, kayang ibalik ang sigla ng ating mga kagubatan at baybayin.",
  },
  {
    name: "Zeno \"Nonoy\" O. Zuniga",
    role: "Board Member",
    category: "Board of Trustees",
    bio: "Kagawad ng Lupon na nagbibigay ng estratehikong payo sa cultural engagement at pampublikong kamalayan.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    quote: "Ang bawat puno at ilog ay may katumbas na buhay sa ating kapwa mamamayan.",
  },
  {
    name: "Ronnie Dela Cruz",
    role: "Board Member",
    category: "Board of Trustees",
    bio: "Kagawad ng Lupon na tumitiyak sa malalim na integrasyon ng mga grassroots community at lokal na sektor.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    quote: "Kailangan nating magtulungan mula sa pinakamababang barangay patungo sa pambansang antas.",
  },
  {
    name: "Beatriz Baltazar",
    role: "Tech / Marketing Lead",
    category: "Team Leads",
    bio: "Nangunguna sa digital technology, creative media campaigns, website platforms, at modernong komunikasyon.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    quote: "Ang teknolohiya at digital platforms ay sandata upang ipaglaban ang hustisya para sa ating inang kalikasan.",
  },
];

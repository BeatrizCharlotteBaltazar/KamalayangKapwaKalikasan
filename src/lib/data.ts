import { Program, Resource, NewsEvent, GalleryItem, Partner, Officer, ImpactStat, SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  gcash_name: "Kamalayang Kapwa Kalikasan Foundation Inc.",
  gcash_number: "0917-829-KAPWA (0917-829-5279)",
  gcash_qr_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
  bank_name: "Bank of the Philippine Islands (BPI)",
  bank_account_name: "Kamalayang Kapwa Kalikasan Foundation Inc.",
  bank_account_number: "3891-0428-19",
  contact_email: "ugnayan@kapwakalikasan.org.ph",
  contact_phone: "+63 (02) 8920-5381 / +63 917 829 5279",
  office_address: "HANNAH GRACE BUILDING BLOCK 21 LOT 9 MANGO VILLAGE SALITARAN IV 4114 CITY OF DASMARINAS CAVITE PHILIPPINES",
  office_hours: "Monday - Friday: 8:30 AM - 5:30 PM (PST)",
  email: "ugnayan@kapwakalikasan.org.ph",
  phone: "+63 917 829 5279",
  address: "Hannah Grace Bldg, Block 21 Lot 9, Mango Village, Salitran IV, 4114 City of Dasmariñas, Cavite, Philippines",
};

export const impactStats: ImpactStat[] = [
  {
    label: "Native Trees Planted",
    value: "48,500+",
    description: "Endemic seedlings planted across Sierra Madre & Batangas corridors",
    iconName: "Trees",
  },
  {
    label: "Active Eco-Volunteers",
    value: "3,200+",
    description: "Passionate citizens practicing pakikipagkapwa through climate action",
    iconName: "Users",
  },
  {
    label: "Plastic Waste Diverted",
    value: "142 Tons",
    description: "Recovered through coastal cleanups & barangay zero-waste systems",
    iconName: "Recycle",
  },
  {
    label: "Community Eco-Hubs",
    value: "26 Barangays",
    description: "Self-sustaining urban composting and communal food forests established",
    iconName: "Sprout",
  },
];

// Real data is strictly fetched live from Supabase. No demo or mock rows.
export const programsData: Program[] = [];
export const resourcesData: Resource[] = [];
export const newsEventsData: NewsEvent[] = [];
export const galleryData: GalleryItem[] = [];
export const partnersData: Partner[] = [];

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
    title: "Transformative Environmental Education",
    tag: "Edukasyong Makakalikasan",
    symbolColor: "blue",
    description:
      "Delivering transformative environmental education that deepens people’s connection to the land and builds skills for sustainable livelihoods.",
    actionText: "Silipin ang mga Gabay at Modules",
    href: "/resources",
  },
  {
    id: "pathway-2",
    number: "02",
    title: "Community Development & Empowerment",
    tag: "Katutubo at Komunidad",
    symbolColor: "brown",
    description:
      "Strengthening community development that integrates ecological restoration with socio-economic empowerment and shared responsibility.",
    actionText: "Tingnan ang mga Proyekto sa Pamayanan",
    href: "/programs",
  },
  {
    id: "pathway-3",
    number: "03",
    title: "Mobilized Volunteerism (Bayanihan)",
    tag: "Lakas ng Boluntaryo",
    symbolColor: "red",
    description:
      "Mobilizing volunteerism as a powerful force for collective care and local resilience across coastal and upland zones.",
    actionText: "Magpatala Bilang Volunteer",
    href: "/get-involved",
  },
  {
    id: "pathway-4",
    number: "04",
    title: "Strategic Green Partnerships",
    tag: "Katuwang sa Pagbabago",
    symbolColor: "yellow",
    description:
      "Forging strategic partnerships that guide companies toward authentic corporate social responsibility, green business practices, and inclusive economic opportunities.",
    actionText: "Makipagtulungan sa KKK",
    href: "/partners",
  },
  {
    id: "pathway-5",
    number: "05",
    title: "Proactive Campaigns & Policy Advocacy",
    tag: "Adbokasiya at Hustisya",
    symbolColor: "green",
    description:
      "Leading proactive campaigns and advocacy that confront pressing environmental threats while championing just transitions to a green economy.",
    actionText: "Sundan ang mga Kampanya",
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

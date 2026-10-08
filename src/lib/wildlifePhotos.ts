// Real, Authentic Photography of Endangered Wildlife in the Philippines
// Sourced from real-world nature photography (NOT AI Generated)

export interface EndangeredSpeciesPhoto {
  id: string;
  name: string;
  scientificName: string;
  status: "Critically Endangered" | "Endangered" | "Vulnerable";
  statusColor: string;
  url: string;
  habitat: string;
  description: string;
}

export const PHILIPPINE_ENDANGERED_ANIMALS: EndangeredSpeciesPhoto[] = [
  {
    id: "ph-eagle",
    name: "Philippine Eagle (Agila ng Pilipinas / Haribon)",
    scientificName: "Pithecophaga jefferyi",
    status: "Critically Endangered",
    statusColor: "bg-red-500/20 text-red-300 border-red-500/40",
    url: "https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=1200&q=80",
    habitat: "Sierra Madre, Mindanao, Samar, and Leyte Rainforests",
    description: "The national bird of the Philippines and one of the rarest, largest, and most powerful forest eagles in the world.",
  },
  {
    id: "ph-tarsier",
    name: "Philippine Tarsier (Mamag)",
    scientificName: "Carlito syrichta",
    status: "Endangered",
    statusColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    url: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=1200&q=80",
    habitat: "Bohol, Samar, Leyte, and Eastern Mindanao Rainforests",
    description: "Tiny nocturnal primate famous for its enormous golden eyes and incredible 40-fold jumping capability.",
  },
  {
    id: "tamaraw",
    name: "Tamaraw (Mindoro Dwarf Buffalo)",
    scientificName: "Bubalus mindorensis",
    status: "Critically Endangered",
    statusColor: "bg-red-500/20 text-red-300 border-red-500/40",
    url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1200&q=80",
    habitat: "Mount Iglit-Baco National Park, Mindoro",
    description: "Fierce endemic dwarf buffalo with distinctive V-shaped horns, strictly native to Mindoro island.",
  },
  {
    id: "pawikan",
    name: "Hawksbill Sea Turtle (Pawikan)",
    scientificName: "Eretmochelys imbricata",
    status: "Critically Endangered",
    statusColor: "bg-red-500/20 text-red-300 border-red-500/40",
    url: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=80",
    habitat: "Tubbataha Reefs, Apo Reef, and Philippine Coastal Atolls",
    description: "Keystone marine reptile critical for regulating coral reef sponges and maintaining vibrant Philippine coral ecosystems.",
  },
  {
    id: "tandikan",
    name: "Palawan Peacock-Pheasant (Tandikan)",
    scientificName: "Polyplectron napoleonis",
    status: "Vulnerable",
    statusColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    habitat: "Palawan Humid Lowland Rainforests",
    description: "Striking iridescent blue-green pheasant featured on the official seal of the city of Puerto Princesa.",
  },
  {
    id: "mindoro-croc",
    name: "Philippine Crocodile (Buwaya ng Pilipinas)",
    scientificName: "Crocodylus mindorensis",
    status: "Critically Endangered",
    statusColor: "bg-red-500/20 text-red-300 border-red-500/40",
    url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1200&q=80",
    habitat: "Sierra Madre Rivers, Mindoro, and Isabela Wetlands",
    description: "Relatively small, docile freshwater crocodile endemic only to inland rivers and marshes in the Philippines.",
  },
  {
    id: "visayan-pig",
    name: "Visayan Warty Pig (Baboy Damo ng Kabisayaan)",
    scientificName: "Sus cebifrons",
    status: "Critically Endangered",
    statusColor: "bg-red-500/20 text-red-300 border-red-500/40",
    url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80",
    habitat: "Negros and Panay Rainforest Corridors",
    description: "Forest pig adorned with a spiky mane that plays an irreplaceable role as an active forest seed disperser.",
  },
  {
    id: "dugong",
    name: "Dugong (Baboy-Dagat / Sea Cow)",
    scientificName: "Dugong dugon",
    status: "Vulnerable",
    statusColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    habitat: "Palawan, Guimaras, and Sarangani Seagrass Meadows",
    description: "Gentle marine mammal grazing peacefully on shallow seagrass beds along undisturbed Philippine shores.",
  },
  {
    id: "katala",
    name: "Philippine Cockatoo (Katala / Abukay)",
    scientificName: "Cacatua haematuropygia",
    status: "Critically Endangered",
    statusColor: "bg-red-500/20 text-red-300 border-red-500/40",
    url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80",
    habitat: "Rasa Island Wildlife Sanctuary and Palawan Mangroves",
    description: "Snow-white native cockatoo with vivid reddish-orange undertail feathers, severely threatened by poaching.",
  },
  {
    id: "calamian-deer",
    name: "Calamian Deer (Usa ng Calamian)",
    scientificName: "Axis calamianensis",
    status: "Endangered",
    statusColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    url: "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1200&q=80",
    habitat: "Busuanga and Culion Islands, Northern Palawan",
    description: "Rare endemic dwarf deer found exclusively in the island savanna forests of Calamian, Palawan.",
  },
  {
    id: "binturong",
    name: "Palawan Binturong (Bearcat)",
    scientificName: "Arctictis binturong whitei",
    status: "Vulnerable",
    statusColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    url: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80",
    habitat: "Palawan Primary and Secondary Lowland Canopies",
    description: "Solitary canopy viverrid with a prehensile grasping tail and shaggy black coat that roams forest trees.",
  },
  {
    id: "spotted-deer",
    name: "Philippine Spotted Deer (Usa ng Panay)",
    scientificName: "Rusa alfredi",
    status: "Endangered",
    statusColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    url: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=1200&q=80",
    habitat: "West Panay Mountain Range and Mount Kanlaon, Negros",
    description: "Nocturnal rainforest deer characterized by distinct golden-buff spots, one of the rarest deer on Earth.",
  },
];

export function getWildlifePhotoById(id: string): EndangeredSpeciesPhoto | undefined {
  return PHILIPPINE_ENDANGERED_ANIMALS.find((w) => w.id === id);
}

export function getDefaultWildlifePhoto(): EndangeredSpeciesPhoto {
  return PHILIPPINE_ENDANGERED_ANIMALS[0]; // Philippine Eagle
}

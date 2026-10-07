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

export const programsData: Program[] = [
  {
    id: "prog-1",
    title: "Bantay Sierra Madre: Native Reforestation",
    slug: "bantay-sierra-madre-native-reforestation",
    description: "Restoring our natural storm shield through assisted natural regeneration and indigenous community partnerships in Tanay, Rizal.",
    detailed_content: `The Sierra Madre mountain range serves as Luzon's natural barrier against destructive Pacific typhoons. Our Bantay Sierra Madre program partners with the indigenous Dumagat-Remontado ancestral domain holders to propagate endemic rainforest trees like Narra, Molave, and Kupang.

Key activities include:
• Community-managed native tree nurseries
• Geospatial tracking and long-term sapling survival monitoring (85%+ 3-year survival rate)
• Livelihood empowerment through agroforestry and stingless bee keeping
• Regular guided volunteer re-wilding treks for urban youth and civic groups`,
    status: "ongoing",
    cover_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    start_date: "2023-01-15",
    location: "Tanay & General Nakar, Sierra Madre Corridor",
    beneficiaries: "12 Indigenous Dumagat Communities & Greater Metro Manila watershed",
    pillars: ["Reforestation", "Indigenous Rights", "Watershed Protection"],
  },
  {
    id: "prog-2",
    title: "Agos ng Buhay: Manila Bay Mangrove Sanctuary",
    slug: "agos-ng-buhay-manila-bay-mangroves",
    description: "Establishing vital blue-carbon coastal buffer zones and avian sanctuaries along the Bulacan and Cavite shorelines.",
    detailed_content: `Mangroves attenuate up to 66% of wave energy during storm surges, absorb ten times more atmospheric carbon than terrestrial forests, and serve as fish nurseries. Through Agos ng Buhay, we work alongside local fisherfolk organizations (Pangisda) to rehabilitate degraded mudflats into vibrant Bakawan greenbelts.

Our methodology emphasizes:
• Planting species tailored to coastal hydrology (Rhizophora & Avicennia)
• Trash-trapping bamboo barriers to protect delicate propagules
• Youth eco-patrol training for weekly monitoring and marine litter audits`,
    status: "ongoing",
    cover_image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
    start_date: "2023-06-05",
    location: "Sasmuan & Malolos Coast, Pampanga & Bulacan",
    beneficiaries: "6 Fisherfolk Cooperatives (over 1,800 families)",
    pillars: ["Blue Carbon", "Coastal Resilience", "Fisherfolk Livelihood"],
  },
  {
    id: "prog-3",
    title: "Kapwa Kalakal: Barangay Circular Composting",
    slug: "kapwa-kalakal-barangay-circular-composting",
    description: "Transforming wet market biodegradable waste into nutrient-rich organic soil amendments for urban communal vegetable gardens.",
    detailed_content: `Organic waste accounts for more than 52% of municipal solid waste in Philippine urban centers. The Kapwa Kalakal project provides barangay material recovery facilities (MRFs) with modular bokashi and black soldier fly larvae (BSFL) composting setups.

Outcomes achieved:
• Over 60 tons of wet market food scraps diverted monthly from landfills
• 18 community vegetable patches harvesting free produce for local feeding programs
• Reductions in methane emissions and leachate contamination of local esteros`,
    status: "ongoing",
    cover_image: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=1200&q=80",
    start_date: "2024-02-01",
    location: "Quezon City, Marikina, & Pasig Barangays",
    beneficiaries: "26 Urban Barangays & 4,500 low-income households",
    pillars: ["Zero Waste", "Food Security", "Urban Ecology"],
  },
  {
    id: "prog-4",
    title: "Kabataang Kalikasan: Environmental Leadership Camp",
    slug: "kabataang-kalikasan-environmental-leadership",
    description: "Equipping high school and university student leaders with biodiversity literacy, environmental law basics, and campaign storytelling.",
    detailed_content: `Our youth boot camps immerse 50 student leaders every cohort in hands-on ecology field trips, river water quality testing, and civic lobbying clinics. Graduates run eco-clubs in their schools, driving single-use plastic phaseouts and native tree sapling drives.`,
    status: "upcoming",
    cover_image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
    start_date: "2026-11-20",
    end_date: "2026-11-23",
    location: "Mt. Makiling Educational Forest Reserve, Los Baños, Laguna",
    beneficiaries: "150 Selected High School & College Student Leaders",
    pillars: ["Youth Empowerment", "Eco-Literacy", "Advocacy"],
  },
  {
    id: "prog-5",
    title: "Oplan Daloy Malinis: Pasig Tributary Clean-up",
    slug: "oplan-daloy-malinis-pasig-tributary",
    description: "Community-led clean-up of esteros feeding into the Pasig River, paired with floating wetland bio-filters.",
    detailed_content: `Completed phase 1 in 2024 with over 45 tons of plastic debris cleared and 12 floating vetiver-grass wetlands installed to naturally bio-remediate heavy metals and excess nitrates from urban runoffs.`,
    status: "completed",
    cover_image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    start_date: "2024-03-01",
    end_date: "2024-09-30",
    location: "Estero de San Miguel & San Juan River Corridor",
    beneficiaries: "Communities along 4 major urban waterways",
    pillars: ["Clean Water", "Pollution Abatement", "Nature-Based Solutions"],
  },
];

export const resourcesData: Resource[] = [
  {
    id: "res-1",
    title: "Gabay sa Bokashi Composting para sa Tahanan at Barangay",
    slug: "gabay-sa-bokashi-composting-tahanan",
    category: "Zero Waste",
    summary: "A step-by-step practical manual on fermenting food waste (including dairy and meats) odor-free in compact urban spaces.",
    content: `Bokashi is an anaerobic fermentation process using effective microorganisms (EM-1) to break down food waste without unpleasant odors or flies. Unlike traditional thermal composting, you can safely process cooked leftovers, fish bones, dairy, and citrus peels.

### Mga Kinakailangang Kagamitan:
1. **Bokashi Bucket**: Isang 20-litro na timba na may airtight lid at spigot (faucet) sa ilalim para sa Bokashi tea.
2. **Bokashi Bran**: Bigas na binuhusan ng molasses at effective microorganisms.
3. **Pang-ipit o Tamper**: Para siksikin ang tira-tirang pagkain at pigilan ang pagpasok ng hangin.

### Hakbang-hakbang na Proseso:
1. **Hiwain**: Hiwain sa maliliit na piraso ang food scraps para mas mabilis mag-ferment.
2. **Ilatag at Budburan**: Ilatag ang mga tira sa timba, at magbudbod ng 1 hanggang 2 kutsarang Bokashi bran sa bawat layer.
3. **Pagsiksik**: Diinan gamit ang tamper para maalis ang hanging nakukulong (aerobic pockets).
4. **Isarang Mahigpit**: Panatilihing selyado ang takip. Buksan lamang kapag magdadagdag ng bagong tira.
5. **Kolektahin ang Bokashi Tea**: Kada 3 araw, buksan ang spigot. Ang likidong ito ay mayaman sa nutrients; ihalo sa tubig (1:100 ratio) bago idilig sa halaman.
6. **Ibaon sa Lupa**: Kapag puno na ang timba, hayaang magpahinga nang 2 linggo. Pagkatapos, ibaon ang fermented material sa lupa o soil factory para maging mayabong na humus sa loob ng 14 na araw.`,
    cover_image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80",
    read_time: "5 min read",
    published_at: "2026-08-14",
    tags: ["Composting", "Zero Waste", "Urban Gardening", "Bokashi"],
  },
  {
    id: "res-2",
    title: "Mga Katutubong Puno ng Pilipinas: Bakit Mahalaga ang Native Trees?",
    slug: "mga-katutubong-puno-ng-pilipinas",
    category: "Biodiversity",
    summary: "Discover why planting exotic species like Mahogany damages Philippine soil, and why Narra, Tindalo, and Banaba are vital for ecology.",
    content: `Sa loob ng maraming dekada, napakaraming tree planting programs sa bansa ang gumamit ng exotic o dayuhang mga puno tulad ng Swietenia macrophylla (Mahogany) at Gmelina arborea. Bagamat mabilis lumaki, natuklasan ng mga siyentipiko na ang mga dahon ng Mahogany ay mayroong allelopathic compounds na pumipigil sa pagtubo ng katutubong halaman sa ilalim nito, at hindi kinakain ng mga ibon at insekto sa Pilipinas.

### Ang Diwa ng Katutubong Puno (Native Trees):
Ang mga endemic at indigenous na puno tulad ng **Narra, Dao, Katmon, Molave, Tindalo, at Banaba** ay libu-libong taong umakma sa ating klima, bagyo, at lupa.

• **Katmon (Dillenia philippinensis)**: Nagbubunga ng maasim na prutas na kinakain ng Philippine deer at civet cats.
• **Banaba (Lagerstroemia speciosa)**: Kilala sa makukulay na bulaklak at halamang-gamot na nagpapatatag sa riverbanks.
• **Molave (Vitex parviflora)**: Matibay na kahoy na kayang mabuhay kahit sa matatarik na batong apog (limestone karst).

Piliin natin ang mga punong katuwang ng ating fauna upang muling sumigla ang ating kabundukan.`,
    cover_image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
    read_time: "7 min read",
    published_at: "2026-07-22",
    tags: ["Native Trees", "Reforestation", "Biodiversity", "Flora & Fauna"],
  },
  {
    id: "res-3",
    title: "Buhay Walang Sayang: Low-Waste Lifestyle sa Pamilyang Pilipino",
    slug: "low-waste-lifestyle-pamilyang-pilipino",
    category: "Eco-Living Tips",
    summary: "Practical hacks to minimize single-use plastics in wet markets, carinderias, grocery trips, and daily commuting.",
    content: `Hindi kailangang maging magastos ang pagiging eco-friendly. Sa katunayan, ang tradisyunal na kulturang Pilipino—ang pagdadala ng bayong, paggamit ng basahan mula sa lumang damit, at pagtatago ng garapon—ay likas na zero waste.

### 5 Simpleng Alituntunin:
1. **Bayong at Tupperware sa Palengke**: Dalhin ang sariling food container kapag bibili ng karne at isda upang maiwasan ang manipis na plastic labo.
2. **Tumbler at Baunan**: Laging magbaon ng sariling inuming tubig at kutsara-tinidor tuwing papasok sa opisina o paaralan.
3. **Refill Stations**: Suportahan ang mga zero-waste sari-sari store na nagbebenta ng shampoo, dishwashing liquid, at toyo gamit ang sariling bote.
4. **Pagkumpuni Bago Itapon**: Ugaliin ang "Repair before Replace". Ipa-ayos ang sapatos at tahiin ang damit.
5. **Kusang Tanggihan (Refuse)**: Tanggihan ang plastic straw, disposable cutlery, at plastic bag kung kaya namang hawakan.`,
    cover_image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    read_time: "4 min read",
    published_at: "2026-06-18",
    tags: ["Zero Waste", "Family", "Eco-Living", "Tips"],
  },
  {
    id: "res-4",
    title: "Paghahanda sa Bagyo at Baha: Komunidad Laban sa Climate Crisis",
    slug: "paghahanda-sa-bagyo-at-baha-climate-action",
    category: "Climate Action",
    summary: "Community disaster risk reduction strategies integrating nature-based drainage and emergency preparedness.",
    content: `Bilang isa sa mga bansang pinaka-apektado ng climate change, mahalaga ang sama-samang paghahanda ng barangay. Alamin kung paano magtayo ng rain garden, protektahan ang natural na daanan ng tubig, at ihanda ang Go Bag ng pamilya.`,
    cover_image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80",
    read_time: "6 min read",
    published_at: "2026-05-30",
    tags: ["Climate Action", "Disaster Preparedness", "Rainwater Harvesting"],
  },
  {
    id: "res-5",
    title: "Urban Permaculture 101: Pagtatanim sa Maliit na Bakuran at Balkonahe",
    slug: "urban-permaculture-maliit-na-bakuran",
    category: "Community Guides",
    summary: "Grow your own organic talbos ng kamote, kangkong, sili, and calamansi in recycled containers.",
    content: `Kahit nakatira sa apartment o maliit na townhouse, maaari kang maging food-secure sa pamamagitan ng vertical gardening at companion planting. Alamin ang sikreto ng natural na pest repellent gamit ang neem oil at marigold.`,
    cover_image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    read_time: "5 min read",
    published_at: "2026-04-12",
    tags: ["Permaculture", "Urban Garden", "Food Security"],
  },
];

export const newsEventsData: NewsEvent[] = [
  {
    id: "ne-1",
    type: "event",
    title: "Pista ng Kalikasan: Great Sierra Madre Tree-Growing Walk 2026",
    slug: "pista-ng-kalikasan-tree-growing-2026",
    excerpt: "Join 300 eco-volunteers as we plant 3,000 endemic Philippine dipterocarp saplings in the ancestral domain of Tanay, Rizal.",
    body: `### Magkaisa Para sa Ating Kabundukan

Inaanyayahan ang lahat ng mga tagapagtaguyod ng kalikasan na makiisa sa aming taunang **Pista ng Kalikasan: Great Sierra Madre Tree-Growing Walk**.

Sa pakikipagtulungan ng Samahan ng mga Katutubong Dumagat sa Tanay at ng Department of Environment and Natural Resources (DENR), layunin nating magtanim ng 3,000 native saplings (Narra, Apitong, at Guijo) sa mga na-degrade na bahagi ng watershed.

**Mga Detalye ng Kaganapan:**
• **Petsa:** Sabado, Nobyembre 14, 2026
• **Oras ng Pagtitipon:** 5:00 AM (Assembly at Quezon City Memorial Circle)
• **Lokasyon:** Sitio Kaliwa, Barangay Daraitan, Tanay, Rizal
• **Kontribusyon:** Libre (may optional van shuttle carpool donation na ₱350)
• **Mga Dapat Dalhin:** Reusable tumbler, pamalit na damit, trail shoes o bota, payong/kapote, at sariling lalagyan ng pagkain.

Lahat ng mga kalahok ay makatatanggap ng e-certificate of environmental stewardship at access sa GPS tracking ng kanilang pinuntahang plot.`,
    event_date: "2026-11-14",
    location: "Tanay, Rizal (Assembly in QC)",
    cover_image: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80",
    organizer: "Kamalayang Kapwa Kalikasan & Dumagat Ancestral Council",
    is_featured: true,
  },
  {
    id: "ne-2",
    type: "news",
    title: "Panalo ng Komunidad: 5,000 Bakawan Propagules Naitanim sa Bulacan Coast",
    slug: "panalo-ng-komunidad-bakawan-bulacan",
    excerpt: "Local fisherfolk and youth volunteers celebrate the successful restoration of a 4-hectare mangrove greenbelt.",
    body: `Matagumpay na nakapagtanim ng higit 5,000 propagules ng bakawan (Rhizophora mucronata) ang 120 volunteers at mangingisda sa baybayin ng Paombong, Bulacan noong nakaraang linggo.

Ang proyektong ito ay bahagi ng **Agos ng Buhay** initiative na naglalayong protektahan ang mga baybaying komunidad mula sa daluyong (storm surge) dulot ng tumitinding mga bagyo.

Ayon kay Ka Ely Rodriguez, pangulo ng Samahan ng Mangingisda sa Paombong: *"Ang bawat bakawang naitanim ay proteksyon sa aming mga bangka at pagkain para sa aming mga anak. Kapag may bakawan, may isda at alimango."*`,
    event_date: "2026-09-28",
    location: "Paombong & Hagonoy Coast, Bulacan",
    cover_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
  },
  {
    id: "ne-3",
    type: "event",
    title: "Webinar: Extended Producer Responsibility (EPR) Act at ang Papel ng Mamamayan",
    slug: "webinar-epr-act-papel-ng-mamamayan",
    excerpt: "Learn how the Philippine EPR law holds plastic-producing conglomerates accountable and what citizens can monitor.",
    body: `Ang Republic Act No. 11898 o Extended Producer Responsibility (EPR) Act ay nag-aatas sa malalaking kumpanya na bawiin ang kanilang basurang plastik. Sa webinar na ito, tatalakayin natin:
1. Ano ang responsibilidad ng brand owners sa ilalim ng batas?
2. Paano maiiwasan ang greenwashing?
3. Paano maaaring makiisa ang civil society at barangay sa waste tracking?

**Guest Speakers:** Environmental lawyers mula sa Legal Rights and Natural Resources Center (LRC) at Zero Waste Coalition.`,
    event_date: "2026-10-24",
    location: "Online via Zoom & Facebook Live",
    cover_image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    organizer: "KKK Policy & Advocacy Desk",
    is_featured: false,
  },
  {
    id: "ne-4",
    type: "news",
    title: "Bagong Eco-Hub Pormal Nang Binuksan sa Brgy. Loyola Heights",
    slug: "bagong-eco-hub-binuksan-loyola-heights",
    excerpt: "Featuring community composting chambers, seed library, and a plastic recovery drop-off point.",
    body: `Binuksan sa publiko ang ika-26 na Community Eco-Hub ng Kamalayang Kapwa Kalikasan katuwang ang lokal na pamahalaan ng Quezon City.

Ang hub ay magsisilbing sentro ng palitan ng kaalaman, kung saan maaaring dalhin ng mga residente ang kanilang food waste kapalit ng compost at native vegetable seeds.`,
    event_date: "2026-09-10",
    location: "Quezon City",
    cover_image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80",
    is_featured: false,
  },
];

export const galleryData: GalleryItem[] = [
  {
    id: "gal-1",
    album: "Tree Planting",
    caption: "Pagtatanim ng Narra at Molave seedlings sa Daraitan kasama ang kabataang volunteers.",
    media_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    location: "Tanay, Rizal",
    date: "August 2026",
  },
  {
    id: "gal-2",
    album: "Coastal Clean-up",
    caption: "Bayanihan sa paglilinis ng plastic debris at ghost fishing nets sa baybayin.",
    media_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    location: "Cavite Coastline",
    date: "September 2026",
  },
  {
    id: "gal-3",
    album: "Youth Eco-Camp",
    caption: "Mag-aaral na nagsasagawa ng water testing at biodiversity audit sa Makiling.",
    media_url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    location: "Los Baños, Laguna",
    date: "July 2026",
  },
  {
    id: "gal-4",
    album: "Community Workshops",
    caption: "Pagtuturo ng Bokashi composting at natural soil conditioning sa mga nanay ng barangay.",
    media_url: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    location: "Marikina City",
    date: "June 2026",
  },
  {
    id: "gal-5",
    album: "Community Workshops",
    caption: "Dokumentaryo: 'Ang Tinig ng Sierra Madre' - Pakikipamuhay sa mga katutubong Dumagat.",
    media_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    media_type: "video",
    video_embed_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    location: "Sierra Madre Ranges",
    date: "May 2026",
  },
  {
    id: "gal-6",
    album: "Tree Planting",
    caption: "Pag-aalaga ng native sapling nursery sa tulong ng local elder rangers.",
    media_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    location: "General Nakar, Quezon",
    date: "April 2026",
  },
  {
    id: "gal-7",
    album: "Coastal Clean-up",
    caption: "Pagtatanim ng 2,000 Rhizophora bakawan sa Malolos mangrove wetland park.",
    media_url: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    location: "Bulacan Delta",
    date: "March 2026",
  },
  {
    id: "gal-8",
    album: "Youth Eco-Camp",
    caption: "Circle of Kapwa: Reflection and pledge for environmental justice under the giant Dao tree.",
    media_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    location: "Mt. Makiling",
    date: "February 2026",
  },
];

export const partnersData: Partner[] = [
  {
    id: "part-1",
    name: "Philippine Native Plants Conservation Society (PNPCSI)",
    type: "Environmental NGOs",
    logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80",
    website: "https://pnpcsi.org",
    description: "Technical scientific advisers on endemic species propagation and habitat classification.",
  },
  {
    id: "part-2",
    name: "Dumagat-Remontado Indigenous Cultural Community",
    type: "Environmental NGOs",
    logo_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80",
    website: "https://kapwakalikasan.org.ph",
    description: "Ancestral domain guardians leading forest protection and seedling nursery management.",
  },
  {
    id: "part-3",
    name: "UP Los Baños College of Forestry and Natural Resources",
    type: "Academic & Schools",
    logo_url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=200&q=80",
    website: "https://uplb.edu.ph",
    description: "Research partner for long-term tree biomass carbon sequestration studies.",
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
    name: "James Aron Mangun",
    role: "Vice President",
    category: "Executive Leadership",
    bio: "Katuwang sa pamamahala ng mga inisyatiba sa komunidad, ugnayang panlabas, at pagpapakilos ng mga boluntaryo.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    quote: "Sa proactive na aksyon at bayanihan, kayang ibalik ang sigla ng ating mga kagubatan at baybayin.",
  },
  {
    name: "Jahziel Tayco Ferrer",
    role: "Corporate Secretary",
    category: "Executive Leadership",
    bio: "Namamahala sa legal na dokumentasyon, governance protocols, at pagsunod sa mga panuntunan ng pamahalaan.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    quote: "Ang tapat na pamamahala at transparency ang pundasyon ng pangmatagalang tiwala ng sambayanan.",
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

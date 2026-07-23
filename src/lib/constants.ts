import { Product, Collection, NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Collections', href: '/collections' },
  { label: 'Shop', href: '/shop' },
  { label: 'Stories', href: '/stories' },
  { label: 'About', href: '/about' },
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    slug: 'noir-essentials',
    name: 'Noir Essentials',
    description:
      'The quiet foundation of every wardrobe. Precise cuts in matte black and deep charcoal — pieces that earn their place by lasting decades.',
    imageUrl: '/collection-1.jpg',
    season: 'Autumn / Winter 2025',
  },
  {
    id: 'c2',
    slug: 'the-ivory-edit',
    name: 'The Ivory Edit',
    description:
      'Warm whites and natural oatmeal tones shaped into an edit of effortless ease. Each piece holds light differently depending on how you move.',
    imageUrl: '/collection-2.jpg',
    season: 'Spring / Summer 2025',
  },
  {
    id: 'c3',
    slug: 'soiree-noire',
    name: 'Soirée Noire',
    description:
      'After-dark dressing without excess. Evening silhouettes cut with architectural restraint — made to be remembered for what they leave out.',
    imageUrl: '/collection-3.jpg',
    season: 'Resort 2025',
  },
];

export const PRODUCTS: Product[] = [
  // ── Noir Essentials ──────────────────────────────────────────────
  {
    id: 'p1',
    slug: 'the-tailored-blazer',
    name: 'The Tailored Blazer',
    category: 'Outerwear',
    collection: 'c1',
    price: 890,
    images: ['/product-1.jpg'],
    imageUrl: '/product-1.jpg',
    description:
      'A blazer that holds its shape without effort. Double-faced wool with a subtle texture woven in Biella. The lining is weighted silk so it falls, not floats.',
    details: [
      'Double-faced Biella wool',
      'Weighted silk lining',
      'Single-button fastening',
      'Welt pockets',
      'Dry clean only',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Charcoal', hex: '#4A4A4A' },
    ],
    isNew: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
  },
  {
    id: 'p5',
    slug: 'wide-leg-crepe-trousers',
    name: 'Wide-Leg Crêpe Trousers',
    category: 'Bottoms',
    collection: 'c1',
    price: 620,
    images: ['/product-5.jpg'],
    imageUrl: '/product-5.jpg',
    description:
      'Trousers that move like they belong to the body. Cut wide from the hip in heavyweight crêpe that keeps its drape across a full day.',
    details: [
      'Heavyweight Italian crêpe',
      'High waist with hook-and-bar closure',
      'Side-seam pockets',
      'Pressed centre crease',
      'Dry clean only',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Graphite', hex: '#3D3D3D' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 27,
    inStock: true,
  },
  {
    id: 'p6',
    slug: 'cashmere-turtleneck',
    name: 'Cashmere Turtleneck',
    category: 'Knitwear',
    collection: 'c1',
    price: 540,
    images: ['/product-6.jpg'],
    imageUrl: '/product-6.jpg',
    description:
      'Grade-A Inner Mongolian cashmere, knitted at a tight gauge so it holds its form without pilling. The neck folds back into itself perfectly.',
    details: [
      '100% Grade-A cashmere',
      'Ribbed cuffs and hem',
      'Folded turtleneck',
      'Hand wash in cold water',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Charcoal', hex: '#4A4A4A' },
      { name: 'Midnight', hex: '#1A1A2E' },
    ],
    isNew: false,
    isBestseller: false,
    rating: 4.7,
    reviewCount: 19,
    inStock: true,
  },
  {
    id: 'p7',
    slug: 'leather-belt-bag',
    name: 'Leather Belt Bag',
    category: 'Accessories',
    collection: 'c1',
    price: 780,
    images: ['/product-7.jpg'],
    imageUrl: '/product-7.jpg',
    description:
      'Full-grain calfskin structured into a compact form. Carries more than it suggests. Wears flat against the body whether belted or held.',
    details: [
      'Full-grain French calfskin',
      'Suede interior lining',
      'Magnetic closure',
      'Adjustable leather strap',
      'Interior slip pocket',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Cognac', hex: '#8B4513' },
    ],
    isNew: true,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 14,
    inStock: true,
  },

  // ── The Ivory Edit ───────────────────────────────────────────────
  {
    id: 'p2',
    slug: 'silk-drape-blouse',
    name: 'Silk Drape Blouse',
    category: 'Tops',
    collection: 'c2',
    price: 480,
    images: ['/product-2.jpg'],
    imageUrl: '/product-2.jpg',
    description:
      'A blouse that earns the word. Washed 22mm silk cut with a loose front pleat that gathers at the cuff. The kind of top that improves with age.',
    details: [
      '100% 22mm washed silk',
      'Hidden placket',
      'Single-button cuff',
      'Hand wash or dry clean',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Oat', hex: '#D7C7B6' },
      { name: 'Stone', hex: '#C4B9A8' },
    ],
    isNew: true,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
  },
  {
    id: 'p3',
    slug: 'camel-wool-trousers',
    name: 'Camel Wool Trousers',
    category: 'Bottoms',
    collection: 'c2',
    price: 650,
    images: ['/product-3.jpg'],
    imageUrl: '/product-3.jpg',
    description:
      'British camel-wool woven into a straight-leg trouser with a natural rise. Wears equally well pressed or lived-in by the end of a long day.',
    details: [
      'British camel-blend wool',
      'Natural-rise waistband',
      'Side pockets with welt finish',
      'Dry clean only',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Sand', hex: '#D2B48C' },
    ],
    isNew: true,
    isBestseller: false,
    rating: 4.6,
    reviewCount: 23,
    inStock: true,
  },
  {
    id: 'p8',
    slug: 'ivory-wrap-dress',
    name: 'Ivory Wrap Dress',
    category: 'Dresses',
    collection: 'c2',
    price: 720,
    images: ['/product-8.jpg'],
    imageUrl: '/product-8.jpg',
    description:
      'A wrap dress that closes with intention. The matte crêpe de chine does not cling but does not float — it holds a line from shoulder to hem.',
    details: [
      '100% crêpe de chine',
      'Self-tie wrap closure',
      'Midi length',
      'Lined in silk charmeuse',
      'Dry clean only',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Ecru', hex: '#F0EAD6' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 31,
    inStock: true,
  },
  {
    id: 'p9',
    slug: 'linen-oversized-blazer',
    name: 'Linen Oversized Blazer',
    category: 'Outerwear',
    collection: 'c2',
    price: 760,
    images: ['/product-9.jpg'],
    imageUrl: '/product-9.jpg',
    description:
      'Summer-weight linen cut one size wider than expected. The lapel is notched low; the shoulders fall where they will. Worn open or not at all.',
    details: [
      '100% Italian linen',
      'Unlined for breathability',
      'Double-breasted fastening',
      'Patch pockets',
      'Machine wash cold',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Natural', hex: '#EDE0C8' },
      { name: 'Stone', hex: '#C4B9A8' },
    ],
    isNew: false,
    isBestseller: false,
    rating: 4.5,
    reviewCount: 17,
    inStock: true,
  },

  // ── Soirée Noire ─────────────────────────────────────────────────
  {
    id: 'p4',
    slug: 'structured-leather-bag',
    name: 'Structured Leather Bag',
    category: 'Accessories',
    collection: 'c3',
    price: 1250,
    images: ['/product-4.jpg'],
    imageUrl: '/product-4.jpg',
    description:
      'A bag built around the idea of a single clean line. Box-structured in full-grain calf with a single top handle and no exterior hardware worth noticing.',
    details: [
      'Full-grain French calfskin',
      'Suede-lined interior',
      'Single flush closure',
      'Detachable shoulder strap',
      'Two interior compartments',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Burgundy', hex: '#800020' },
    ],
    isNew: true,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 11,
    inStock: true,
  },
  {
    id: 'p10',
    slug: 'column-evening-gown',
    name: 'Column Evening Gown',
    category: 'Dresses',
    collection: 'c3',
    price: 1680,
    images: ['/product-10.jpg'],
    imageUrl: '/product-10.jpg',
    description:
      'A gown with nothing to prove. Heavy matte crêpe falls from a plain neckline in one unbroken line. The back is open, which is all it needs.',
    details: [
      'Heavyweight matte crêpe',
      'Open back with self-tie',
      'Floor-length',
      'Lined in silk charmeuse',
      'Dry clean only',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Midnight', hex: '#1A1A2E' },
    ],
    isNew: true,
    isBestseller: true,
    rating: 5.0,
    reviewCount: 8,
    inStock: true,
  },
  {
    id: 'p11',
    slug: 'satin-slip-dress',
    name: 'Satin Slip Dress',
    category: 'Dresses',
    collection: 'c3',
    price: 920,
    images: ['/product-11.jpg'],
    imageUrl: '/product-11.jpg',
    description:
      'Bias-cut charmeuse that moves with the body rather than over it. The straps are adjustable; the hem skims the floor. Nothing about this is accidental.',
    details: [
      '100% silk charmeuse',
      'Bias-cut construction',
      'Adjustable silk straps',
      'Midi-to-maxi length',
      'Dry clean only',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Obsidian', hex: '#0D0D0D' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
  },
  {
    id: 'p12',
    slug: 'velvet-cigarette-trousers',
    name: 'Velvet Cigarette Trousers',
    category: 'Bottoms',
    collection: 'c3',
    price: 680,
    images: ['/product-12.jpg'],
    imageUrl: '/product-12.jpg',
    description:
      'A cropped-leg trouser in Italian silk velvet. The pile runs one direction; the light runs another. Cut straight from the hip with a high waistband.',
    details: [
      'Italian silk velvet',
      'High waistband',
      'Cropped cigarette leg',
      'Concealed side zip',
      'Dry clean only',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Noir', hex: '#111111' },
      { name: 'Deep Plum', hex: '#4A1942' },
    ],
    isNew: false,
    isBestseller: false,
    rating: 4.7,
    reviewCount: 15,
    inStock: true,
  },
];

// Backward-compat alias used by homepage sections
export const NEW_ARRIVALS = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

export const ALL_CATEGORIES = ['Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Accessories', 'Knitwear'] as const;
export const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One Size'] as const;
export const PRICE_RANGE = { min: 0, max: 2000 } as const;

// ── Stories ──────────────────────────────────────────────────────────────
import { Story, LookbookCampaign } from '@/types';

export const STORIES: Story[] = [
  {
    id: 's1',
    slug: 'the-art-of-the-slow-wardrobe',
    title: 'The Art of the Slow Wardrobe',
    subtitle: 'On buying less, choosing well, and the quiet pleasure of owning things you actually reach for.',
    category: 'Essay',
    date: 'January 2025',
    readingTime: 6,
    imageUrl: '/collection-1.jpg',
    author: 'Maison Noir',
    featured: true,
    excerpt:
      'A wardrobe built slowly has a different feeling. Each piece arrived with a reason, and each one stays because it earns its place every time you open the door.',
    pullQuote:
      '"Buy the thing that frightens you slightly with its price. It will be the last one you buy."',
    content: [
      'The average garment is worn seven times before it is discarded. That number, when you sit with it, is not a statistic about fast fashion — it is a description of how most of us actually live. We buy things in a mood, wear them twice in the same week, and then forget them entirely.',
      'A slow wardrobe begins with a different question. Not "do I like this?" but "will I still reach for this in three years?" The honest answer usually narrows the field considerably.',
      'We find that our customers who return year after year are not buying more. They are buying with more certainty. They arrive knowing what they need, try it once, and leave. The transaction is almost beside the point.',
      'There is a particular confidence that comes from a wardrobe where everything fits, everything works together, and nothing was a mistake. It is not the confidence of abundance — it is the confidence of precision.',
      'The pieces that last are rarely the ones bought impulsively. They are the ones you considered for a season, perhaps saw someone else wear and never forgot, then finally allowed yourself when the moment felt right.',
      'A blazer worn for the first time in October can still feel new in March, if it is the right blazer. That is the standard we hold ourselves to — not novelty, but depth. Not the thrill of newness, but the satisfaction of permanence.',
    ],
  },
  {
    id: 's2',
    slug: 'biella-where-the-fabric-begins',
    title: 'Biella: Where the Fabric Begins',
    subtitle: "A journey to the Italian town where the world's finest wool has been woven for over five centuries.",
    category: 'Craftsmanship',
    date: 'November 2024',
    readingTime: 7,
    imageUrl: '/product-6.jpg',
    author: 'Maison Noir',
    excerpt:
      'In the foothills of the Alps, a small industrial valley has been producing the finest wools in the world since the 1400s. Biella does not advertise itself. It does not need to.',
    pullQuote:
      '"Every mill in Biella has a memory. The stones in the floor have absorbed a century of water and fibre and patience."',
    content: [
      'Drive north from Milan for an hour and the flat Lombardy plain begins to buckle. The mountains arrive quietly, as they always do in Italy — you notice them only when they are already there. Biella sits in the valley below Monte Rosa, unremarkable from the road, but the source of almost everything fine you have ever worn.',
      'The textile industry in Biella dates to the fourteenth century. Water from the Alps powered the mills; sheep from Sardinia and Spain provided the raw material. Over five centuries, the region developed an institutional knowledge that exists nowhere else on earth.',
      'The mills here do not compete with each other on price. They compete on quality in the most granular sense: the hand of the cloth, the way it recovers from a fold, how it ages. These are not things you can photograph or quantify. They are things you learn by touching thousands of bolts of fabric over many years.',
      'When we source our double-faced wool for the Tailored Blazer, we visit the same mill we have worked with since our first collection. The relationship began over two hours at a table in their sampling room, surrounded by swatches and catalogues, and it has continued every year since.',
      "The mill's master weaver once told us that the secret of Biella wool is boredom. Not the boredom of repetition, but the boredom of refusal — the discipline to not change something that is already working. In a world that treats novelty as value, Biella treats consistency as the highest form of craft.",
    ],
  },
  {
    id: 's3',
    slug: 'on-dressing-for-oneself',
    title: 'On Dressing for Oneself',
    subtitle: "Why the most elegant wardrobe is one built for your own eye, not anyone else's.",
    category: 'Style',
    date: 'October 2024',
    readingTime: 5,
    imageUrl: '/product-2.jpg',
    author: 'Maison Noir',
    excerpt:
      'There is a difference between dressing to be seen and dressing to feel correct. The former is exhausting. The latter is, once discovered, impossible to abandon.',
    pullQuote: '"Style is what you do when you stop worrying about fashion."',
    content: [
      'We are taught from an early age to dress for others. For the occasion, for the impression, for the photograph. The result is a wardrobe full of costumes — clothes that are performing a role rather than expressing a self.',
      'The shift happens differently for everyone. For some it comes with age, for some with a particularly honest friend, for some with the simple experience of trying on a piece that required no justification at all. It just felt correct.',
      'That feeling — of a garment that asks nothing of you, that simply amplifies whatever you already are — is what we try to build into every piece we make. We are not designing for a look. We are designing for a feeling.',
      'The practical result is a preference for restraint. Not minimalism as an aesthetic statement, but restraint as an edit. Everything in our range exists because we could not find a reason to remove it. The question was never "what can we add?" but "what is genuinely necessary?"',
      'A silk blouse in the right weight does more than ten blouses in the wrong one. A blazer that holds its structure across a long day earns its presence in a way that a beautiful but fragile one never quite does.',
      'Dressing for oneself is, in the end, a form of respect — for your own time, your own money, and your own body. It is the most efficient form of style there is.',
    ],
  },
  {
    id: 's4',
    slug: 'the-architecture-of-a-blazer',
    title: 'The Architecture of a Blazer',
    subtitle: 'How sixty separate components come together to make the most structurally demanding garment in a wardrobe.',
    category: 'Behind the Seams',
    date: 'September 2024',
    readingTime: 8,
    imageUrl: '/product-1.jpg',
    author: 'Maison Noir',
    excerpt:
      'A blazer is not a simple garment. It is an engineering problem — one that has been solved differently in every tailoring tradition, and never quite completely.',
    pullQuote:
      '"The shoulder is everything. If the shoulder sits correctly, the rest of the garment has permission to exist."',
    content: [
      'A well-made blazer contains between forty and sixty separate components, depending on who is counting and how strictly they define "component." The outer shell is the least of it. The real architecture is hidden — the canvas, the tape, the pad-stitching that gives a lapel its roll.',
      'In bespoke tailoring, the chest canvas is made from horsehair woven through linen. It is hand-stitched to the facing in a process that takes several hours, producing a floating structure that moves with the body rather than against it. When you touch the lapel of a properly made blazer, you are feeling the result of that work.',
      'Most contemporary jackets skip this entirely, relying on fused interfacing — a bonded layer that creates shape artificially. It works at first, but fusing separates over time and with dry cleaning. The characteristic bubbling of the chest on a mid-range blazer is the fusing giving way.',
      'Our Tailored Blazer uses a half-canvas construction — fused at the body for stability, hand-padded at the lapel and chest for movement. It is the most labour-intensive option outside full bespoke, and the one we find makes the most practical difference in how the garment behaves over years of wear.',
      'The shoulder is the hardest part. A pad that sits slightly too high or too far forward will make the wearer look narrow and slumped, however good everything else is. We went through eleven shoulder pad configurations before we found the one we use now — a compressed wool construction that holds the line without adding visual bulk.',
      'A blazer is, in the end, a piece of architecture. It has a structure, a logic, a set of problems that each solution creates. The difference between a good one and a great one is the willingness to keep solving, even when the answer is expensive.',
    ],
  },
  {
    id: 's5',
    slug: 'a-guide-to-after-dark-dressing',
    title: 'A Guide to After-Dark Dressing',
    subtitle: 'On the particular discipline of evening clothes, and why restraint is always the most powerful statement in a room.',
    category: 'Style',
    date: 'August 2024',
    readingTime: 5,
    imageUrl: '/collection-3.jpg',
    author: 'Maison Noir',
    excerpt:
      'Evening dressing has a long tradition of excess. Sequence, embellishment, colour, drama. We have always found the opposite approach more interesting.',
    pullQuote:
      '"The most powerful thing you can wear to a dinner is something that makes everyone ask where it is from — and then cannot quite describe it."',
    content: [
      'Evening clothes carry a particular pressure. The event is often significant; the stakes feel higher; the urge to do more is almost automatic. More embellishment, more colour, more statement. The result, most of the time, is clothes that are worn once and never quite again.',
      'The alternative is evening dressing built on the same principles as daywear: excellent fabric, precise cut, and nothing extraneous. A column gown in heavy matte crêpe does more in a room than a sequinned dress, because it commands attention through quality rather than volume.',
      'Satin, used correctly, achieves something that no other fabric can — a surface that changes as you move, catching light differently with every step. The bias cut of a slip dress is not a style choice; it is a structural decision that allows the fabric to follow the body rather than hold a shape around it.',
      'We think of our Soirée Noire collection as evening dressing without performance. The pieces are not trying to be noticed. They simply are what they are — very well-made, very precise, very quiet. The result, paradoxically, is that they are always the most noticed things in a room.',
      'The rule, if there is one: dress for the end of the evening, not the beginning. The clothes that still look correct at midnight — unhurried, unfussy, uncontrived — are the ones worth owning.',
    ],
  },
];

// ── Lookbook ─────────────────────────────────────────────────────────────

export const LOOKBOOK_CAMPAIGNS: LookbookCampaign[] = [
  {
    id: 'lb1',
    slug: 'autumn-ceremonies',
    title: 'Autumn Ceremonies',
    season: 'Autumn / Winter 2025',
    collectionId: 'c1',
    collectionSlug: 'noir-essentials',
    imageUrl: '/collection-1.jpg',
    quote: 'A wardrobe for the serious business of living.',
    description:
      'The new season arrives in wool and silence. Structured shapes in double-faced cloth, cut for a life lived without compromise. Every piece in Noir Essentials was designed to be the last version of itself you will ever need to buy.',
  },
  {
    id: 'lb2',
    slug: 'the-white-hours',
    title: 'The White Hours',
    season: 'Spring / Summer 2025',
    collectionId: 'c2',
    collectionSlug: 'the-ivory-edit',
    imageUrl: '/collection-2.jpg',
    quote: 'Dressed in morning light. Worn until the day runs out.',
    description:
      'There is a particular hour in early spring when everything turns the same colour as the sky. The Ivory Edit was designed for that light — warm whites and natural oatmeal tones, washed silks and unlined linens, each piece holding light differently depending on how you move.',
  },
  {
    id: 'lb3',
    slug: 'after-dark',
    title: 'After Dark',
    season: 'Resort 2025',
    collectionId: 'c3',
    collectionSlug: 'soiree-noire',
    imageUrl: '/collection-3.jpg',
    quote: 'The most powerful thing in the room says nothing at all.',
    description:
      'Evening dressing without excess. Soirée Noire offers after-dark silhouettes cut with architectural restraint — matte crêpes, bias-cut charmeuse, silk velvet in columns and cigarette lines. Pieces made to be remembered for what they leave out.',
  },
];

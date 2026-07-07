export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Configuration', href: '#configuration' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Location', href: '#location' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact Us', href: '#contact' },
];

export type Stat = { label: string; value: string };

export const overviewStats: Stat[] = [
  { label: 'Tower', value: '37 Storeys' },
  { label: 'Wings', value: '2 Wings' },
  { label: 'Land Parcel', value: '1.5 Acres' },
  { label: 'Sea View', value: '180°' },
  { label: 'Amenity Levels', value: '3 Levels' },
];

export type UnitConfig = {
  id: '3bhk' | '4bhk';
  label: string;
  sizeRange: string;
  description: string;
  image: string;
};

export const unitConfigurations: UnitConfig[] = [
  {
    id: '3bhk',
    label: '3 BHK',
    sizeRange: '1,089 – 1,407 sq. ft.',
    description:
      'Thoughtfully designed 3 BHK residences framed by sweeping sea views and cross ventilation.',
    image:
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '4bhk',
    label: '4 BHK',
    sizeRange: '1,664 – 1,898 sq. ft.',
    description:
      'Expansive 4 BHK residences designed for panoramic living with dedicated entertaining spaces.',
    image:
      'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?auto=format&fit=crop&w=1600&q=80',
  },
];

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  tag: 'Shot at Location' | "Artist's Impression";
};

export const amenityImages: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1698423847331-99b8c088a239?auto=format&fit=crop&w=1600&q=80',
    alt: 'Gazebo Pavilion',
    caption: 'Gazebo Pavilion',
    tag: "Artist's Impression",
  },
  {
    src: 'https://images.unsplash.com/photo-1641686288048-b1994a394b95?auto=format&fit=crop&w=1600&q=80',
    alt: 'Kids Outdoor Play Area',
    caption: 'Kids Outdoor Play Area',
    tag: "Artist's Impression",
  },
  {
    src: 'https://images.unsplash.com/photo-1781255276587-2470a25ea4ba?auto=format&fit=crop&w=1600&q=80',
    alt: 'Lounge Deck',
    caption: 'Lounge Deck',
    tag: "Artist's Impression",
  },
  {
    src: 'https://images.unsplash.com/photo-1758448756167-88dc934c58e4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Sky Deck',
    caption: 'Sky Deck',
    tag: "Artist's Impression",
  },
  {
    src: 'https://images.unsplash.com/photo-1660404467580-596376d681dc?auto=format&fit=crop&w=1600&q=80',
    alt: 'Spillover Lawn',
    caption: 'Spillover Lawn',
    tag: "Artist's Impression",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1776914579657-3396d13eb13e?auto=format&fit=crop&w=1600&q=80',
    alt: 'Tower exterior at dusk',
    caption: 'Tower Exterior',
    tag: 'Shot at Location',
  },
  {
    src: 'https://images.unsplash.com/photo-1707647070289-92ff4f2c76cd?auto=format&fit=crop&w=1600&q=80',
    alt: 'Matunga neighbourhood street',
    caption: 'Matunga Bylane',
    tag: 'Shot at Location',
  },
  {
    src: 'https://images.unsplash.com/photo-1683379870949-7cdb226c0c9f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Sea view from the tower',
    caption: 'Sea View',
    tag: 'Shot at Location',
  },
  {
    src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1600&q=80',
    alt: 'Rendered living room interior',
    caption: 'Living Room',
    tag: "Artist's Impression",
  },
  {
    src: 'https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?auto=format&fit=crop&w=1600&q=80',
    alt: 'Rendered rooftop deck',
    caption: 'Rooftop Deck',
    tag: "Artist's Impression",
  },
  {
    src: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&w=1600&q=80',
    alt: 'Rendered lobby',
    caption: 'Grand Lobby',
    tag: "Artist's Impression",
  },
];

export type ConnectivityCategory = {
  title: string;
  items: { label: string; distance?: string }[];
};

export const connectivityCategories: ConnectivityCategory[] = [
  {
    title: 'Transportation',
    items: [
      { label: 'Bandra-Worli Sea Link', distance: '6 km' },
      { label: 'Matunga Station', distance: '0.6 km' },
      { label: 'Western Express Highway', distance: '2.5 km' },
    ],
  },
  {
    title: 'Retail',
    items: [
      { label: 'Kohinoor Square' },
      { label: 'Phoenix Palladium' },
      { label: 'Jio World Drive' },
    ],
  },
  {
    title: 'Dining',
    items: [
      { label: 'Bastian' },
      { label: 'The Bombay Canteen' },
      { label: 'Ram Ashraya' },
      { label: 'Café Madras' },
    ],
  },
  {
    title: 'Recreation',
    items: [
      { label: 'Chatrapati Shivaji Maharaj Park' },
      { label: 'Dadar Chowpatty' },
    ],
  },
  {
    title: 'Hotels',
    items: [
      { label: "Taj Land's End" },
      { label: 'St. Regis' },
      { label: 'Sofitel' },
      { label: 'Trident' },
      { label: 'Four Seasons' },
    ],
  },
  {
    title: 'Clubs',
    items: [
      { label: 'Matunga Gymkhana' },
      { label: 'Shivaji Park Gymkhana' },
      { label: 'Park Club' },
    ],
  },
  {
    title: 'Healthcare',
    items: [
      { label: 'Hinduja Hospital', distance: '750 m' },
      { label: 'S.L. Raheja Hospital' },
    ],
  },
  {
    title: 'Education',
    items: [
      { label: 'Bombay Scottish School' },
      { label: 'R.A. Podar College' },
      { label: 'Welingkar Institute' },
    ],
  },
  {
    title: 'Future Infrastructure',
    items: [
      { label: 'Underground Metro Station', distance: '500 m' },
      { label: 'Coastal Promenade' },
    ],
  },
];

export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: 'Where is this project located?',
    answer:
      'In a quaint bylane of Matunga, Mumbai — close to the Western Express Highway, Matunga Station, and the upcoming coastal promenade.',
  },
  {
    question: 'What is the current status of the project?',
    answer:
      'This is a demo/sample listing built to showcase landing page design and is not tied to a live construction timeline.',
  },
  {
    question: 'What configurations are available?',
    answer:
      '3 BHK residences (1,089 – 1,407 sq. ft.) and 4 BHK residences (1,664 – 1,898 sq. ft.).',
  },
  {
    question: 'Why should I consider a home here?',
    answer:
      'Sweeping 180° sea views, a prime Matunga location, and amenities spread across three levels make this an example of a premium coastal residence.',
  },
];

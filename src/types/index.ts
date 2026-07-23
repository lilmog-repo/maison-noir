export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'Outerwear' | 'Tops' | 'Bottoms' | 'Dresses' | 'Accessories' | 'Knitwear';
  collection: string;
  price: number;
  originalPrice?: number;
  images: string[];
  imageUrl: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: ProductColor[];
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  season: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'bestsellers'
  | 'name-asc';

export interface FilterState {
  categories: string[];
  collections: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  inStockOnly: boolean;
  newArrivalsOnly: boolean;
  bestSellersOnly: boolean;
  sort: SortOption;
}

export type StoryCategory = 'Essay' | 'Craftsmanship' | 'Style' | 'Culture' | 'Behind the Seams';

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: StoryCategory;
  date: string;
  readingTime: number;
  imageUrl: string;
  excerpt: string;
  content: string[];
  pullQuote?: string;
  featured?: boolean;
  author: string;
}

export interface LookbookCampaign {
  id: string;
  slug: string;
  title: string;
  season: string;
  collectionId: string;
  collectionSlug: string;
  imageUrl: string;
  quote: string;
  description: string;
}

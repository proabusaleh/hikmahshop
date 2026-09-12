export interface ApiProductVariant {
  id: number;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  attributes: { attribute: string | null; value: string; color?: string | null }[];
}

export interface ApiProductImage {
  id: number;
  url: string;
  thumbnail?: string;
  alt?: string;
  color?: string | null;
  is_main?: boolean;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  original_price?: number | null;
  effective_price: number;
  discount_percentage?: number;
  rating: number;
  review_count: number;
  sales_count: number;
  stock: number;
  in_stock?: boolean;
  is_new?: boolean;
  is_featured?: boolean;
  is_flash_sale?: boolean;
  flash_end?: string | null;
  image?: string;
  thumbnail?: string;
  short_description?: string;
  description?: string;
  category?: { id: number; name: string; slug: string; icon?: string } | null;
  brand?: { id: number; name: string } | null;
  images?: ApiProductImage[];
  variants?: ApiProductVariant[];
}

export interface CardProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold?: number;
  isNew?: boolean;
  categoryName?: string;
}

export function toCardProduct(p: ApiProduct): CardProduct {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.effective_price ?? p.price ?? 0),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image || '',
    rating: Number(p.rating ?? 0),
    sold: p.sales_count ? Math.min(97, 30 + ((p.sales_count * 7) % 68)) : undefined,
    isNew: p.is_new,
    categoryName: p.category?.name,
  };
}

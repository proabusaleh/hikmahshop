import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FlashSale from '@/components/home/FlashSale';
import TrendingProducts from '@/components/home/TrendingProducts';
import BestSellers from '@/components/home/BestSellers';
import NewArrivals from '@/components/home/NewArrivals';
import FeaturedBrands from '@/components/home/FeaturedBrands';
import WhyHikmahShop from '@/components/home/WhyHikmahShop';
import CustomerReviews from '@/components/home/CustomerReviews';
import BlogSection from '@/components/home/BlogSection';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroBanner />
      <FeaturedCategories />
      <FlashSale />
      <TrendingProducts />
      <BestSellers />
      <NewArrivals />
      <FeaturedBrands />
      <WhyHikmahShop />
      <CustomerReviews />
      <BlogSection />
      <Newsletter />
    </div>
  );
}

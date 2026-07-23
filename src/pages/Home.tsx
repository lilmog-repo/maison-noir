import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedCollections } from '@/components/sections/FeaturedCollections';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { EditorialCampaign } from '@/components/sections/EditorialCampaign';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { BrandStory } from '@/components/sections/BrandStory';
import { Newsletter } from '@/components/sections/Newsletter';

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />
        <FeaturedCollections />
        <NewArrivals />
        <EditorialCampaign />
        <FeaturedProducts />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

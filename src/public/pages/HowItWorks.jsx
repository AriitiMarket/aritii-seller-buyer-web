import React, { useState } from 'react';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { HowItWorksSection } from '@/public/sections/HowItWorksSection';
import { MarketplaceCTA } from '@/public/sections/MarketplaceCTA';
import { BusinessCTA } from '@/public/sections/BusinessCTA';

const HowItWorksPage = () => {
  return (
    <PublicLayout>
      <HowItWorksSection />
      <MarketplaceCTA />
      <BusinessCTA />
    </PublicLayout>
  );
};

export default HowItWorksPage;
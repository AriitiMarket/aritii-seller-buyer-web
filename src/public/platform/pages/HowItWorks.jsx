import React from 'react';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';
import { HowItWorksSection } from '@/public/platform/components/HowItWorksSection';
import { PlatformRolesSection } from '@/public/platform/components/PlatformRolesSection';
import { MarketplaceCTA } from '@/public/platform/components/MarketplaceCTA';

/**
 * HowItWorks page (/how-it-works) — the end-to-end journey. Standard
 * ExperiencePageHeader + the shared journey/roles sections.
 */
const HowItWorksPage = () => {
  return (
    <PublicLayout>
      <ExperiencePageHeader
        experience={EXPERIENCES.marketplace}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'How It Works' }]}
        badge="One connected flow"
        title="How Aritii Works"
        description="From selling to buying to delivery — see how one order travels across buyers, sellers and delivery services on the same platform."
        size="sm"
      />

      <HowItWorksSection />
      <PlatformRolesSection />
      <MarketplaceCTA />
    </PublicLayout>
  );
};

export default HowItWorksPage;

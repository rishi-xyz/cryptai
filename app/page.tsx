import { MarketingFeaturesSection } from '@/src/components//marketing-page/features';
import { MarketingFooter } from '@/src/components//marketing-page/footer';
import { MarketingHeader } from '@/src/components/marketing-page/header';
import { MarketingHero } from '@/src/components/marketing-page/hero';

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <MarketingHero />
      <MarketingFeaturesSection />
      <MarketingFooter />
    </>
  );
}

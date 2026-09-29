import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Ticker } from "@/components/site/Ticker";
import { OurStory } from "@/components/site/OurStory";
import { Menu } from "@/components/site/Menu";
import { Reviews } from "@/components/site/Reviews";
import { Gallery } from "@/components/site/Gallery";
import { Visit } from "@/components/site/Visit";
import { Footer } from "@/components/site/Footer";
import { OrderBar } from "@/components/site/OrderBar";
import { OrderDialog } from "@/components/site/OrderDialog";
import { ScrollEffects } from "@/components/site/ScrollEffects";
import { getMenu } from "@/lib/data/menu";
import {
  getBusinessHours,
  getBusinessInfo,
  getUpcomingHoursOverrides,
} from "@/lib/data/business-info";
import { getGalleryImages } from "@/lib/data/gallery";
import { getGoogleListing } from "@/lib/data/google-listing";
import {
  groupHours,
  hoursForScript,
  overridesForScript,
  summarizeHours,
} from "@/lib/hours-summary";

// Marketing content changes only via the admin panel, and every admin Server
// Action calls revalidatePath("/") — so edits show up instantly and the
// database is otherwise only queried once a day.
export const revalidate = 86400;

export default async function Home() {
  const [categories, businessInfo, hours, overrides, galleryImages] =
    await Promise.all([
      getMenu(),
      getBusinessInfo(),
      getBusinessHours(),
      getUpcomingHoursOverrides(),
      getGalleryImages(),
    ]);

  const google = await getGoogleListing(businessInfo);
  const summary = summarizeHours(hours);
  const hoursRows = groupHours(hours);
  const weekly = hoursForScript(hours);
  const overrideWindows = overridesForScript(overrides);

  // "Tue–Sun · 17:00–00:00" → the hero's hours tile.
  const [days, time] = summary.open.split(" · ");
  const openHours = days && time ? { days, time } : null;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-lg focus:bg-char focus:px-4 focus:py-3 focus:font-label focus:font-bold focus:text-cream"
      >
        Skip to content
      </a>

      <Header
        businessInfo={businessInfo}
        weekly={weekly}
        overrides={overrideWindows}
        hoursSummary={summary.open}
      />

      <main id="main">
        <Hero google={google} heroImageUrl={galleryImages[0]?.url} openHours={openHours} />
        <Ticker />
        <OurStory google={google} />
        <Menu categories={categories} />
        <Reviews google={google} />
        <Gallery images={galleryImages} businessInfo={businessInfo} />
        <Visit
          businessInfo={businessInfo}
          hoursRows={hoursRows}
          overrides={overrides}
          weekly={weekly}
          overrideWindows={overrideWindows}
          hoursSummary={summary.open}
        />
      </main>

      <Footer
        businessInfo={businessInfo}
        hoursRows={hoursRows}
        weekly={weekly}
        overrides={overrideWindows}
        hoursSummary={summary.open}
      />

      {businessInfo && (
        <>
          <OrderBar phone={businessInfo.phone} />
          <OrderDialog
            phone={businessInfo.phone}
            address={businessInfo.address_line}
            woltUrl={businessInfo.wolt_url}
            efoodUrl={businessInfo.efood_url}
            hoursSummary={summary.open}
          />
        </>
      )}

      <ScrollEffects />
    </>
  );
}

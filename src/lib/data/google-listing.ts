import type { BusinessInfo } from "@/lib/data/business-info";

export type GoogleReview = {
  id: string;
  author: string;
  authorUrl: string | null;
  /** English text (Google translates non-English reviews for us). */
  text: string;
  /** Language code of the original review, only when it was translated. */
  translatedFrom: string | null;
};

export type GoogleListing = {
  rating: number | null;
  count: number | null;
  /** e.g. "€10–15", straight from Google. */
  priceRange: string | null;
  /** 5-star reviews over the length floor. Can be empty, never padded. */
  reviews: GoogleReview[];
  /** Opens the business's reviews on Google. */
  readUrl: string | null;
  /** Opens Google's "write a review" form for the business. */
  writeUrl: string | null;
};

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";

/** Only reviews with more than this many characters are shown. */
const MIN_REVIEW_CHARS = 60;

type Money = { currencyCode?: string; units?: string };
type ApiText = { text?: string; languageCode?: string };
type ApiReview = {
  name?: string;
  rating?: number;
  text?: ApiText;
  originalText?: ApiText;
  authorAttribution?: { displayName?: string; uri?: string };
};
type ApiPlace = {
  rating?: number;
  userRatingCount?: number;
  priceRange?: { startPrice?: Money; endPrice?: Money };
  reviews?: ApiReview[];
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string };
};

function formatPriceRange(range: ApiPlace["priceRange"]): string | null {
  const start = range?.startPrice;
  const end = range?.endPrice;
  if (!start?.units || !end?.units || start.currencyCode !== end.currencyCode) return null;

  const symbol =
    new Intl.NumberFormat("en", {
      style: "currency",
      currency: start.currencyCode,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? "";

  return `${symbol}${start.units}–${end.units}`;
}

function pickReviews(raw: ApiReview[] | undefined): GoogleReview[] {
  return (raw ?? []).flatMap((review) => {
    const text = review.text?.text?.trim();
    if (review.rating !== 5 || !text || text.length <= MIN_REVIEW_CHARS) return [];

    const original = review.originalText?.languageCode;
    const shown = review.text?.languageCode;

    return [
      {
        id: review.name ?? `${review.authorAttribution?.displayName}-${text.slice(0, 20)}`,
        author: review.authorAttribution?.displayName ?? "Google user",
        authorUrl: review.authorAttribution?.uri ?? null,
        text,
        translatedFrom: original && shown && original !== shown ? original : null,
      },
    ];
  });
}

async function fetchLivePlace(placeId: string, apiKey: string): Promise<GoogleListing> {
  // languageCode=en makes Google return English translations of Greek reviews.
  const res = await fetch(`${PLACES_ENDPOINT}/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      // Only ask for what we show. The review links come from Google itself,
      // so they can't drift out of date the way a hand-built URL could.
      "X-Goog-FieldMask":
        "rating,userRatingCount,priceRange,reviews,googleMapsLinks.reviewsUri,googleMapsLinks.writeAReviewUri",
    },
    // Cached for a week (Next's Data Cache keeps it across deploys and only
    // stores 200s). Saving anything in admin also refreshes it, because those
    // actions call revalidatePath("/").
    next: { revalidate: 604800 },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`Places API responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = (await res.json()) as ApiPlace;
  if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
    throw new Error("Places API returned no rating for this place.");
  }

  return {
    rating: data.rating,
    count: data.userRatingCount,
    priceRange: formatPriceRange(data.priceRange),
    reviews: pickReviews(data.reviews),
    readUrl: data.googleMapsLinks?.reviewsUri ?? null,
    writeUrl: data.googleMapsLinks?.writeAReviewUri ?? null,
  };
}

/**
 * Rating, review count, price range, reviews and review links for the
 * "Google" parts of the site. With a Place ID and GOOGLE_PLACES_API_KEY these
 * come live from Google. If either is missing, or Google can't be reached,
 * the rating and links fall back to the values stored in the database, and
 * the reviews and price range are simply left out (nothing is invented).
 */
export async function getGoogleListing(info: BusinessInfo | null): Promise<GoogleListing> {
  const placeId = info?.google_place_id?.trim() || null;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  const storedUrl = info?.google_review_url ?? null;
  const fallback: GoogleListing = {
    rating: info?.google_rating ?? null,
    count: info?.google_review_count ?? null,
    priceRange: null,
    reviews: [],
    readUrl: storedUrl,
    // Google's own review-form URL, keyed by Place ID, for when the API
    // can't hand us the official one.
    writeUrl: placeId
      ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`
      : storedUrl,
  };

  if (!placeId || !apiKey) return fallback;

  // One retry: with no hardcoded reviews to fall back on, a single network
  // blip would otherwise leave the section empty until the next refresh.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const live = await fetchLivePlace(placeId, apiKey);
      return {
        ...live,
        readUrl: live.readUrl ?? fallback.readUrl,
        writeUrl: live.writeUrl ?? fallback.writeUrl,
      };
    } catch (error) {
      if (attempt === 2) console.error("[google-listing] using stored values:", error);
    }
  }
  return fallback;
}

/** 5 → "5.0", so it matches how Google prints ratings. */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** "el" → "Greek" */
export function languageName(code: string): string {
  return new Intl.DisplayNames(["en"], { type: "language" }).of(code) ?? code;
}

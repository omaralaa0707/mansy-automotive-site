import type { SiteContent } from "@/i18n/schema";
import { useContent } from "@/i18n/locale-provider";
import type { CarId, MetricId } from "./media";

/**
 * Mansy publish specifications and nothing else, so this site is a comparison
 * instrument. The shared schema has no vocabulary for a metric, a published
 * range, or a figure a dealership simply never gave.
 */
export type MansyContent = SiteContent & {
  hero: SiteContent["hero"] & {
    heroAlt: string;
    noProseNote: string;
    chartHint: string;
  };
  compare: {
    eyebrow: string;
    heading: string;
    intro: string;
    metricNames: Record<MetricId, string>;
    metricNotes: Record<MetricId, string>;
    invertedNote: string;
    missingLabel: string;
    chartAlt: string;
    rangeNote: string;
  };
  floor: {
    eyebrow: string;
    heading: string;
    intro: string;
    specLabels: Record<
      "engine" | "power" | "torque" | "transmission" | "drivetrain" | "topSpeed" | "zeroToHundred" | "tank" | "consumption",
      string
    >;
    featuresLabel: string;
    viewPost: string;
    positionLabel: string;
    notes: Record<CarId, string>;
  };
  room: {
    eyebrow: string;
    heading: string;
    body: string[];
    showroomAlt: string;
    forecourtAlt: string;
    followersLabel: string;
    postsLabel: string;
    cta: string;
    instagramCta: string;
  };
};

export function useMansy() {
  return useContent() as MansyContent;
}

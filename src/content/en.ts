import type { MansyContent } from "./schema-ext";
import { PROFILE } from "./media";

export const en: MansyContent = {
  locale: "en",
  dir: "ltr",

  brand: {
    name: "Mansy Automotive",
    shortName: "Mansy",
    tagline: "Specifications, and nothing else",
  },

  nav: [
    { label: "Compare", href: "#compare" },
    { label: "The floor", href: "#floor" },
    { label: "The room", href: "#room" },
  ],

  hero: {
    eyebrow: "Four cars · four powertrains",
    headline: "No adjectives anywhere",
    sub: "Mansy Automotive write no bio, no slogan and no prose. Every post is a specification: displacement, power, torque, transmission, drivetrain, top speed, 0–100, tank, consumption — then a phone number. So this page is not a brochure. It is a comparison.",
    primaryCta: "Call them",
    secondaryCta: "Compare the four",
    heroAlt: "A red Mercedes-Benz CLE 200 in Mansy Automotive's showroom, in front of the gold fluted column.",
    noProseNote: "Not one adjective appears in any of their four listings.",
    chartHint: "Change the figure and the columns reorder.",
  },

  about: {
    heading: "Mansy Automotive",
    body: [
      "Four cars from four different places — a German coupé, a Chinese hatch and two Spanish CUPRAs — photographed in the same showroom in front of the same gold fluted column, with the same red branded mat in every interior shot.",
    ],
  },

  services: { heading: "The floor", items: [] },
  gallery: { heading: "The floor", items: [] },

  compare: {
    eyebrow: "What they publish",
    heading: "Four columns, one figure at a time",
    intro:
      "Because they give numbers rather than descriptions, their four cars can simply be put next to each other. Each column below is one car, and its height is the figure they published — the column form is taken from the fluted one standing behind every car in their showroom.",
    metricNames: {
      power: "Power",
      torque: "Torque",
      topSpeed: "Top speed",
      zeroToHundred: "0–100 km/h",
    },
    metricNotes: {
      power: "The Formentor is a model line rather than one car, so its column takes the top of the range they published.",
      torque: "They gave torque for two of the four.",
      topSpeed: "Only the Leon has a published top speed.",
      zeroToHundred: "Shorter is quicker, so this column is inverted — taller still means better.",
    },
    invertedNote: "Inverted: taller is quicker",
    missingLabel: "Not published",
    chartAlt: "Four fluted columns of different heights, one per car, comparing a published figure.",
    rangeNote: "Where they published a range, the column takes the top of it and the figure is shown in full.",
  },

  floor: {
    eyebrow: "On the floor",
    heading: "Every figure, as they gave it",
    intro:
      "Transcribed from the post for each car. Nothing is added, converted or estimated, and a blank means they did not publish it.",
    specLabels: {
      engine: "Engine",
      power: "Power",
      torque: "Torque",
      transmission: "Transmission",
      drivetrain: "Drivetrain",
      topSpeed: "Top speed",
      zeroToHundred: "0–100 km/h",
      tank: "Fuel tank",
      consumption: "Consumption",
    },
    featuresLabel: "Key features",
    viewPost: "See the post",
    positionLabel: "{n} / {total}",
    notes: {
      "mercedes-cle": "The only mild hybrid with EQ Boost on the floor.",
      "mg-gt": "A wet dual-clutch gearbox, which they name specifically.",
      "cupra-leon": "The only car they specified completely — right down to litres per hundred kilometres.",
      "cupra-formentor": "Three powertrains offered under one name, so its figures are a range and not a point.",
    },
  },

  room: {
    eyebrow: "The room",
    heading: "One column, one mat",
    body: [
      "Every showroom frame has the same gold fluted column behind the car, and every interior frame has the same red branded mat in the footwell. It is a small operation photographed with real consistency.",
      "Outside, the same cars stand under a plain white sign with the name in black capitals — no strapline under it, which fits a dealership that does not write any.",
    ],
    showroomAlt: "The showroom interior with the gold fluted column and a car in front of it.",
    forecourtAlt: "A CUPRA Formentor on the forecourt under the white MANSY AUTOMOTIVE sign.",
    followersLabel: "Followers",
    postsLabel: "Posts",
    cta: "Open in Maps",
    instagramCta: "Instagram",
  },

  contact: {
    heading: "Talk to them",
    addressLabel: "Find them",
    address: "Cairo, Egypt",
    phoneLabel: "Call",
    phones: [...PROFILE.phones],
    mapsUrl: PROFILE.maps,
    instagramUrl: PROFILE.instagram,
    facebookUrl: PROFILE.facebook,
    cta: "Call them",
  },

  footer: {
    disclaimer:
      "A concept design, built as a demonstration. Not an official Mansy Automotive site, and not affiliated with them. All photography, marks and quoted copy belong to Mansy Automotive.",
    rights: "Concept by Claude",
  },

  a11y: {
    toggleLanguage: "التبديل إلى العربية",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};

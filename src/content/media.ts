/**
 * Mansy Automotive publish specifications and nothing else. There is no bio,
 * no adjectives, no "luxury" or "excellence" anywhere in their captions —
 * just engine, displacement, power, torque, transmission, drivetrain, top
 * speed, 0–100, tank capacity and consumption, then a features list and a
 * phone number.
 *
 * That makes them the only dealership in this series whose material is
 * *performance* data rather than provenance data, and it is why this page is
 * a comparison instrument. Every figure below is transcribed from the post
 * for that car; where they published a range for a model line rather than a
 * single car, the range is kept as a range.
 *
 * Their showroom has one distinctive feature — a gold fluted column behind
 * every car — and the chart on this page takes its form from it.
 */

export type CarId = "mercedes-cle" | "mg-gt" | "cupra-leon" | "cupra-formentor";

export type Spec = {
  engine: string;
  /** Horsepower. `[min, max]` where they published a range. */
  power: number | [number, number];
  /** Newton-metres, where published. */
  torque?: number | [number, number];
  transmission: string;
  drivetrain?: string;
  topSpeed?: number;
  zeroToHundred?: number;
  tank?: number;
  /** L/100km, as a range where they gave one. */
  consumption?: [number, number];
};

export type Car = {
  id: CarId;
  marque: string;
  model: string;
  year: string;
  /** Sampled from their own photograph of the car. */
  paint: string;
  spec: Spec;
  features: string[];
  frames: string[];
  postUrl: string;
};

const post = (code: string) => `https://www.instagram.com/p/${code}/`;

export const CARS: Car[] = [
  {
    id: "mercedes-cle",
    marque: "Mercedes-Benz",
    model: "CLE 200 Premium Plus",
    year: "2024",
    paint: "#8e1f2d",
    spec: {
      engine: "2.0L Turbocharged Petrol with 48V Mild Hybrid (1,999 cc)",
      power: 204,
      transmission: "9G-TRONIC Automatic",
      drivetrain: "Rear-Wheel Drive",
    },
    features: ["EQ Boost", "Digital Cockpit", "Premium Plus specification"],
    frames: ["/media/mercedes-cle-01.jpg", "/media/mercedes-cle-02.jpg", "/media/mercedes-cle-03.jpg"],
    postUrl: post("DafXglKjd1j"),
  },
  {
    id: "mg-gt",
    marque: "MG",
    model: "GT",
    year: "2026",
    paint: "#1b1d22",
    spec: {
      engine: "1.5L Turbocharged Petrol",
      power: 170,
      torque: 275,
      transmission: "7-Speed Wet Dual-Clutch Automatic (DCT)",
    },
    features: ["Wet dual-clutch transmission"],
    frames: ["/media/mg-gt-01.jpg", "/media/mg-gt-02.jpg", "/media/mg-gt-03.jpg"],
    postUrl: post("Dac0lmqlpqN"),
  },
  {
    id: "cupra-leon",
    marque: "CUPRA",
    model: "Leon",
    year: "2026",
    paint: "#e6e4df",
    spec: {
      engine: "1.4L Turbocharged Petrol (1,395 cc)",
      power: 150,
      torque: 250,
      transmission: "8-speed Automatic",
      drivetrain: "Front-Wheel Drive (FWD)",
      topSpeed: 205,
      zeroToHundred: 8.7,
      tank: 50,
      consumption: [5.8, 6.2],
    },
    features: [
      "Full LED Headlights",
      "18-inch Alloy Wheels",
      "12.9-inch Touchscreen Infotainment",
      "Wireless Apple CarPlay & Android Auto",
      "Digital Cockpit",
      "Adaptive Cruise Control",
      "Front Assist (Autonomous Emergency Braking)",
    ],
    frames: ["/media/cupra-leon-01.jpg", "/media/cupra-leon-02.jpg", "/media/cupra-leon-03.jpg"],
    postUrl: post("DaSg4unEWhS"),
  },
  {
    id: "cupra-formentor",
    marque: "CUPRA",
    model: "Formentor",
    year: "2026",
    paint: "#3d4650",
    spec: {
      engine: "1.5L TSI Mild Hybrid / 2.0L TSI Turbo / e-HYBRID Plug-in Hybrid",
      power: [150, 333],
      transmission: "DSG Automatic",
    },
    features: ["Three powertrains offered", "e-HYBRID plug-in option"],
    frames: [
      "/media/cupra-formentor-01.jpg",
      "/media/cupra-formentor-02.jpg",
      "/media/cupra-formentor-03.jpg",
    ],
    postUrl: post("DZxW27slHvB"),
  },
];

/** The figures they publish often enough to compare across the floor. */
export type MetricId = "power" | "torque" | "topSpeed" | "zeroToHundred";

export const METRICS: { id: MetricId; unit: string; /** lower is better */ inverted?: boolean }[] = [
  { id: "power", unit: "HP" },
  { id: "torque", unit: "Nm" },
  { id: "topSpeed", unit: "km/h" },
  { id: "zeroToHundred", unit: "sec", inverted: true },
];

/** Returns the value to plot, taking the top of a published range. */
export function metricValue(car: Car, m: MetricId): number | null {
  const raw =
    m === "power"
      ? car.spec.power
      : m === "torque"
        ? car.spec.torque
        : m === "topSpeed"
          ? car.spec.topSpeed
          : car.spec.zeroToHundred;
  if (raw == null) return null;
  return Array.isArray(raw) ? raw[1] : raw;
}

export const SHOWROOM_FRAME = "/media/showroom.jpg";
export const FORECOURT_FRAME = "/media/forecourt.jpg";

export const PROFILE = {
  instagram: "https://www.instagram.com/mansyautomotive/",
  facebook: "https://www.facebook.com/MansyAutomotive/",
  maps: "https://maps.app.goo.gl/buJJ5nUCki7hRpY16",
  phones: ["01070002272", "01080851915"],
  phoneHref: "tel:+201070002272",
  followers: "1,690",
  posts: "210",
} as const;

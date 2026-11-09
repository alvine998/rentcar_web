export type PackageTier = "regular" | "premium" | "vip";

export type Car = {
  slug: string;
  name: string;
  brand: string;
  category: "City" | "MPV" | "SUV" | "Luxury";
  transmission: "Manual" | "Automatic";
  seats: number;
  fuel: "Petrol" | "Hybrid" | "Electric";
  year: number;
  pricePerDay: number;
  image: string;
  popular?: boolean;
  packages: PackageTier[];
};

export type RentalPackage = {
  slug: PackageTier;
  name: string;
  priceFrom: number;
};

export const CARS: Car[] = [
  {
    slug: "honda-brio",
    name: "Brio Satya",
    brand: "Honda",
    category: "City",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    year: 2023,
    pricePerDay: 275000,
    image: "/cars/brio.jpg",
    popular: true,
    packages: ["regular"],
  },
  {
    slug: "toyota-avanza",
    name: "Avanza Veloz",
    brand: "Toyota",
    category: "MPV",
    transmission: "Manual",
    seats: 7,
    fuel: "Petrol",
    year: 2022,
    pricePerDay: 350000,
    image: "/cars/avanza.jpg",
    popular: true,
    packages: ["regular", "premium"],
  },
  {
    slug: "daihatsu-xenia",
    name: "Xenia 1.3 X",
    brand: "Daihatsu",
    category: "MPV",
    transmission: "Manual",
    seats: 7,
    fuel: "Petrol",
    year: 2021,
    pricePerDay: 340000,
    image: "/cars/xenia.jpg",
    packages: ["regular"],
  },
  {
    slug: "suzuki-ertiga",
    name: "Ertiga GX",
    brand: "Suzuki",
    category: "MPV",
    transmission: "Automatic",
    seats: 7,
    fuel: "Petrol",
    year: 2022,
    pricePerDay: 375000,
    image: "/cars/ertiga.jpg",
    packages: ["regular", "premium"],
  },
  {
    slug: "hyundai-stargazer",
    name: "Stargazer Prime",
    brand: "Hyundai",
    category: "MPV",
    transmission: "Automatic",
    seats: 7,
    fuel: "Petrol",
    year: 2023,
    pricePerDay: 425000,
    image: "/cars/stargazer.jpg",
    popular: true,
    packages: ["premium"],
  },
  {
    slug: "mitsubishi-xpander",
    name: "Xpander Ultimate",
    brand: "Mitsubishi",
    category: "MPV",
    transmission: "Automatic",
    seats: 7,
    fuel: "Petrol",
    year: 2023,
    pricePerDay: 450000,
    image: "/cars/xpander.jpg",
    popular: true,
    packages: ["premium"],
  },
  {
    slug: "toyota-innova",
    name: "Kijang Innova V",
    brand: "Toyota",
    category: "MPV",
    transmission: "Automatic",
    seats: 7,
    fuel: "Petrol",
    year: 2022,
    pricePerDay: 550000,
    image: "/cars/innova.jpg",
    packages: ["premium", "vip"],
  },
  {
    slug: "honda-hrv",
    name: "HR-V SE",
    brand: "Honda",
    category: "SUV",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    year: 2023,
    pricePerDay: 600000,
    image: "/cars/hrv.jpg",
    packages: ["premium", "vip"],
  },
  {
    slug: "toyota-fortuner",
    name: "Fortuner VRZ",
    brand: "Toyota",
    category: "SUV",
    transmission: "Automatic",
    seats: 7,
    fuel: "Petrol",
    year: 2023,
    pricePerDay: 950000,
    image: "/cars/fortuner.jpg",
    packages: ["vip"],
  },
  {
    slug: "toyota-alphard",
    name: "Alphard 2.5 G",
    brand: "Toyota",
    category: "Luxury",
    transmission: "Automatic",
    seats: 7,
    fuel: "Petrol",
    year: 2023,
    pricePerDay: 1850000,
    image: "/cars/alphard.jpg",
    packages: ["vip"],
  },
];

export const PACKAGES: RentalPackage[] = [
  { slug: "regular", name: "Regular", priceFrom: 275000 },
  { slug: "premium", name: "Premium", priceFrom: 650000 },
  { slug: "vip", name: "VIP", priceFrom: 1750000 },
];

export function getPackage(slug: string): RentalPackage | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}

export function getCarsByPackage(slug: PackageTier): Car[] {
  return CARS.filter((c) => c.packages.includes(slug));
}

export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

// ---------------------------------------------------------------------------
// Dynamic pricing: per-weekday rates + public holiday rate
// ---------------------------------------------------------------------------

/** Multipliers per weekday, index 0 = Monday … 6 = Sunday */
export const DAY_MULTIPLIERS = [0.95, 0.95, 1, 1, 1.15, 1.3, 1.2];

export const HOLIDAY_MULTIPLIER = 1.5;

export type Holiday = { date: string; name: string };

export const HOLIDAYS: Holiday[] = [
  { date: "2026-12-24", name: "Christmas Eve" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2026-12-26", name: "Christmas holiday" },
  { date: "2026-12-31", name: "New Year's Eve" },
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-01-02", name: "New Year holiday" },
];

export function getHoliday(dateISO: string): Holiday | null {
  return HOLIDAYS.find((h) => h.date === dateISO) ?? null;
}

export function roundRate(value: number): number {
  return Math.round(value / 5000) * 5000;
}

/** Day-of-week multiplier for an ISO date (YYYY-MM-DD). */
export function dayMultiplier(dateISO: string): number {
  const day = new Date(`${dateISO}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  return DAY_MULTIPLIERS[(day + 6) % 7];
}

/** Final per-day price for a base rate on a given date. */
export function priceForDate(base: number, dateISO: string): number {
  const multiplier = getHoliday(dateISO)
    ? HOLIDAY_MULTIPLIER
    : dayMultiplier(dateISO);
  return roundRate(base * multiplier);
}

export type EstimateLine = {
  rate: number;
  days: number;
  subtotal: number;
  holiday: boolean;
};

export type RentalEstimate = {
  days: number;
  holidayDays: number;
  total: number;
  lines: EstimateLine[];
};

/**
 * Price for an inclusive rental: pickup date through return date.
 * Returns days = 0 when the range is invalid.
 */
export function estimateRental(
  base: number,
  pickup: string,
  ret: string,
): RentalEstimate {
  const start = new Date(`${pickup}T00:00:00Z`).getTime();
  const end = new Date(`${ret}T00:00:00Z`).getTime();
  if (!pickup || !ret || Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return { days: 0, holidayDays: 0, total: 0, lines: [] };
  }

  const groups = new Map<string, EstimateLine>();
  const order: string[] = [];
  let total = 0;
  let holidayDays = 0;

  const cursor = new Date(start);
  while (cursor.getTime() <= end) {
    const iso = cursor.toISOString().slice(0, 10);
    const holiday = getHoliday(iso) !== null;
    const rate = priceForDate(base, iso);
    const key = `${holiday ? "h" : "d"}-${rate}`;
    const line = groups.get(key) ?? { rate, days: 0, subtotal: 0, holiday };
    line.days += 1;
    line.subtotal += rate;
    groups.set(key, line);
    if (!order.includes(key)) order.push(key);
    total += rate;
    if (holiday) holidayDays += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return {
    days: order.reduce((n, key) => n + (groups.get(key)?.days ?? 0), 0),
    holidayDays,
    total,
    lines: order.map((key) => groups.get(key) as EstimateLine),
  };
}

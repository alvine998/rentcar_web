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

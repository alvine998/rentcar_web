import type { PackageTier } from "./data";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "ongoing"
  | "completed"
  | "cancelled";

export type Booking = {
  id: string;
  name: string;
  phone: string;
  car: string;
  package: PackageTier;
  driver: boolean;
  pickup: string;
  ret: string;
  location: string;
  status: BookingStatus;
  total: number;
};

export const STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "ongoing",
  "completed",
  "cancelled",
];

export const BOOKINGS: Booking[] = [
  {
    id: "BK-24110",
    name: "Rizky Pratama",
    phone: "+62 812 3344 5566",
    car: "Toyota Avanza Veloz",
    package: "regular",
    driver: false,
    pickup: "2026-11-12",
    ret: "2026-11-15",
    location: "Kemayoran, Central Jakarta",
    status: "confirmed",
    total: 1050000,
  },
  {
    id: "BK-24111",
    name: "Anindya Sari",
    phone: "+62 811 2200 1199",
    car: "Mitsubishi Xpander Ultimate",
    package: "premium",
    driver: true,
    pickup: "2026-11-13",
    ret: "2026-11-13",
    location: "SCBD, South Jakarta",
    status: "ongoing",
    total: 450000,
  },
  {
    id: "BK-24112",
    name: "Budi Hartono",
    phone: "+62 813 7788 9900",
    car: "Toyota Alphard 2.5 G",
    package: "vip",
    driver: true,
    pickup: "2026-11-18",
    ret: "2026-11-20",
    location: "Bandung (wedding)",
    status: "confirmed",
    total: 3700000,
  },
  {
    id: "BK-24113",
    name: "Siti Rahmawati",
    phone: "+62 821 4455 6677",
    car: "Honda Brio Satya",
    package: "regular",
    driver: false,
    pickup: "2026-11-10",
    ret: "2026-11-11",
    location: "Tebet, South Jakarta",
    status: "completed",
    total: 275000,
  },
  {
    id: "BK-24114",
    name: "Daniel Wijaya",
    phone: "+62 812 9911 2233",
    car: "Toyota Kijang Innova V",
    package: "premium",
    driver: true,
    pickup: "2026-11-21",
    ret: "2026-11-24",
    location: "Soekarno-Hatta T3",
    status: "pending",
    total: 1650000,
  },
  {
    id: "BK-24115",
    name: "Maya Kusuma",
    phone: "+62 856 3322 1100",
    car: "Hyundai Stargazer Prime",
    package: "premium",
    driver: true,
    pickup: "2026-11-22",
    ret: "2026-11-23",
    location: "Kelapa Gading, North Jakarta",
    status: "pending",
    total: 850000,
  },
  {
    id: "BK-24116",
    name: "Andi Saputra",
    phone: "+62 878 1234 5678",
    car: "Toyota Fortuner VRZ",
    package: "vip",
    driver: true,
    pickup: "2026-11-08",
    ret: "2026-11-10",
    location: "Bogor (corporate trip)",
    status: "completed",
    total: 1900000,
  },
  {
    id: "BK-24117",
    name: "Linda Halim",
    phone: "+62 811 6677 8899",
    car: "Suzuki Ertiga GX",
    package: "regular",
    driver: false,
    pickup: "2026-11-05",
    ret: "2026-11-07",
    location: "Bintaro, South Tangerang",
    status: "cancelled",
    total: 750000,
  },
  {
    id: "BK-24118",
    name: "Fajar Nugroho",
    phone: "+62 812 5544 3322",
    car: "Honda HR-V SE",
    package: "vip",
    driver: true,
    pickup: "2026-11-25",
    ret: "2026-11-27",
    location: "Puncak (family trip)",
    status: "pending",
    total: 1200000,
  },
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

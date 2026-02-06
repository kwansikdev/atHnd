// Shared figure data and types
export type FigureStatus = "reserved" | "purchased" | "owned"

export type PaymentType = "deposit" | "full" | "partial"

export type FigureEdition = "first" | "reprint" | "2nd-reprint" | "3rd-reprint"

export interface Figure {
  id: string
  name: string
  manufacturer: string
  price: number
  releaseDate: string
  status: FigureStatus
  imageUrl: string
  paymentType?: PaymentType
  paidAmount?: number
  reservationDate?: string
  purchaseDate?: string
  edition?: FigureEdition
  originalReleaseDate?: string
}

export interface SearchableFigure {
  id: string
  name: string
  manufacturer: string
  price: number
  releaseDate: string
  imageUrl: string
  edition: FigureEdition
  originalReleaseDate?: string
}

// Mock database of searchable figures (from various shops/databases)
export const figureDatabase: SearchableFigure[] = [
  {
    id: "db-1",
    name: "Hatsune Miku: Snow Princess Ver.",
    manufacturer: "Good Smile Company",
    price: 18500,
    releaseDate: "2025-03-15",
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    edition: "first",
  },
  {
    id: "db-1-reprint",
    name: "Hatsune Miku: Snow Princess Ver.",
    manufacturer: "Good Smile Company",
    price: 19800,
    releaseDate: "2025-09-15",
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    edition: "reprint",
    originalReleaseDate: "2025-03-15",
  },
  {
    id: "db-2",
    name: "Rem: Crystal Dress Ver.",
    manufacturer: "eStream",
    price: 32000,
    releaseDate: "2025-04-20",
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
    edition: "first",
  },
  {
    id: "db-3",
    name: "Asuna: Stacia the Goddess of Creation",
    manufacturer: "Aniplex",
    price: 26500,
    releaseDate: "2025-02-22",
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
    edition: "reprint",
    originalReleaseDate: "2022-08-15",
  },
  {
    id: "db-4",
    name: "Sakura Miku: Hanami Outfit Ver.",
    manufacturer: "Good Smile Company",
    price: 19800,
    releaseDate: "2025-04-01",
    imageUrl: "/anime-figure-sakura-miku-cherry-blossom.jpg",
    edition: "first",
  },
  {
    id: "db-4-reprint",
    name: "Sakura Miku: Hanami Outfit Ver.",
    manufacturer: "Good Smile Company",
    price: 21000,
    releaseDate: "2025-10-01",
    imageUrl: "/anime-figure-sakura-miku-cherry-blossom.jpg",
    edition: "reprint",
    originalReleaseDate: "2025-04-01",
  },
  {
    id: "db-5",
    name: "Zero Two: Wedding Dress Ver.",
    manufacturer: "FREEing",
    price: 28000,
    releaseDate: "2025-05-15",
    imageUrl: "/anime-figure-zero-two-wedding-dress.jpg",
    edition: "2nd-reprint",
    originalReleaseDate: "2021-06-20",
  },
  {
    id: "db-6",
    name: "Emilia: Shiromuku Ver.",
    manufacturer: "FuRyu",
    price: 22000,
    releaseDate: "2025-06-10",
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
    edition: "first",
  },
  {
    id: "db-7",
    name: "Yor Forger: Thorn Princess",
    manufacturer: "Bandai Spirits",
    price: 17500,
    releaseDate: "2025-07-20",
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
    edition: "first",
  },
  {
    id: "db-7-reprint",
    name: "Yor Forger: Thorn Princess",
    manufacturer: "Bandai Spirits",
    price: 18500,
    releaseDate: "2025-12-20",
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
    edition: "reprint",
    originalReleaseDate: "2025-07-20",
  },
  {
    id: "db-8",
    name: "Miku: Racing 2025 Ver.",
    manufacturer: "Max Factory",
    price: 19800,
    releaseDate: "2025-03-30",
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    edition: "first",
  },
  {
    id: "db-9",
    name: "Nezuko Kamado: Demon Form",
    manufacturer: "Aniplex",
    price: 24500,
    releaseDate: "2025-08-15",
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
    edition: "3rd-reprint",
    originalReleaseDate: "2020-12-01",
  },
  {
    id: "db-10",
    name: "2B (YoRHa No.2 Type B): DX Ver.",
    manufacturer: "Square Enix",
    price: 35000,
    releaseDate: "2025-09-01",
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
    edition: "reprint",
    originalReleaseDate: "2023-03-15",
  },
  {
    id: "db-11",
    name: "Makima: Chainsaw Man",
    manufacturer: "Good Smile Company",
    price: 21000,
    releaseDate: "2025-05-25",
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    edition: "first",
  },
  {
    id: "db-12",
    name: "Power: Blood Fiend Ver.",
    manufacturer: "Good Smile Company",
    price: 19500,
    releaseDate: "2025-06-30",
    imageUrl: "/anime-figure-sakura-miku-cherry-blossom.jpg",
    edition: "first",
  },
  {
    id: "db-13",
    name: "Chisato Nishikigi: Cafe Ver.",
    manufacturer: "Aniplex",
    price: 18800,
    releaseDate: "2025-10-10",
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
    edition: "first",
  },
  {
    id: "db-14",
    name: "Frieren: Journey's End",
    manufacturer: "Good Smile Company",
    price: 23000,
    releaseDate: "2025-11-15",
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    edition: "first",
  },
  {
    id: "db-15",
    name: "Fern: Apprentice Mage",
    manufacturer: "Good Smile Company",
    price: 20500,
    releaseDate: "2025-11-20",
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
    edition: "first",
  },
]

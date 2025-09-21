export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  image: any; // require() kullandığımız için any tipi
  description: string;
  condition: string;
  location: string;
  seller?: {
    name: string;
    rating: number;
    verified: boolean;
    profileImage: any;
    location: string;
    stats: {
      totalReviews: number;
      totalTrades: number;
      memberSince: number;
    };
    about: string;
    credentials: string[];
    inventory: Product[];
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "Rolex Submariner Date",
    brand: "Rolex",
    model: "Submariner Date 41",
    price: 12500,
    image: require("../../assets/mock-images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg"),
    description:
      "Orijinal box ve paperlı, 2023 model, yeşil kadranlı ikonik denizci saat",
    condition: "New",
    location: "United States",
    seller: {
      name: "Luxury Watch Expert",
      rating: 4.8,
      verified: true,
      profileImage: require("../../assets/mock-images/placeholder-watch.jpg"),
      location: "New York, USA",
      stats: {
        totalReviews: 156,
        totalTrades: 89,
        memberSince: 2019,
      },
      about: "Specialized in luxury timepieces with over 10 years of experience. Certified watch dealer with authentic pieces only.",
      credentials: ["Certified Dealer", "Authenticity Guarantee", "5-Year Warranty"],
      inventory: [],
    },
  },
  {
    id: "2",
    name: "Audemars Piguet Royal Oak",
    brand: "Audemars Piguet",
    model: "Royal Oak 15500ST",
    price: 28500,
    image: require("../../assets/mock-images/abbabf8c1930ca4cd8f2e326ab76bac53b57e555.jpg"),
    description:
      "Tapisserie kadranlı, otomatik mekanizmalı, çelik kasa ve bracelet",
    condition: "Excellent",
    location: "Europe",
    seller: {
      name: "Luxury Watch Dealer",
      rating: 4.8,
      verified: true,
      profileImage: require("../../assets/mock-images/abbabf8c1930ca4cd8f2e326ab76bac53b57e555.jpg"),
      location: "London, UK",
      stats: {
        totalReviews: 189,
        totalTrades: 134,
        memberSince: 2019,
      },
      about: "Premium luxury watch specialist with extensive collection of rare timepieces from top Swiss manufacturers.",
      credentials: ["Authorized Dealer", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "3",
    name: "Patek Philippe Nautilus",
    brand: "Patek Philippe",
    model: "Nautilus 5711/1A",
    price: 42000,
    image: require("../../assets/mock-images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg"),
    description: "Mavi kadranlı, sınırlı üretim, koleksiyonluk nadide parça",
    condition: "New",
    location: "Switzerland",
    seller: {
      name: "Swiss Watch Expert",
      rating: 4.9,
      verified: true,
      profileImage: require("../../assets/mock-images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg"),
      location: "Zurich, Switzerland",
      stats: {
        totalReviews: 312,
        totalTrades: 198,
        memberSince: 2017,
      },
      about: "Master watchmaker with 20+ years experience in Swiss haute horlogerie. Specializing in Patek Philippe and Vacheron Constantin.",
      credentials: ["Master Watchmaker", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "4",
    name: "Omega Speedmaster Moonwatch",
    brand: "Omega",
    model: "Speedmaster Professional",
    price: 18500,
    image: require("../../assets/mock-images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg"),
    description:
      "Ay yürüyüşü için NASA onaylı, mekanik kronograf, siyah kadran",
    condition: "New",
    location: "United Kingdom",
    seller: {
      name: "Vintage Timepieces",
      rating: 4.2,
      verified: true,
      profileImage: require("../../assets/mock-images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg"),
      location: "New York, USA",
      stats: {
        totalReviews: 156,
        totalTrades: 98,
        memberSince: 2020,
      },
      about: "Vintage and pre-owned luxury watch specialist. Expert in Omega, Rolex, and vintage Swiss timepieces.",
      credentials: ["Vintage Specialist", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "5",
    name: "Cartier Tank Louis",
    brand: "Cartier",
    model: "Tank Louis Cartier",
    price: 32000,
    image: require("../../assets/mock-images/620e9786c04a185eae452e81952fe49d6af2db8e.jpg"),
    description: "18k altın kasa, el yapımı, klasik zarafet timsali",
    condition: "Very Good",
    location: "France",
    seller: {
      name: "French Luxury Dealer",
      rating: 4.6,
      verified: true,
      profileImage: require("../../assets/mock-images/620e9786c04a185eae452e81952fe49d6af2db8e.jpg"),
      location: "Paris, France",
      stats: {
        totalReviews: 203,
        totalTrades: 145,
        memberSince: 2018,
      },
      about: "Luxury watch specialist based in Paris. Expert in Cartier, Breguet, and French haute horlogerie.",
      credentials: ["Authorized Dealer", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "6",
    name: "Jaeger-LeCoultre Reverso",
    brand: "Jaeger-LeCoultre",
    model: "Reverso Classic",
    price: 27500,
    image: require("../../assets/mock-images/f2110458b565c3c175d76d20241374064722cd17.jpg"),
    description: "Çevrilebilir kasa, art deco tasarım, el yapımı mekanizma",
    condition: "Excellent",
    location: "Switzerland",
    seller: {
      name: "Swiss Master Craftsman",
      rating: 4.7,
      verified: true,
      profileImage: require("../../assets/mock-images/f2110458b565c3c175d76d20241374064722cd17.jpg"),
      location: "Le Locle, Switzerland",
      stats: {
        totalReviews: 267,
        totalTrades: 178,
        memberSince: 2016,
      },
      about: "Master craftsman specializing in Jaeger-LeCoultre and traditional Swiss watchmaking techniques.",
      credentials: ["Master Craftsman", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "7",
    name: "Vacheron Constantin Overseas",
    brand: "Vacheron Constantin",
    model: "Overseas Dual Time",
    price: 19500,
    image: require("../../assets/mock-images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg"),
    description: "Çift zaman dilimi, 18k pembe altın, Maltese haçı tasarımı",
    condition: "New",
    location: "Switzerland",
    seller: {
      name: "Geneva Watch House",
      rating: 4.9,
      verified: true,
      profileImage: require("../../assets/mock-images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg"),
      location: "Geneva, Switzerland",
      stats: {
        totalReviews: 298,
        totalTrades: 201,
        memberSince: 2015,
      },
      about: "Premier destination for Vacheron Constantin and high-end Swiss timepieces in Geneva.",
      credentials: ["Authorized Dealer", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "8",
    name: "IWC Portugieser",
    brand: "IWC",
    model: "Portugieser Chronograph",
    price: 14500,
    image: require("../../assets/mock-images/abbabf8c1930ca4cd8f2e326ab76bac53b57e555.jpg"),
    description:
      "Gemi kronometrelerinden ilham alan, mavi kadranlı şık tasarım",
    condition: "New",
    location: "Switzerland",
    seller: {
      name: "Marine Timepieces",
      rating: 4.3,
      verified: true,
      profileImage: require("../../assets/mock-images/abbabf8c1930ca4cd8f2e326ab76bac53b57e555.jpg"),
      location: "Hamburg, Germany",
      stats: {
        totalReviews: 174,
        totalTrades: 112,
        memberSince: 2019,
      },
      about: "Marine chronometer specialist with expertise in IWC and nautical timepieces.",
      credentials: ["Marine Specialist", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "9",
    name: "Breitling Navitimer",
    brand: "Breitling",
    model: "Navitimer B01 Chronograph",
    price: 16500,
    image: require("../../assets/mock-images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg"),
    description:
      "Sivil havacılık için tasarlanmış, slide rule bezelli profesyonel saat",
    condition: "Excellent",
    location: "Switzerland",
    seller: {
      name: "Alexander Horology",
      rating: 4.9,
      verified: true,
      profileImage: require("../../assets/mock-images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg"),
      location: "Geneva, Switzerland",
      stats: {
        totalReviews: 241,
        totalTrades: 162,
        memberSince: 2018,
      },
      about: "Specialized in rare Swiss timepieces with over 15 years of experience in luxury watches. Based in Geneva with worldwide shipping.",
      credentials: ["Authorized Dealer", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "10",
    name: "Panerai Luminor Marina",
    brand: "Panerai",
    model: "Luminor Marina 1950",
    price: 22000,
    image: require("../../assets/mock-images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg"),
    description:
      "İtalyan deniz kuvvetleri için üretilmiş, koruyucu köprülü ikonik tasarım",
    condition: "New",
    location: "Italy",
    seller: {
      name: "Luxury Watch Dealer",
      rating: 4.8,
      verified: true,
      profileImage: require("../../assets/mock-images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg"),
      location: "London, UK",
      stats: {
        totalReviews: 189,
        totalTrades: 134,
        memberSince: 2019,
      },
      about: "Premium luxury watch specialist with extensive collection of rare timepieces from top Swiss manufacturers.",
      credentials: ["Authorized Dealer", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "11",
    name: "Hublot Big Bang",
    brand: "Hublot",
    model: "Big Bang Unico",
    price: 145000,
    image: require("../../assets/mock-images/620e9786c04a185eae452e81952fe49d6af2db8e.jpg"),
    description: "Karbon fiber kasa, skeleton kadran, modern lüksün temsilcisi",
    condition: "New",
    location: "Switzerland",
    seller: {
      name: "Swiss Watch Expert",
      rating: 4.9,
      verified: true,
      profileImage: require("../../assets/mock-images/620e9786c04a185eae452e81952fe49d6af2db8e.jpg"),
      location: "Zurich, Switzerland",
      stats: {
        totalReviews: 312,
        totalTrades: 198,
        memberSince: 2017,
      },
      about: "Master watchmaker with 20+ years experience in Swiss haute horlogerie. Specializing in Patek Philippe and Vacheron Constantin.",
      credentials: ["Master Watchmaker", "Certified Authenticator"],
      inventory: [],
    },
  },
  {
    id: "12",
    name: "TAG Heuer Monaco",
    brand: "TAG Heuer",
    model: "Monaco Calibre 11",
    price: 9500,
    image: require("../../assets/mock-images/f2110458b565c3c175d76d20241374064722cd17.jpg"),
    description: "Steve McQueen imzalı, kare kasa, otomatik kronograf",
    condition: "Very Good",
    location: "Switzerland",
    seller: {
      name: "Vintage Timepieces",
      rating: 4.2,
      verified: true,
      profileImage: require("../../assets/mock-images/f2110458b565c3c175d76d20241374064722cd17.jpg"),
      location: "New York, USA",
      stats: {
        totalReviews: 156,
        totalTrades: 98,
        memberSince: 2020,
      },
      about: "Vintage and pre-owned luxury watch specialist. Expert in Omega, Rolex, and vintage Swiss timepieces.",
      credentials: ["Vintage Specialist", "Certified Authenticator"],
      inventory: [],
    },
  },
];

export async function getProducts(): Promise<Product[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 500);
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = products.find((p) => p.id === id);
  return product || null;
}

// Popüler markalar için fonksiyon
export async function getPopularBrands() {
  // Ürünlerden popüler markaları çıkar
  const brandCounts = products.reduce((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // En çok ürünü olan 5 markayı al
  const popularBrands = Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([brand, count]) => ({
      id: brand,
      name: brand,
      logo: `https://logos-world.net/wp-content/uploads/2020/12/${brand.replace(
        " ",
        "-"
      )}-Logo.png`,
      count: count.toString(),
    }));

  return popularBrands;
}

export async function getTrendingBrands() {
  const brandCounts = products.reduce((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trendingBrands = Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([brand, count]) => {
      const brandProduct = products.find((p) => p.brand === brand);
      return {
        id: brand,
        name: brand,
        image:
          brandProduct?.image ||
          require("../../assets/mock-images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg"),
        count: `${count} ürün`,
      };
    });

  return trendingBrands;
}

export async function getBrandImages() {
  const brandImages: Record<string, Record<string, string>> = {};

  products.forEach((product) => {
    if (!brandImages[product.brand]) {
      brandImages[product.brand] = {};
    }
    brandImages[product.brand][product.model] = product.image;
  });

  return brandImages;
}

export default {
  getProducts,
  getProductById,
  products,
  getPopularBrands,
  getTrendingBrands,
  getBrandImages,
};

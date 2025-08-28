export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  image: any; // require() kullandığımız için any tipi
  description: string;
  condition: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Rolex Submariner Date",
    brand: "Rolex",
    model: "Submariner Date 41",
    price: 1250000,
    image: require("../../images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg"),
    description:
      "Orijinal box ve paperlı, 2023 model, yeşil kadranlı ikonik denizci saat",
    condition: "New",
  },
  {
    id: "2",
    name: "Audemars Piguet Royal Oak",
    brand: "Audemars Piguet",
    model: "Royal Oak 15500ST",
    price: 2850000,
    image: require("../../images/abbabf8c1930ca4cd8f2e326ab76bac53b57e555.jpg"),
    description:
      "Tapisserie kadranlı, otomatik mekanizmalı, çelik kasa ve bracelet",
    condition: "Excellent",
  },
  {
    id: "3",
    name: "Patek Philippe Nautilus",
    brand: "Patek Philippe",
    model: "Nautilus 5711/1A",
    price: 4200000,
    image: require("../../images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg"),
    description: "Mavi kadranlı, sınırlı üretim, koleksiyonluk nadide parça",
    condition: "New",
  },
  {
    id: "4",
    name: "Omega Speedmaster Moonwatch",
    brand: "Omega",
    model: "Speedmaster Professional",
    price: 185000,
    image: require("../../images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg"),
    description:
      "Ay yürüyüşü için NASA onaylı, mekanik kronograf, siyah kadran",
    condition: "New",
  },
  {
    id: "5",
    name: "Cartier Tank Louis",
    brand: "Cartier",
    model: "Tank Louis Cartier",
    price: 320000,
    image: require("../../images/620e9786c04a185eae452e81952fe49d6af2db8e.jpg"),
    description: "18k altın kasa, el yapımı, klasik zarafet timsali",
    condition: "Very Good",
  },
  {
    id: "6",
    name: "Jaeger-LeCoultre Reverso",
    brand: "Jaeger-LeCoultre",
    model: "Reverso Classic",
    price: 275000,
    image: require("../../images/f2110458b565c3c175d76d20241374064722cd17.jpg"),
    description: "Çevrilebilir kasa, art deco tasarım, el yapımı mekanizma",
    condition: "Excellent",
  },
  {
    id: "7",
    name: "Vacheron Constantin Overseas",
    brand: "Vacheron Constantin",
    model: "Overseas Dual Time",
    price: 1950000,
    image: require("../../images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg"),
    description: "Çift zaman dilimi, 18k pembe altın, Maltese haçı tasarımı",
    condition: "New",
  },
  {
    id: "8",
    name: "IWC Portugieser",
    brand: "IWC",
    model: "Portugieser Chronograph",
    price: 145000,
    image: require("../../images/abbabf8c1930ca4cd8f2e326ab76bac53b57e555.jpg"),
    description:
      "Gemi kronometrelerinden ilham alan, mavi kadranlı şık tasarım",
    condition: "New",
  },
  {
    id: "9",
    name: "Breitling Navitimer",
    brand: "Breitling",
    model: "Navitimer B01 Chronograph",
    price: 165000,
    image: require("../../images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg"),
    description:
      "Sivil havacılık için tasarlanmış, slide rule bezelli profesyonel saat",
    condition: "Excellent",
  },
  {
    id: "10",
    name: "Panerai Luminor Marina",
    brand: "Panerai",
    model: "Luminor Marina 1950",
    price: 220000,
    image: require("../../images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg"),
    description:
      "İtalyan deniz kuvvetleri için üretilmiş, koruyucu köprülü ikonik tasarım",
    condition: "New",
  },
  {
    id: "11",
    name: "Hublot Big Bang",
    brand: "Hublot",
    model: "Big Bang Unico",
    price: 1850000,
    image: require("../../images/620e9786c04a185eae452e81952fe49d6af2db8e.jpg"),
    description: "Karbon fiber kasa, skeleton kadran, modern lüksün temsilcisi",
    condition: "New",
  },
  {
    id: "12",
    name: "TAG Heuer Monaco",
    brand: "TAG Heuer",
    model: "Monaco Calibre 11",
    price: 95000,
    image: require("../../images/f2110458b565c3c175d76d20241374064722cd17.jpg"),
    description: "Steve McQueen imzalı, kare kasa, otomatik kronograf",
    condition: "Very Good",
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
      count,
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
          require("../../images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg"),
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

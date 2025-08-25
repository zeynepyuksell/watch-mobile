export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  image: string;
  description: string;
  condition: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Rolex Submariner Date',
    brand: 'Rolex',
    model: 'Submariner Date 41',
    price: 1250000,
    image: 'https://cdn2.chrono24.com/images/uhren/22662738-3h6i8z4k6lzw0s7twg8s48wg-ExtraLarge.jpg',
    description: 'Orijinal box ve paperlı, 2023 model, yeşil kadranlı ikonik denizci saat',
    condition: 'Yeni'
  },
  {
    id: '2',
    name: 'Audemars Piguet Royal Oak',
    brand: 'Audemars Piguet',
    model: 'Royal Oak 15500ST',
    price: 2850000,
    image: 'https://cdn2.chrono24.com/images/uhren/23456789-ab1c2d3e4f5g6h7i8j9k0l1m-ExtraLarge.jpg',
    description: 'Tapisserie kadranlı, otomatik mekanizmalı, çelik kasa ve bracelet',
    condition: 'Az Kullanılmış'
  },
  {
    id: '3',
    name: 'Patek Philippe Nautilus',
    brand: 'Patek Philippe',
    model: 'Nautilus 5711/1A',
    price: 4200000,
    image: 'https://cdn2.chrono24.com/images/uhren/34567890-cd2e3f4g5h6i7j8k9l0m1n2o-ExtraLarge.jpg',
    description: 'Mavi kadranlı, sınırlı üretim, koleksiyonluk nadide parça',
    condition: 'Yeni'
  },
  {
    id: '4',
    name: 'Omega Speedmaster Moonwatch',
    brand: 'Omega',
    model: 'Speedmaster Professional',
    price: 185000,
    image: 'https://cdn2.chrono24.com/images/uhren/22334455-er5t6y7u8i9o0p1q2w3e4r5t-ExtraLarge.jpg',
    description: 'Ay yürüyüşü için NASA onaylı, mekanik kronograf, siyah kadran',
    condition: 'Yeni'
  },
  {
    id: '5',
    name: 'Cartier Tank Louis',
    brand: 'Cartier',
    model: 'Tank Louis Cartier',
    price: 320000,
    image: 'https://cdn2.chrono24.com/images/uhren/45678901-de3f4g5h6i7j8k9l0m1n2o3p-ExtraLarge.jpg',
    description: '18k altın kasa, el yapımı, klasik zarafet timsali',
    condition: 'Orta Kullanılmış'
  },
  {
    id: '6',
    name: 'Jaeger-LeCoultre Reverso',
    brand: 'Jaeger-LeCoultre',
    model: 'Reverso Classic',
    price: 275000,
    image: 'https://cdn2.chrono24.com/images/uhren/56789012-ef4g5h6i7j8k9l0m1n2o3p4q-ExtraLarge.jpg',
    description: 'Çevrilebilir kasa, art deco tasarım, el yapımı mekanizma',
    condition: 'Az Kullanılmış'
  },
  {
    id: '7',
    name: 'Vacheron Constantin Overseas',
    brand: 'Vacheron Constantin',
    model: 'Overseas Dual Time',
    price: 1950000,
    image: 'https://cdn2.chrono24.com/images/uhren/67890123-fg5h6i7j8k9l0m1n2o3p4q5r-ExtraLarge.jpg',
    description: 'Çift zaman dilimi, 18k pembe altın, Maltese haçı tasarımı',
    condition: 'Yeni'
  },
  {
    id: '8',
    name: 'IWC Portugieser',
    brand: 'IWC',
    model: 'Portugieser Chronograph',
    price: 145000,
    image: 'https://cdn2.chrono24.com/images/uhren/78901234-gh6i7j8k9l0m1n2o3p4q5r6s-ExtraLarge.jpg',
    description: 'Gemi kronometrelerinden ilham alan, mavi kadranlı şık tasarım',
    condition: 'Yeni'
  },
  {
    id: '9',
    name: 'Breitling Navitimer',
    brand: 'Breitling',
    model: 'Navitimer B01 Chronograph',
    price: 165000,
    image: 'https://cdn2.chrono24.com/images/uhren/89012345-hi7j8k9l0m1n2o3p4q5r6s7t-ExtraLarge.jpg',
    description: 'Sivil havacılık için tasarlanmış, slide rule bezelli profesyonel saat',
    condition: 'Az Kullanılmış'
  },
  {
    id: '10',
    name: 'Panerai Luminor Marina',
    brand: 'Panerai',
    model: 'Luminor Marina 1950',
    price: 220000,
    image: 'https://cdn2.chrono24.com/images/uhren/90123456-ij8k9l0m1n2o3p4q5r6s7t8u-ExtraLarge.jpg',
    description: 'İtalyan deniz kuvvetleri için üretilmiş, koruyucu köprülü ikonik tasarım',
    condition: 'Yeni'
  },
  {
    id: '11',
    name: 'Hublot Big Bang',
    brand: 'Hublot',
    model: 'Big Bang Unico',
    price: 1850000,
    image: 'https://cdn2.chrono24.com/images/uhren/01234567-jk9l0m1n2o3p4q5r6s7t8u9v-ExtraLarge.jpg',
    description: 'Karbon fiber kasa, skeleton kadran, modern lüksün temsilcisi',
    condition: 'Yeni'
  },
  {
    id: '12',
    name: 'TAG Heuer Monaco',
    brand: 'TAG Heuer',
    model: 'Monaco Calibre 11',
    price: 95000,
    image: 'https://cdn2.chrono24.com/images/uhren/12345678-kl0m1n2o3p4q5r6s7t8u9v0w-ExtraLarge.jpg',
    description: 'Steve McQueen imzalı, kare kasa, otomatik kronograf',
    condition: 'Orta Kullanılmış'
  }
];

export async function getProducts(): Promise<Product[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 500);
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = products.find(p => p.id === id);
  return product || null;
}

export default { getProducts, getProductById, products };
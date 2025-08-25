import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { getProducts, Product } from "../api/products";
import Button from "../components/ui/Button";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;

const popularBrands = [
  {
    id: "1",
    name: "Rolex",
    logo: "https://logos-world.net/wp-content/uploads/2020/12/Rolex-Logo.png",
  },
  {
    id: "2",
    name: "Audemars Piguet",
    logo: "https://logos-world.net/wp-content/uploads/2021/11/Audemars-Piguet-Logo.png",
  },
  {
    id: "3",
    name: "Patek Philippe",
    logo: "https://logos-world.net/wp-content/uploads/2021/11/Patek-Philippe-Logo.png",
  },
  {
    id: "4",
    name: "Omega",
    logo: "https://logos-world.net/wp-content/uploads/2020/12/Omega-Logo.png",
  },
  {
    id: "5",
    name: "Cartier",
    logo: "https://logos-world.net/wp-content/uploads/2022/12/Cartier-Logo.png",
  },
];

const trendingBrands = [
  {
    id: "1",
    name: "Rolex",
    image:
      "https://cdn2.chrono24.com/images/uhren/22662738-3h6i8z4k6lzw0s7twg8s48wg-ExtraLarge.jpg",
    count: "124 ürün",
  },
  {
    id: "2",
    name: "Audemars Piguet",
    image:
      "https://cdn2.chrono24.com/images/uhren/23456789-ab1c2d3e4f5g6h7i8j9k0l1m-ExtraLarge.jpg",
    count: "98 ürün",
  },
  {
    id: "3",
    name: "Patek Philippe",
    image:
      "https://cdn2.chrono24.com/images/uhren/34567890-cd2e3f4g5h6i7j8k9l0m1n2o-ExtraLarge.jpg",
    count: "76 ürün",
  },
  {
    id: "4",
    name: "Omega",
    image:
      "https://cdn2.chrono24.com/images/uhren/22334455-er5t6y7u8i9o0p1q2w3e4r5t-ExtraLarge.jpg",
    count: "54 ürün",
  },
  {
    id: "5",
    name: "Cartier",
    image:
      "https://cdn2.chrono24.com/images/uhren/45678901-de3f4g5h6i7j8k9l0m1n2o3p-ExtraLarge.jpg",
    count: "42 ürün",
  },
];

const watchImages = {
  Rolex: {
    "Submariner Date 41":
      "https://cdn2.chrono24.com/images/uhren/22662738-3h6i8z4k6lzw0s7twg8s48wg-ExtraLarge.jpg",
    "Day-Date 40":
      "https://cdn2.chrono24.com/images/uhren/25476552-gp8j2m6nz8y1t5x7i4w3l2qk-ExtraLarge.jpg",
  },
  Omega: {
    "Seamaster Diver 300M":
      "https://cdn2.chrono24.com/images/uhren/23423452-sd7f8g9h0j1k2l3m4n5o6p7q-ExtraLarge.jpg",
    "Speedmaster Professional":
      "https://cdn2.chrono24.com/images/uhren/22334455-er5t6y7u8i9o0p1q2w3e4r5t-ExtraLarge.jpg",
  },
  Audemars: {
    "Royal Oak 15500ST":
      "https://cdn2.chrono24.com/images/uhren/23456789-ab1c2d3e4f5g6h7i8j9k0l1m-ExtraLarge.jpg",
  },
  Patek: {
    "Nautilus 5711/1A":
      "https://cdn2.chrono24.com/images/uhren/34567890-cd2e3f4g5h6i7j8k9l0m1n2o-ExtraLarge.jpg",
  },
  Cartier: {
    "Tank Louis Cartier":
      "https://cdn2.chrono24.com/images/uhren/45678901-de3f4g5h6i7j8k9l0m1n2o3p-ExtraLarge.jpg",
  },
};

const getRandomDate = () => {
  const randomDays = Math.floor(Math.random() * 30);
  const date = new Date();
  date.setDate(date.getDate() - randomDays);
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Fiyat aralıkları
  const priceRanges = [
    { label: "0-200.000 TL", min: 0, max: 200000 },
    { label: "200.000-500.000 TL", min: 200000, max: 500000 },
    { label: "500.000-1.000.000 TL", min: 500000, max: 1000000 },
    { label: "1.000.000+ TL", min: 1000000, max: 5000000 },
  ];

  const filtered = useMemo(() => {
    let result = data;

    // Arama filtresi
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        `${p.brand} ${p.model} ${p.name}`.toLowerCase().includes(q)
      );
    }

    // Fiyat filtresi
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Marka filtresi
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    return result;
  }, [data, query, priceRange, selectedBrands]);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const selectPriceRange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  // Ürün kartı bileşeni
  const ProductCard = ({ item }: { item: Product }) => {
    const imageUrl =
      item.image ||
      watchImages[item.brand]?.[item.model] ||
      "https://via.placeholder.com/300x300.png?text=No+Image";
    const postedDate = getRandomDate();

    return (
      <TouchableOpacity style={styles.productCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{item.condition}</Text>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.brandText}>{item.brand}</Text>
          <Text style={styles.modelText} numberOfLines={1}>
            {item.model}
          </Text>

          <View style={styles.priceContainerCard}>
            <Text style={styles.priceTextCard}>
              {item.price.toLocaleString("tr-TR")} TL
            </Text>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.dateContainer}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.dateText}>{postedDate}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Trend marka kartı bileşeni
  const TrendBrandCard = ({ item }: { item: (typeof trendingBrands)[0] }) => {
    return (
      <TouchableOpacity
        style={styles.trendBrandCard}
        onPress={() => toggleBrand(item.name)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.trendBrandImage}
          resizeMode="cover"
        />
        <View style={styles.trendBrandInfo}>
          <Text style={styles.trendBrandName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.trendBrandCount}>{item.count}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.searchSection}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#6B7280"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Marka, model veya özellik ara..."
                placeholderTextColor="#6B7280"
                value={query}
                onChangeText={setQuery}
                style={styles.searchInput}
                clearButtonMode="while-editing"
              />
            </View>
          </View>

          {(selectedBrands.length > 0 ||
            query ||
            priceRange[0] > 0 ||
            priceRange[1] < 5000000) && (
            <View style={styles.activeFiltersContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.activeFiltersContent}
              >
                {query && (
                  <View style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>"{query}"</Text>
                    <TouchableOpacity onPress={() => setQuery("")}>
                      <Ionicons name="close" size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                )}

                {selectedBrands.map((brand) => (
                  <View key={brand} style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>{brand}</Text>
                    <TouchableOpacity onPress={() => toggleBrand(brand)}>
                      <Ionicons name="close" size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                ))}

                {(priceRange[0] > 0 || priceRange[1] < 5000000) && (
                  <View style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>
                      {priceRange[0].toLocaleString()}-
                      {priceRange[1].toLocaleString()} TL
                    </Text>
                    <TouchableOpacity
                      onPress={() => setPriceRange([0, 5000000])}
                    >
                      <Ionicons name="close" size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={() => {
                    setQuery("");
                    setPriceRange([0, 5000000]);
                    setSelectedBrands([]);
                  }}
                >
                  <Text style={styles.clearAllText}>Tümünü Temizle</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popüler Markalar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.brandsContainer}
            contentContainerStyle={styles.brandsContent}
          >
            {popularBrands.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                style={[
                  styles.brandChip,
                  selectedBrands.includes(brand.name) &&
                    styles.brandChipSelected,
                ]}
                onPress={() => toggleBrand(brand.name)}
              >
                <Text
                  style={[
                    styles.brandChipText,
                    selectedBrands.includes(brand.name) &&
                      styles.brandChipTextSelected,
                  ]}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trend Markalar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.trendBrandsContainer}
            contentContainerStyle={styles.trendBrandsContent}
          >
            {trendingBrands.map((brand) => (
              <TrendBrandCard key={brand.id} item={brand} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fiyat Aralığı</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.priceRangeContainer}
            contentContainerStyle={styles.priceRangeContent}
          >
            {priceRanges.map((range, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.priceChip,
                  priceRange[0] === range.min &&
                    priceRange[1] === range.max &&
                    styles.priceChipSelected,
                ]}
                onPress={() => selectPriceRange(range.min, range.max)}
              >
                <Text
                  style={[
                    styles.priceChipText,
                    priceRange[0] === range.min &&
                      priceRange[1] === range.max &&
                      styles.priceChipTextSelected,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saatler</Text>
            <Text style={styles.productCount}>{filtered.length} ürün</Text>
          </View>

          {filtered.length > 0 ? (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <ProductCard item={item} />
                </View>
              )}
              contentContainerStyle={styles.productsContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>
                Aramanıza uygun ürün bulunamadı
              </Text>
              <Button
                title="Filtreleri Sıfırla"
                onPress={() => {
                  setQuery("");
                  setPriceRange([0, 5000000]);
                  setSelectedBrands([]);
                }}
                variant="secondary"
                style={styles.resetButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1118",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#0D1118",
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    gap: 20,
  },
  searchSection: {
    width: "100%",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    padding: 0,
  },
  activeFiltersContainer: {
    marginTop: 4,
  },
  activeFiltersContent: {
    paddingRight: 20,
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginRight: 8,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6366F1",
  },
  clearAllButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  section: {
    backgroundColor: "#0D1118",
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  seeAll: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  productCount: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  trendBrandsContainer: {
    flexGrow: 0,
  },
  trendBrandsContent: {
    paddingRight: 16,
    gap: 12,
  },
  trendBrandCard: {
    width: 120,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    overflow: "hidden",
  },
  trendBrandImage: {
    width: "100%",
    height: 80,
  },
  trendBrandInfo: {
    padding: 8,
  },
  trendBrandName: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
  },
  trendBrandCount: {
    color: "#9CA3AF",
    fontSize: 10,
  },
  brandsContainer: {
    flexGrow: 0,
  },
  brandsContent: {
    paddingRight: 16,
  },
  brandChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#1F2937",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: 80,
  },
  brandChipSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  brandChipText: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  brandChipTextSelected: {
    color: "#ffffff",
  },
  priceRangeContainer: {
    flexGrow: 0,
  },
  priceRangeContent: {
    paddingRight: 16,
  },
  priceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  priceChipSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  priceChipText: {
    color: "#E5E7EB",
    fontWeight: "500",
    fontSize: 12,
  },
  priceChipTextSelected: {
    color: "#fff",
  },
  productsContainer: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  productCard: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  imageContainer: {
    position: "relative",
    height: 150,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  conditionBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  conditionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  productInfo: {
    padding: 12,
  },
  brandText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  modelText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  priceContainerCard: {
    marginBottom: 8,
  },
  priceTextCard: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 16,
    marginBottom: 24,
  },
  resetButton: {
    alignSelf: "center",
  },
});

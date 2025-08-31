import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ListRenderItem,
  Modal,
} from "react-native";
import ProductDetail from "./Detail";
import {
  getProducts,
  getPopularBrands,
  getTrendingBrands,
  getBrandImages,
  Product,
} from "../api/products";
import Button from "../components/ui/Button";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import FilterModal from "./FilterModal";
import styles from "./Feed.styles";
interface Brand {
  id: string;
  name: string;
  count: string;
  image?: any;
}

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

interface Condition {
  id: string;
  label: string;
  value: string;
}

interface Location {
  id: string;
  name: string;
}

const Feed: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<Product[]>([]);
  const [popularBrands, setPopularBrands] = useState<Brand[]>([]);
  const [trendingBrands, setTrendingBrands] = useState<Brand[]>([]);
  const [brandImages, setBrandImages] = useState<
    Record<string, Record<string, string>>
  >({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Worldwide");
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const conditions: Condition[] = [
    { id: "1", label: "New", value: "new" },
    { id: "2", label: "Excellent", value: "excellent" },
    { id: "3", label: "Very Good", value: "very good" },
    { id: "4", label: "Good", value: "good" },
  ];

  const locations: Location[] = [
    { id: "1", name: "Worldwide" },
    { id: "2", name: "United States" },
    { id: "3", name: "Europe" },
    { id: "4", name: "Asia" },
    { id: "5", name: "Turkey" },
    { id: "6", name: "United Kingdom" },
  ];

  const priceRanges: PriceRange[] = [
    { label: "0-50.000 TL", min: 0, max: 50000 },
    { label: "50.000-100.000 TL", min: 50000, max: 100000 },
    { label: "100.000-150.000 TL", min: 100000, max: 150000 },
    { label: "100.000-500.000 TL", min: 100000, max: 5000000 },
  ];

  const load = async (): Promise<void> => {
    setLoading(true);
    try {
      const [products, brands, trends, images] = await Promise.all([
        getProducts(),
        getPopularBrands(),
        getTrendingBrands(),
        getBrandImages(),
      ]);
      setData(products);
      setPopularBrands(brands);
      setTrendingBrands(trends);
      setBrandImages(images);
    } finally {
      setLoading(false);
    }
  };

  const getRandomDate = (): string => {
    const randomDays = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - randomDays);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = data;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        `${p.brand} ${p.model} ${p.name}`.toLowerCase().includes(q)
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedConditions.length > 0) {
      result = result.filter((p) =>
        selectedConditions.includes(p.condition.toLowerCase())
      );
    }

    if (selectedLocation !== "Worldwide") {
      result = result.filter((p) => p.location === selectedLocation);
    }

    return result;
  }, [
    data,
    query,
    priceRange,
    selectedBrands,
    selectedConditions,
    selectedLocation,
  ]);

  const toggleBrand = (brand: string): void => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleCondition = (condition: string): void => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const selectLocation = (location: string): void => {
    setSelectedLocation(location);
  };

  const selectPriceRange = (min: number, max: number): void => {
    setPriceRange([min, max]);
  };

  const resetFilters = (): void => {
    setQuery("");
    setPriceRange([0, 150000]);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedLocation("Worldwide");
  };

  const ProductCard: React.FC<{ item: Product }> = ({ item }) => {
    const postedDate = getRandomDate();
    const views = Math.floor(Math.random() * 4900) + 100;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => setSelectedProductId(item.id)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
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

          <View style={styles.metaContainer}>
            <View style={styles.dateContainer}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.dateText}>{postedDate}</Text>
            </View>
            <View style={styles.viewsContainer}>
              <Ionicons name="eye-outline" size={14} color="#6b7280" />
              <Text style={styles.viewsText}>
                {views.toLocaleString("tr-TR")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const TrendBrandCard: React.FC<{ item: Brand }> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.trendBrandCard}
        onPress={() => toggleBrand(item.name)}
      >
        <Image
          source={item.image}
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

  const renderProductItem: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.cardWrapper}>
      <ProductCard item={item} />
    </View>
  );

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedConditions.length > 0 ||
    query ||
    priceRange[0] > 0 ||
    priceRange[1] < 150000 ||
    selectedLocation !== "Worldwide";

  const ActiveFilters = () => (
    <View style={styles.activeFiltersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.activeFiltersContent}
      >
        {query && (
          <View style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>{query}</Text>
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

        {selectedConditions.map((condition) => (
          <View key={condition} style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>
              {conditions.find((c) => c.value === condition)?.label}
            </Text>
            <TouchableOpacity onPress={() => toggleCondition(condition)}>
              <Ionicons name="close" size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>
        ))}

        {(priceRange[0] > 0 || priceRange[1] < 150000) && (
          <View style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>
              {priceRange[0].toLocaleString()}-{priceRange[1].toLocaleString()}{" "}
              TL
            </Text>
            <TouchableOpacity onPress={() => setPriceRange([0, 150000])}>
              <Ionicons name="close" size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>
        )}

        {selectedLocation !== "Worldwide" && (
          <View style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>{selectedLocation}</Text>
            <TouchableOpacity onPress={() => setSelectedLocation("Worldwide")}>
              <Ionicons name="close" size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.clearAllButton} onPress={resetFilters}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

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
                placeholder="Search Watchcage"
                placeholderTextColor="#6B7280"
                value={query}
                onChangeText={setQuery}
                style={styles.searchInput}
                clearButtonMode="while-editing"
              />
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Feather name="filter" size={20} color="#6366F1" />
              {hasActiveFilters && <View style={styles.filterBadge} />}
            </TouchableOpacity>
          </View>

          {hasActiveFilters && <ActiveFilters />}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      >
        {/* Popular Brands Section */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.brandsContainer}
            contentContainerStyle={styles.brandsContent}
          >
            <TouchableOpacity
              style={[
                styles.brandChip,
                selectedBrands.length === 0 && styles.brandChipSelected,
              ]}
              onPress={() => setSelectedBrands([])}
            >
              <Text
                style={[
                  styles.brandChipText,
                  selectedBrands.length === 0 && styles.brandChipTextSelected,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

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
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
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
            <Text style={styles.sectionTitle}>Price Range</Text>
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
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <Text style={styles.productCount}>{filtered.length} product</Text>
          </View>

          {filtered.length > 0 ? (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={renderProductItem}
              contentContainerStyle={styles.productsContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>
                No products found matching your search
              </Text>
              <Button
                title="Reset Filters"
                onPress={resetFilters}
                variant="secondary"
                style={styles.resetButton}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        query={query}
        setQuery={setQuery}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedBrands={selectedBrands}
        toggleBrand={toggleBrand}
        selectedConditions={selectedConditions}
        toggleCondition={toggleCondition}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        resetFilters={resetFilters}
        conditions={conditions}
        locations={locations}
      />

      {selectedProductId && (
        <View style={styles.detailOverlay}>
          <ProductDetail
            productId={selectedProductId}
            onClose={() => setSelectedProductId(null)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Feed;

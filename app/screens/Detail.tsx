import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProducts, Product } from "../api/products";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const hoursData = Array.from({ length: 24 }, (_, i) => ({
  id: `${i + 1}`,
  hour: `${i}:00`,
  productId: `prod-${i + 100}`,
}));

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("details");

  const scrollY = new Animated.Value(0);

  const conditionColor =
    product?.condition === "Yeni"
      ? "#10b981"
      : product?.condition === "Az Kullanılmış"
      ? "#f59e0b"
      : "#6b7280";

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await getProducts();
        const foundProduct = products.find((p) => p.id === id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const openProductDetail = (productId: string) => {
    router.push(`/product-detail?id=${productId}`);
  };

  const renderHourItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.hourItem}
      onPress={() => openProductDetail(item.productId)}
    >
      <View style={styles.hourCircle}>
        <Text style={styles.hourText}>{item.hour}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saatler</Text>
          <Text style={styles.subtitle}>
            Bir saate tıklayarak ürün detayını görüntüleyin
          </Text>
        </View>

        <FlatList
          data={hoursData}
          renderItem={renderHourItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>Ürün bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <Animated.View style={[styles.fixedHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.fixedHeaderTitle} numberOfLines={1}>
          {product.brand} {product.model}
        </Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Product Image */}
        <Animated.View
          style={[styles.imageContainer, { opacity: imageOpacity }]}
        >
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image-outline" size={64} color="#9ca3af" />
              <Text style={styles.noImageSubtext}>Resim Yok</Text>
            </View>
          )}
        </Animated.View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.model}>{product.model}</Text>
          </View>

          {/* Condition Badge */}
          <View style={styles.conditionContainer}>
            <View
              style={[
                styles.conditionBadge,
                { backgroundColor: `${conditionColor}15` },
              ]}
            >
              <View
                style={[
                  styles.conditionDot,
                  { backgroundColor: conditionColor },
                ]}
              />
              <Text style={[styles.conditionText, { color: conditionColor }]}>
                {product.condition}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {product.price.toLocaleString("tr-TR")} TL
            </Text>
            <Text style={styles.priceLabel}>+ KDV</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "details" && styles.activeTab]}
              onPress={() => setActiveTab("details")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "details" && styles.activeTabText,
                ]}
              >
                Detaylar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "specs" && styles.activeTab]}
              onPress={() => setActiveTab("specs")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "specs" && styles.activeTabText,
                ]}
              >
                Özellikler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
              onPress={() => setActiveTab("reviews")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "reviews" && styles.activeTabText,
                ]}
              >
                Yorumlar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "details" && (
            <View style={styles.tabContent}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="pricetag-outline" size={20} color="#6366f1" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Marka</Text>
                  <Text style={styles.detailValue}>{product.brand}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="cube-outline" size={20} color="#6366f1" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Model</Text>
                  <Text style={styles.detailValue}>{product.model}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="#6366f1"
                  />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Durum</Text>
                  <Text style={styles.detailValue}>{product.condition}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="barcode-outline" size={20} color="#6366f1" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Ürün ID</Text>
                  <Text style={styles.detailValue}>{product.id}</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === "specs" && (
            <View style={styles.tabContent}>
              <Text style={styles.comingSoon}>Yakında gelecek...</Text>
            </View>
          )}

          {activeTab === "reviews" && (
            <View style={styles.tabContent}>
              <Text style={styles.comingSoon}>Yakında gelecek...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton}>
          <MaterialIcons name="chat" size={20} color="#fff" />
          <Text style={styles.chatButtonText}>Sohbet Et</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton}>
          <Feather name="phone" size={20} color="#fff" />
          <Text style={styles.callButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  fixedHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    maxWidth: width - 120,
  },
  imageContainer: {
    height: 380,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  noImageSubtext: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 8,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  titleContainer: {
    marginBottom: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  model: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4b5563",
  },
  conditionContainer: {
    marginBottom: 16,
  },
  conditionBadge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#059669",
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#6366f1",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#6366f1",
  },
  tabContent: {
    marginBottom: 100,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    alignItems: "center",
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  comingSoon: {
    textAlign: "center",
    color: "#9ca3af",
    paddingVertical: 40,
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#6366f1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  chatButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  callButton: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  callButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#dc2626",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Saat listesi stilleri
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  listContainer: {
    padding: 16,
  },
  hourItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hourCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  hourText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
});

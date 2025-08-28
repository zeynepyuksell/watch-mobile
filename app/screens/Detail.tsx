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
  Share,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProducts, Product } from "../api/products";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Saat verileri - gerçek uygulamada API'den çekilecek
const hoursData = Array.from({ length: 24 }, (_, i) => ({
  id: `${i + 1}`,
  hour: `${i}:00`,
  productId: `prod-${i + 100}`,
  // Saat kartlarında gösterilecek temel bilgiler
  brand: "Saat Markası",
  model: `Model ${i + 1}`,
  price: (1000 + i * 50) * (i % 3 === 0 ? 0.9 : 1), // Fiyat varyasyonu
  condition:
    i % 3 === 0 ? "Yeni" : i % 3 === 1 ? "Az Kullanılmış" : "Kullanılmış",
  image: require("../assets/images/placeholder-watch.jpg"), // Gerçek uygulamada dinamik olacak
}));

type ProductDetailProps = {
  productId?: string;
  onClose?: () => void;
};

export default function ProductDetail(props: ProductDetailProps) {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("details");
  const [messageText, setMessageText] = React.useState("");
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(true);
  const imageScrollRef = React.useRef<ScrollView>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const images = [product?.image, product?.image, product?.image].filter(
    Boolean
  ) as any[];

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
        // Gerçek uygulamada API'den tek bir ürün çekilecek
        const products = await getProducts();
        const targetId =
          (props.productId as string) || (id as string | undefined);

        // Önce ana ürün listesinde ara
        let foundProduct = products.find((p) => p.id === targetId);

        // Eğer ana listede bulamazsak, saat listesinde ara
        if (!foundProduct) {
          foundProduct = hoursData.find((p) => p.productId === targetId) as any;
        }

        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (props.productId || id) {
      loadProduct();
    }
  }, [id, props.productId]);

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

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      Alert.alert("Uyarı", "Lütfen bir mesaj yazın");
      return;
    }

    // Gerçek uygulamada burada mesaj gönderme API'si çağrılacak
    Alert.alert("Başarılı", "Mesajınız gönderildi");
    setMessageText("");
  };

  const toggleFavorite = () => {
    // Gerçek uygulamada burada favori durumu API'ye kaydedilecek
    setIsFavorite(!isFavorite);
    Alert.alert(isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${product?.brand} ${
          product?.model
        } - ${product?.price.toLocaleString(
          "tr-TR"
        )} TL\n\nÜrün detaylarını inceleyin!`,
        title: `${product?.brand} ${product?.model}`,
      });
    } catch (error) {
      console.error("Paylaşım hatası:", error);
    }
  };

  const renderHourItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.hourItem}
      onPress={() => openProductDetail(item.productId)}
    >
      <View style={styles.hourInfo}>
        <View style={styles.hourCircle}>
          <Text style={styles.hourText}>{item.hour}</Text>
        </View>
        <View style={styles.hourDetails}>
          <Text style={styles.hourBrand}>{item.brand}</Text>
          <Text style={styles.hourModel}>{item.model}</Text>
          <Text style={styles.hourPrice}>
            {item.price.toLocaleString("tr-TR")} TL
          </Text>
          <View
            style={[
              styles.hourCondition,
              {
                backgroundColor:
                  item.condition === "Yeni"
                    ? "#10b98115"
                    : item.condition === "Az Kullanılmış"
                    ? "#f59e0b15"
                    : "#6b728015",
              },
            ]}
          >
            <View
              style={[
                styles.hourConditionDot,
                {
                  backgroundColor:
                    item.condition === "Yeni"
                      ? "#10b981"
                      : item.condition === "Az Kullanılmış"
                      ? "#f59e0b"
                      : "#6b7280",
                },
              ]}
            />
            <Text
              style={[
                styles.hourConditionText,
                {
                  color:
                    item.condition === "Yeni"
                      ? "#10b981"
                      : item.condition === "Az Kullanılmış"
                      ? "#f59e0b"
                      : "#6b7280",
                },
              ]}
            >
              {item.condition}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );

  // Eğer ID yoksa saat listesini göster
  if (!id && !props.productId) {
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
          onPress={() => (props.onClose ? props.onClose() : router.back())}
        >
          <Ionicons name="chevron-back" size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <Text style={styles.fixedHeaderTitle} numberOfLines={1}>
          {product.brand} {product.model}
        </Text>
        <View style={styles.headerButtonPlaceholder} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Product Images Carousel */}
        <Animated.View
          style={[styles.imageContainer, { opacity: imageOpacity }]}
        >
          <ScrollView
            ref={imageScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(idx);
            }}
          >
            {(images.length > 0
              ? images
              : [product.image, product.image, product.image]
            ).map((imgSrc: any, idx: number) => (
              <Image
                key={idx}
                source={imgSrc}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Carousel arrows */}
          {(images.length || 3) > 1 && (
            <>
              <TouchableOpacity
                style={[styles.carouselArrow, styles.carouselArrowLeft]}
                onPress={() => {
                  const next = Math.max(0, currentImageIndex - 1);
                  setCurrentImageIndex(next);
                  imageScrollRef.current?.scrollTo({
                    x: next * width,
                    animated: true,
                  });
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={22} color="#E5E7EB" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.carouselArrow, styles.carouselArrowRight]}
                onPress={() => {
                  const total = images.length || 3;
                  const next = Math.min(total - 1, currentImageIndex + 1);
                  setCurrentImageIndex(next);
                  imageScrollRef.current?.scrollTo({
                    x: next * width,
                    animated: true,
                  });
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-forward" size={22} color="#E5E7EB" />
              </TouchableOpacity>
            </>
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

          {/* Summary Card: Only check icons, no dividers, icons left of heading */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryItemRow}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                <View>
                  <Text style={styles.summaryLabel}>Kondisyon</Text>
                  <Text style={styles.summaryValue}>{product.condition}</Text>
                </View>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryItemRow}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                <View>
                  <Text style={styles.summaryLabel}>Set (Box/Papers)</Text>
                  <Text style={styles.summaryValue}>Var</Text>
                </View>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryItemRow}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                <View>
                  <Text style={styles.summaryLabel}>Garanti</Text>
                  <Text style={styles.summaryValue}>12 Ay</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Collapsible Details Header */}
          <TouchableOpacity
            style={styles.collapseHeader}
            onPress={() => setDetailsOpen(!detailsOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.collapseTitle}>Özellikler</Text>
            <Ionicons
              name={detailsOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {/* Tab Content */}
          {detailsOpen && (
            <View style={styles.tabContent}>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Case</Text>
                <Text style={styles.specValue}>Stainless Steel</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Movement</Text>
                <Text style={styles.specValue}>Automatic</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Diameter</Text>
                <Text style={styles.specValue}>41 mm</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Bracelet</Text>
                <Text style={styles.specValue}>Steel Bracelet</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Water Resistance</Text>
                <Text style={styles.specValue}>100 m</Text>
              </View>
            </View>
          )}

          {/* Sertifika Alanı */}
          <View style={styles.certificateBlock}>
            <Text style={styles.certificateTitle}>Sertifika</Text>
            <View style={styles.certificateRow}>
              <Text style={styles.certificateLabel}>Orijinallik</Text>
              <Text style={styles.certificateValue}>Sertifikalı</Text>
            </View>
            <View style={styles.certificateRow}>
              <Text style={styles.certificateLabel}>Garanti</Text>
              <Text style={styles.certificateValue}>
                12 Ay Mağaza Garantisi
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer: Mesaj solda, Paylaş sağda */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleSendMessage}
        >
          <MaterialIcons name="chat" size={20} color="#fff" />
          <Text style={styles.messageButtonText}>Mesaj Gönder</Text>
        </TouchableOpacity>
        <View style={styles.footerRightGroup}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#ef4444" : "#E5E7EB"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Feather name="share-2" size={20} color="#E5E7EB" />
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: "#0D1118",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  fixedHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    maxWidth: width - 120,
  },
  headerButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  imageContainer: {
    height: 380,
    backgroundColor: "#0D1118",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  carouselArrow: {
    position: "absolute",
    top: "50%",
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselArrowLeft: {
    left: 12,
  },
  carouselArrowRight: {
    right: 12,
  },
  productImage: {
    width: width,
    height: 380,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#0D1118",
    marginTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 16,
    overflow: "hidden",
  },
  summaryItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  summaryItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#1F2937",
  },
  titleContainer: {
    marginBottom: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  model: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9CA3AF",
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
    color: "#10B981",
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
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
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#6366f1",
  },
  tabContent: {
    marginBottom: 120,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  specLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  specValue: {
    fontSize: 14,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  collapseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  collapseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  certificateBlock: {
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 140,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  certificateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  certificateLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  certificateValue: {
    fontSize: 14,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#E5E7EB",
    fontWeight: "500",
  },
  descriptionBlock: {
    paddingTop: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
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
    backgroundColor: "#111827",
    borderTopWidth: 1,
    borderTopColor: "#374151",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerRightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  messageButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "600",
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
    borderBottomColor: "#374151",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  listContainer: {
    padding: 16,
  },
  hourItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  hourInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  hourCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6366f115",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  hourText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
  hourDetails: {
    flex: 1,
  },
  hourBrand: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  hourModel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  hourPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 4,
  },
  hourCondition: {
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  hourConditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  hourConditionText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { getProducts, Product } from "../api/products";

const { width } = Dimensions.get("window");

interface DetailScreenProps {
  productId?: string;
  onClose?: () => void;
}

const DetailScreen = ({ productId, onClose }: DetailScreenProps = {}) => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [specsOpen, setSpecsOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const loadProduct = async () => {
      const products = await getProducts();
      const actualProductId = productId || (Array.isArray(id) ? id[0] : id);
      let foundProduct = products.find(
        (p: Product) => p.id === actualProductId
      );

      if (!foundProduct && products.length > 0) {
        foundProduct = products[0];
      }

      setProduct(foundProduct);
    };
    loadProduct();
  }, [id, productId]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const images = [product.image, product.image, product.image, product.image];

  const nextImage = () => {
    const next = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(next);
  };

  const prevImage = () => {
    const prev =
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prev);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Full Screen Image Section */}
        <View style={styles.imageSection}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => {
              console.log("Back button pressed");
              if (onClose) {
                onClose();
              } else {
                try {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.push("/(tabs)/feed");
                  }
                } catch (error) {
                  router.push("/(tabs)/feed");
                }
              }
            }}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Fullscreen Button */}
          <TouchableOpacity
            style={styles.fullscreenButton}
            onPress={() => setIsFullscreen(true)}
          >
            <Ionicons name="expand" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Image
            source={images[currentImageIndex]}
            style={styles.fullScreenImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={[styles.arrowButton, styles.leftArrow]}
            onPress={prevImage}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.arrowButton, styles.rightArrow]}
            onPress={nextImage}
          >
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.titleSection}>
          <Text style={styles.productTitle}>
            {product.brand} {product.model} • {2019 + parseInt(product.id)}
          </Text>
        </View>

        <View style={styles.requestAccessContainer}>
          <Text style={styles.requestAccessText}>Request Access</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.summaryLabel}>Condition</Text>
            <Text style={styles.summaryValue}>{product.condition}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.summaryLabel}>Box & Papers</Text>
            <Text style={styles.summaryValue}>
              {product.condition === "New" ? "Full Set" : "Box Only"}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.summaryLabel}>Warranty</Text>
            <Text style={styles.summaryValue}>
              Until {2024 + parseInt(product.id)}
            </Text>
          </View>
        </View>

        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>Added 2d ago • 👁 324 views</Text>
        </View>

        <View
          style={[
            styles.specsMainContainer,
            { height: specsOpen ? 280 : "auto" },
          ]}
        >
          <TouchableOpacity
            style={styles.specsHeader}
            activeOpacity={0.7}
            onPress={() => setSpecsOpen(!specsOpen)}
          >
            <Text style={styles.sectionTitle}>Specifications</Text>
            <Ionicons
              name={specsOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {specsOpen && (
            <View style={styles.specsContent}>
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
                <Text style={styles.specValue}>40mm</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Bracelet</Text>
                <Text style={styles.specValue}>Steel</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Water Resistance</Text>
                <Text style={styles.specValue}>100m</Text>
              </View>
            </View>
          )}
        </View>

        {/* Custom Container Below Specs */}
        <View style={styles.customContainerBelowSpecs}>
          <MaterialIcons
            name="security"
            size={24}
            color="#10B981"
            style={styles.customShieldIcon}
          />
          <View style={styles.customTextContainer}>
            <Text style={styles.customVerifiedTitle}>Verified Authentic</Text>
            <View style={styles.certificateRow}>
              <Text style={styles.customCertificateId}>
                Certificate ID: {product.brand.slice(0, 2).toUpperCase()}-
                {product.model.slice(-4)}-{product.id.padStart(5, "0")}
              </Text>
              <TouchableOpacity
                onPress={() => console.log("View Certificate pressed")}
              >
                <Text style={styles.viewCertificateText}>View Certificate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Message Seller</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <Modal visible={isFullscreen} transparent={false}>
          <View style={styles.fullscreenContainer}>
            <TouchableOpacity
              style={styles.closeFullscreenButton}
              onPress={() => setIsFullscreen(false)}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              source={images[currentImageIndex]}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 100,
  },
  imageSection: {
    width: 430,
    height: 430,
    position: "relative",
    opacity: 1,
    alignSelf: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  leftArrow: {
    left: 20,
  },
  rightArrow: {
    right: 20,
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  paginationDotActive: {
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },

  requestAccessContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  requestAccessText: {
    color: "#8B5CF6",
    fontSize: 14,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  summaryItem: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  metaInfo: {
    width: 398,
    height: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    opacity: 1,
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "left",
    lineHeight: 16,
  },
  specsMainContainer: {
    width: 398,
    backgroundColor: "#141821",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF0D",
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF0D",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 1,
    opacity: 1,
  },
  specsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  specsContent: {
    padding: 16,
    flex: 1,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  specLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  specValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },

  bottomSpacing: {
    height: 8,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "#374151",
    alignItems: "center",
    gap: 16,
    minHeight: 80,
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  favoriteButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2D3748",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  shareButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2D3748",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  fullscreenButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeFullscreenButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  customContainerBelowSpecs: {
    width: 398,
    height: 78,
    backgroundColor: "#141821",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF0D",
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF0D",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    opacity: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  customVerifiedTitle: {
    width: 138,
    height: 24,
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
    opacity: 1,
    marginBottom: 4,
  },
  customCertificateId: {
    width: 174,
    height: 16,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#A5AEBC",
    opacity: 1,
  },
  customShieldIcon: {
    width: 24,
    height: 24,
    opacity: 1,
    marginRight: 12,
  },
  customTextContainer: {
    flex: 1,
  },
  certificateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewCertificateText: {
    width: 91,
    height: 16,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: "#B072FFCC",
    opacity: 1,
    marginRight: 16,
  },
});

export default DetailScreen;

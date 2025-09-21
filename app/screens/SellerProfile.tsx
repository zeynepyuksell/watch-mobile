import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getProducts, Product } from "../api/products";
import styles from "./SellerProfile.styles";

const { width } = Dimensions.get("window");

const SellerProfile = () => {
  const router = useRouter();
  const { sellerId } = useLocalSearchParams();
  const [seller, setSeller] = React.useState<any>(null);
  const [inventory, setInventory] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadSellerData = async () => {
      try {
        const products = await getProducts();
        // İlk ürünün seller bilgilerini al
        const firstProduct = products.find(p => p.seller);
        if (firstProduct?.seller) {
          setSeller(firstProduct.seller);
          // İlk 6 ürünü inventory olarak göster
          setInventory(products.slice(0, 6));
        }
      } catch (error) {
        console.error("Error loading seller data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, []);

  const renderInventoryItem = (item: Product, index: number) => {
    return (
      <View key={item.id} style={styles.inventoryItem}>
        <Image
          source={item.image}
          style={styles.inventoryImage}
          resizeMode="cover"
        />
        <View style={styles.inventoryInfo}>
          <Text style={styles.inventoryBrand}>{item.brand}</Text>
          <Text style={styles.inventoryModel}>{item.model}</Text>
          
          <View style={styles.inventoryActions}>
            <Text style={styles.requestAccessText}>Request Access</Text>
          </View>
          
          <View style={styles.inventoryMeta}>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{item.condition}</Text>
            </View>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.viewsContainer}>
              <Ionicons name="eye" size={12} color="#9CA3AF" />
              <Text style={styles.viewsText}>{324 + index * 50}</Text>
            </View>
            <Text style={styles.addedText}>Added {index + 1}d ago</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!seller) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Seller not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={seller.profileImage}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#000000" />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.sellerName}>{seller.name}</Text>
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.location}>{seller.location}</Text>
          </View>
        </View>

        {/* Stats */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScrollView}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={styles.ratingStatItem}>
            <Ionicons name="star" size={11} color="#FFFFFF" style={styles.singleStar} />
            <Text style={styles.ratingValue}>{seller.rating}</Text>
            <Text style={styles.reviewsValue}>({seller.stats.totalReviews})</Text>
          </View>
          
          <TouchableOpacity style={styles.tradesButton}>
            <Text style={styles.tradesLabel}>164 Trades</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.memberButton}>
            <Text style={styles.memberLabel}>2018 Member since</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tradesButton}>
            <Text style={styles.tradesLabel}>Premium Seller</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tradesButton}>
            <Text style={styles.tradesLabel}>Fast Shipping</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tradesButton}>
            <Text style={styles.tradesLabel}>24/7 Support</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About</Text>
          <Text style={styles.aboutText}>{seller.about}</Text>
          
          {/* Credentials */}
          <View style={styles.credentialsContainer}>
            {seller.credentials.map((credential: string, index: number) => (
              <View key={index} style={styles.credentialItem}>
                <Ionicons name="checkmark-circle" size={16} color="#8B5CF6" />
                <Text style={styles.credentialText}>{credential}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Message Seller</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Inventory Section */}
        <View style={styles.inventorySection}>
          <Text style={styles.inventoryTitle}>Inventory</Text>
          <View style={styles.inventoryGrid}>
            {inventory.map((item, index) => renderInventoryItem(item, index))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

export default SellerProfile;

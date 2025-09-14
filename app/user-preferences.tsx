import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Dimensions,
  useWindowDimensions,
  Image,
  PanResponder,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: screenWidth } = Dimensions.get("window");

// Marka verileri - mevcut mock görselleri ile
const WATCH_BRANDS = [
  { 
    id: "rolex", 
    name: "Rolex", 
    selected: true,
    image: require("../assets/mock-images/placeholder-watch.jpg")
  },
  { 
    id: "patek", 
    name: "Patek Philippe", 
    selected: true,
    image: require("../assets/mock-images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg")
  },
  { 
    id: "audemars", 
    name: "Audemars Piguet", 
    selected: true,
    image: require("../assets/mock-images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg")
  },
  { 
    id: "omega", 
    name: "Omega", 
    selected: true,
    image: require("../assets/mock-images/3238a4afe88c088857fce2dd79224dcc6da116d6.jpg")
  },
  { 
    id: "tudor", 
    name: "Tudor", 
    selected: false,
    image: require("../assets/mock-images/620e9786c04a185eae452e81952fe49d6af2db8e.jpg")
  },
  { 
    id: "cartier", 
    name: "Cartier", 
    selected: false,
    image: require("../assets/mock-images/abbabf8c1930ca4cd8f2e326ab76bac53b57e555.jpg")
  },
  { 
    id: "iwc", 
    name: "IWC", 
    selected: false,
    image: require("../assets/mock-images/f2110458b565c3c175d76d20241374064722cd17.jpg")
  },
  { 
    id: "vacheron", 
    name: "Vacheron Constantin", 
    selected: false,
    image: require("../assets/mock-images/placeholder-watch.jpg")
  },
  { 
    id: "lange", 
    name: "A. Lange & Söhne", 
    selected: false,
    image: require("../assets/mock-images/placeholder-watch.jpg")
  },
  { 
    id: "grandseiko", 
    name: "Grand Seiko", 
    selected: false,
    image: require("../assets/mock-images/placeholder-watch.jpg")
  },
  { 
    id: "jaeger", 
    name: "Jaeger-LeCoultre", 
    selected: false,
    image: require("../assets/mock-images/placeholder-watch.jpg")
  },
  { 
    id: "hublot", 
    name: "Hublot", 
    selected: false,
    image: require("../assets/mock-images/placeholder-watch.jpg")
  },
];

const QUICK_PICKS = ["Rolex", "Patek Philippe", "Audemars Piguet","Omega","Tudor","Cartier","IWC","Vacheron Constantin","A. Lange & Söhne","Grand Seiko","Jaeger-LeCoultre","Hublot"];

export default function UserPreferences() {
  const [brands, setBrands] = useState(WATCH_BRANDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [newArrivalsEnabled, setNewArrivalsEnabled] = useState(true);
  const [newArrivalsFrequency, setNewArrivalsFrequency] = useState("instant");
  const [newArrivalsScope, setNewArrivalsScope] = useState("followed");
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);
  const [minPrice, setMinPrice] = useState(10); // 0-100 scale
  const [maxPrice, setMaxPrice] = useState(50); // 0-100 scale
  const [condition, setCondition] = useState(["new", "excellent"]);
  const [onlyFullSet, setOnlyFullSet] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const sliderWidth = width - 72; // Container width minus padding
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);

  // Range Slider PanResponder
  const minPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDraggingMin(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      const newValue = Math.max(0, Math.min(100, (gestureState.moveX / sliderWidth) * 100));
      if (newValue <= maxPrice) {
        setMinPrice(newValue);
      }
    },
    onPanResponderRelease: () => {
      setIsDraggingMin(false);
    },
  });

  const maxPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDraggingMax(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      const newValue = Math.max(0, Math.min(100, (gestureState.moveX / sliderWidth) * 100));
      if (newValue >= minPrice) {
        setMaxPrice(newValue);
      }
    },
    onPanResponderRelease: () => {
      setIsDraggingMax(false);
    },
  });

  const toggleBrand = (brandId: string) => {
    setBrands(prev =>
      prev.map(brand =>
        brand.id === brandId ? { ...brand, selected: !brand.selected } : brand
      )
    );
  };

  const toggleQuickPick = (brandName: string) => {
    setBrands(prev =>
      prev.map(brand =>
        brand.name === brandName ? { ...brand, selected: !brand.selected } : brand
      )
    );
  };

  const toggleCondition = (cond: string) => {
    setCondition(prev =>
      prev.includes(cond)
        ? prev.filter(c => c !== cond)
        : [...prev, cond]
    );
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFinish = async () => {
    // Kullanıcı tercihlerini kaydet
    const preferences = {
      selectedBrands: brands.filter(b => b.selected).map(b => b.id),
      newArrivals: {
        enabled: newArrivalsEnabled,
        frequency: newArrivalsFrequency,
        scope: newArrivalsScope,
      },
      priceAlerts: {
        enabled: priceAlertsEnabled,
        minPrice,
        maxPrice,
        condition,
        onlyFullSet,
      },
      notificationsEnabled,
    };

    await AsyncStorage.setItem("user_preferences", JSON.stringify(preferences));
    await AsyncStorage.setItem("onboarding_completed", "true");
    
    // Ana sayfaya yönlendir
    router.replace("/(tabs)/feed");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0D1118" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            height: 4,
            backgroundColor: "#374151",
            borderRadius: 2,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              height: 4,
              backgroundColor: "#9",
              borderRadius: 2,
              width: "30%",
            }}
          />
        </View>
        <Text style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center" }}>
          Do not know this pagee
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Marka Seçimi Bölümü */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            Choose brands you're into
          </Text>
          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 16,
              marginBottom: 20,
            }}
          >
            We'll tailor New Arrivals and Alerts.
          </Text>

          {/* Arama */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1F2430",
              borderRadius: 12,
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={{
                flex: 1,
                color: "white",
                fontSize: 16,
                paddingVertical: 12,
                paddingLeft: 12,
              }}
              placeholder="Search brands..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Hızlı Seçimler */}
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 12,
            }}
          >
            Quick Picks
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            style={{ marginBottom: 24 }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              {QUICK_PICKS.map((brandName) => {
                const isSelected = brands.find(b => b.name === brandName)?.selected;
                return (
                  <TouchableOpacity
                    key={brandName}
                    onPress={() => toggleQuickPick(brandName)}
                    style={{
                      backgroundColor: isSelected ? "#4C3BD733" : "#1F2430",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? "white" : "#9CA3AF",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {brandName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Marka Grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {filteredBrands.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                onPress={() => toggleBrand(brand.id)}
                style={{
                  width: (width - 72) / 3,
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    backgroundColor: "#1F2430",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: brand.selected ? 2 : 0,
                    borderColor: "#",
                    marginBottom: 8,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      overflow: "hidden",
                      backgroundColor: "#2A2A2A",
                    }}
                  >
                    <Image
                      source={brand.image}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="cover"
                    />
                  </View>
                  {brand.selected && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: "#4C3BD733",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    color: brand.selected ? "#4C3BD733" : "#9CA3AF",
                    fontSize: 12,
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            You can change this anytime in Profile.
          </Text>
        </View>

        {/* Bildirim Ayarları Bölümü */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            Set your default alerts
          </Text>
          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 16,
              marginBottom: 24,
            }}
          >
            You'll get notified for new listings and price changes.
          </Text>

          {/* Yeni Gelenler */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              New Arrivals
            </Text>

            {/* Bildirimler Açma/Kapama */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Notifications</Text>
              <Switch
                value={newArrivalsEnabled}
                onValueChange={setNewArrivalsEnabled}
                trackColor={{ false: "#374151", true: "#4C3BD733" }}
                thumbColor={newArrivalsEnabled ? "white" : "#9CA3AF"}
              />
            </View>

            {/* Sıklık Seçimi */}
            <Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
              Frequency
            </Text>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#1F2430",
                borderRadius: 8,
                padding: 4,
                marginBottom: 16,
              }}
            >
              {["instant", "daily", "weekly"].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setNewArrivalsFrequency(freq)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 6,
                    backgroundColor:
                      newArrivalsFrequency === freq ? "#4C3BD733" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: newArrivalsFrequency === freq ? "white" : "#9CA3AF",
                      fontSize: 14,
                      textAlign: "center",
                      textTransform: "capitalize",
                    }}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Marka Kapsamı */}
            <Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
              Brand scope
            </Text>
            <View style={{ marginBottom: 16 }}>
              {[
                { value: "followed", label: "Followed brands only" },
                { value: "all", label: "All brands" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setNewArrivalsScope(option.value)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: "#4C3BD733",
                      marginRight: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {newArrivalsScope === option.value && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#4C3BD733",
                        }}
                      />
                    )}
                  </View>
                  <Text style={{ color: "white", fontSize: 14 }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#1F2430",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#4C3BD733", fontSize: 14 }}>
                Nearby only
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fiyat Uyarıları */}
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              Price Alerts
            </Text>

            {/* Bildirimler Açma/Kapama */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Notifications</Text>
              <Switch
                value={priceAlertsEnabled}
                onValueChange={setPriceAlertsEnabled}
                trackColor={{ false: "#374151", true: "#4C3BD733" }}
                thumbColor={priceAlertsEnabled ? "white" : "#9CA3AF"}
              />
            </View>

            {/* Fiyat Aralığı */}
            <Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
              Price range
            </Text>
            <View
              style={{
                backgroundColor: "#1F2430",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "white", fontSize: 14, marginBottom: 12 }}>
                ${Math.round(minPrice * 500)}K-${Math.round(maxPrice * 500)}K
              </Text>
              
              {/* Range Slider Container */}
              <View style={{ position: "relative", height: 20, marginBottom: 12 }}>
                {/* Track Background */}
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: "#374151",
                    borderRadius: 2,
                  }}
                />
                
                {/* Active Track */}
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    left: `${minPrice}%`,
                    width: `${maxPrice - minPrice}%`,
                    height: 4,
                    backgroundColor: "#4C3BD733",
                    borderRadius: 2,
                  }}
                />
                
                {/* Min Thumb */}
                <View
                  {...minPanResponder.panHandlers}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${minPrice}%`,
                    width: 20,
                    height: 20,
                    backgroundColor: "white",
                    borderRadius: 10,
                    marginLeft: -10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    transform: [{ scale: isDraggingMin ? 1.2 : 1 }],
                  }}
                />
                
                {/* Max Thumb */}
                <View
                  {...maxPanResponder.panHandlers}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${maxPrice}%`,
                    width: 20,
                    height: 20,
                    backgroundColor: "white",
                    borderRadius: 10,
                    marginLeft: -10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    transform: [{ scale: isDraggingMax ? 1.2 : 1 }],
                  }}
                />
              </View>
              
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#9CA3AF", fontSize: 12 }}>$0</Text>
                <Text style={{ color: "#9CA3AF", fontSize: 12 }}>$50K+</Text>
              </View>
            </View>

            {/* Durum Seçimi */}
            <Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
              Condition
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {["new", "excellent", "very good"].map((cond) => (
                <TouchableOpacity
                  key={cond}
                  onPress={() => toggleCondition(cond)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor: condition.includes(cond)
                      ? "#4C3BD733"
                      : "#1F2430",
                    borderWidth: 1,
                    borderColor: condition.includes(cond)
                      ? "#4C3BD733"
                      : "#374151",
                  }}
                >
                  <Text
                    style={{
                      color: condition.includes(cond) ? "white" : "#9CA3AF",
                      fontSize: 12,
                      textTransform: "capitalize",
                    }}
                  >
                    {cond}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Only Full Set */}
            <TouchableOpacity
              onPress={() => setOnlyFullSet(!onlyFullSet)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: "#4C3BD733",
                  marginRight: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: onlyFullSet ? "#4C3BD733" : "transparent",
                }}
              >
                {onlyFullSet && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </View>
              <Text style={{ color: "white", fontSize: 14 }}>
                Only Full Set
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            You can change notifications anytime in Settings.
          </Text>
        </View>

      </ScrollView>

      {/* Alt Kısım */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#0D1118",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Bildirimleri Aç */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: "#4C3BD733",
              marginRight: 12,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: notificationsEnabled ? "#4C3BD733" : "transparent",
            }}
          >
            {notificationsEnabled && (
              <Ionicons name="checkmark" size={12} color="white" />
            )}
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 14, flex: 1 }}>
            Turn on notifications to get alerts
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#4C3BD733",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              Enable
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alt Butonlar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <Text style={{ color: "#9CA3AF", fontSize: 16 }}>
              Skip for now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFinish}
            style={{
              backgroundColor: "#4C3BD733",
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Finish Setup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

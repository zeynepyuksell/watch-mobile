import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const DONE_KEY = "onboarding_done";

const SCREEN = [
  {
    id: "1",
    title: "The private network for\nverified watch dealers.",
    subtitle:
      "Invite-only marketplace with identity-checked sellers and masked prices for observers.",
    image: require("../assets/mock-images/placeholder-watch.jpg"),
    chips: [],
  },
  {
    id: "2",
    title: "Discover rare pieces\nand make direct offers.",
    subtitle:
      "Follow brands, save listings, and negotiate in chat with secure timelines.",
    image: require("../assets/mock-images/6d3e765287ec5a0be10cd7da11095208d072b118.jpg"),
    chips: ["Save", "Messages", "Offers"],
  },
  {
    id: "3",
    title: "List faster with AI.\nTrade with escrow.",
    subtitle:
      "AI autofills details from photos. Use secure escrow, tracking, and inspection before release.",
    image: require("../assets/mock-images/8753d5be2b6dfd63a8122b8bd4a80abe9e8d2590.jpg"),
    chips: ["AI Autofill", "Escrow & Tracking"],
  },
];

export default function Onboarding() {
  const pagerRef = React.useRef<PagerView>(null);
  const [index, setIndex] = React.useState(0);
  const last = index === SCREEN.length - 1;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Responsive boyutlar
  const imageSize = Math.min(screenWidth - 40, screenHeight * 0.4);
  const paddingHorizontal = Math.max(20, screenWidth * 0.05);
  const paddingTop = Math.max(12, insets.top + 8);

  const complete = async () => {
    await AsyncStorage.setItem(DONE_KEY, "1");
    router.replace("/signin");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0D1118",
        paddingTop: paddingTop,
      }}
    >
      <TouchableOpacity
        onPress={complete}
        style={{ 
          alignSelf: "flex-end", 
          padding: 8,
          paddingRight: paddingHorizontal,
          paddingTop: 8
        }}
      >
        <Text style={{ color: "#9AA5FF" }}>Skip</Text>
      </TouchableOpacity>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setIndex(e.nativeEvent.position)}
      >
        {SCREEN.map((s) => (
          <ScrollView 
            key={s.id} 
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              flexGrow: 1,
              alignItems: "center",
              paddingHorizontal: paddingHorizontal,
              paddingBottom: 20
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: 18,
                overflow: "hidden",
                marginTop: 20,
                marginBottom: 20
              }}
            >
              <Image
                source={s.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <Text
              style={{
                color: "white",
                fontSize: Math.min(24, screenWidth * 0.06),
                fontWeight: "700",
                textAlign: "center",
                width: "100%",
                marginTop: 20,
                lineHeight: Math.min(32, screenWidth * 0.08),
                paddingHorizontal: 10
              }}
            >
              {s.title}
            </Text>
            <Text
              style={{
                color: "#A1A1AA",
                fontSize: Math.min(14, screenWidth * 0.035),
                lineHeight: Math.min(20, screenWidth * 0.05),
                marginTop: 12,
                width: "100%",
                textAlign: "center",
                paddingHorizontal: 10
              }}
            >
              {s.subtitle}
            </Text>

            {/* İsteğe bağlı chips */}
            {s.chips?.length ? (
              <View style={{ 
                flexDirection: "row", 
                gap: Math.min(20, screenWidth * 0.05), 
                marginTop: 18,
                flexWrap: "wrap",
                justifyContent: "center"
              }}>
                {s.chips.map((c) => {
                  let iconName = "";
                  let iconColor = "#A78BFA";
                  
                  // Icon mapping
                  if (c === "Save") {
                    iconName = "heart";
                  } else if (c === "Messages") {
                    iconName = "chatbubble";
                  } else if (c === "Offers") {
                    iconName = "pricetag";
                  } else if (c === "AI Autofill") {
                    iconName = "sparkles";
                    iconColor = "#7C4DFF";
                  } else if (c === "Escrow & Tracking") {
                    iconName = "shield-checkmark";
                    iconColor = "#7C4DFF";
                  }
                  
                  return (
                    <View key={c} style={{ alignItems: "center", marginBottom: 10 }}>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: "#1F2430",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {iconName ? (
                          <Ionicons name={iconName as any} size={18} color={iconColor} />
                        ) : null}
                      </View>
                      <Text
                        style={{ color: "#9CA3AF", fontSize: 12, marginTop: 6 }}
                      >
                        {c}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {/* Dots */}
            <View style={{ 
              flexDirection: "row", 
              gap: 6, 
              marginTop: 18,
              marginBottom: 20
            }}>
              {SCREEN.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: i === index ? "#A78BFA" : "#374151",
                  }}
                />
              ))}
            </View>
          </ScrollView>
        ))}
      </PagerView>

      {/* Next/Get Started Button */}
      <TouchableOpacity
        onPress={() => {
          if (last) {
            complete();
          } else {
            pagerRef.current?.setPage(index + 1);
          }
        }}
        style={{
          marginBottom: Math.max(24, insets.bottom + 16),
          marginHorizontal: paddingHorizontal,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#7C4DFF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
          {last ? "Get Started" : "Next  ›"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

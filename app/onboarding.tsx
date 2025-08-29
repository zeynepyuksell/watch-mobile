import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

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

const DONE_KEY = "onboarding_done";

export default function Onboarding() {
  const pagerRef = React.useRef<PagerView>(null);
  const [index, setIndex] = React.useState(0);
  const last = index === SCREEN.length - 1;

  const complete = async () => {
    await AsyncStorage.setItem(DONE_KEY, "1");
    router.replace("/(tabs)/feed");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0D1118",
        paddingHorizontal: 20,
        paddingTop: 12,
      }}
    >
      <TouchableOpacity
        onPress={complete}
        style={{ alignSelf: "flex-end", padding: 8 }}
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
          <View key={s.id} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: W - 80,
                height: W - 80,
                borderRadius: 18,
                overflow: "hidden",
                paddingTop: 32,
                paddingBottom: 32
              }}
            >
              <Image
                source={s.image}
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "700",
                textAlign: "center",
                width: "100%",
                marginTop: 28,
                lineHeight: 32
              }}
            >
              {s.title}
            </Text>
            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 14,
                lineHeight: 20,
                marginTop: 12,
                width: "100%",
              }}
            >
              {s.subtitle}
            </Text>

            {/* İsteğe bağlı chips */}
            {s.chips?.length ? (
              <View style={{ flexDirection: "row", gap: 20, marginTop: 18 }}>
                {s.chips.map((c) => (
                  <View key={c} style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "#1F2430",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                    <Text
                      style={{ color: "#9CA3AF", fontSize: 12, marginTop: 6 }}
                    >
                      {c}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Dots */}
            <View style={{ flexDirection: "row", gap: 6, marginTop: 18 }}>
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
          </View>
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
          marginBottom: 24,
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

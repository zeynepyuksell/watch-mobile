import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SignIn() {
  const [isEmail, setIsEmail] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const paddingHorizontal = Math.max(20, screenWidth * 0.05);
  const paddingTop = Math.max(12, insets.top + 8);

  const handleSignIn = () => {
    // Geçici giriş - backend olmadığı için doğrulama sayfasına yönlendir
    router.push("/verify-code");
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password
    console.log("Forgot password");
  };

  const handleInviteCode = () => {
    // Navigate to invite code
    console.log("Invite code");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0D1118" }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingHorizontal: paddingHorizontal,
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Title Section */}
        <View style={{ 
          alignItems: "center", 
          marginTop: paddingTop + 40,
          marginBottom: 40
        }}>
          {/* Watchcage Text */}
          <Text style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
            marginTop: 16,
            marginBottom: 8
          }}>
            Watchcage
          </Text>
        </View>

        {/* Sign In Title */}
        <Text style={{
          color: "white",
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 32,
          textAlign: "left"
        }}>
          Giriş yap
        </Text>

        {/* Toggle: Phone vs Email */}
        <View style={{
          flexDirection: "row",
          backgroundColor: "#1F2430",
          borderRadius: 12,
          padding: 4,
          marginBottom: 32
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: !isEmail ? "#7C4DFF" : "transparent",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center"
            }}
            onPress={() => setIsEmail(false)}
          >
            <Text style={{
              color: !isEmail ? "white" : "#9CA3AF",
              fontWeight: "600",
              fontSize: 16
            }}>
              Telefon
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: isEmail ? "#7C4DFF" : "transparent",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center"
            }}
            onPress={() => setIsEmail(true)}
          >
            <Text style={{
              color: isEmail ? "white" : "#9CA3AF",
              fontWeight: "600",
              fontSize: 16
            }}>
              Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        {isEmail ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              color: "#9CA3AF",
              fontSize: 14,
              marginBottom: 8,
              fontWeight: "500"
            }}>
              Email adresi
            </Text>
            <View style={{
              backgroundColor: "#1F2430",
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 16
            }}>
              <Ionicons name="mail" size={20} color="#6B7280" style={{ marginRight: 12 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email adresinizi giriniz"
                placeholderTextColor="#6B7280"
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: 16
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              color: "#9CA3AF",
              fontSize: 14,
              marginBottom: 8,
              fontWeight: "500"
            }}>
              Telefon numarası
            </Text>
            <View style={{
              backgroundColor: "#1F2430",
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 16
            }}>
              <View style={{
                backgroundColor: "#374151",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 12
              }}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>+90</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="telefon numaranızı giriniz"
                placeholderTextColor="#6B7280"
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: 16
                }}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        )}

        {/* Password Field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            color: "#9CA3AF",
            fontSize: 14,
            marginBottom: 8,
            fontWeight: "500"
          }}>
            Şifre
          </Text>
          <View style={{
            backgroundColor: "#1F2430",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 16
          }}>
            <Ionicons name="lock-closed" size={20} color="#6B7280" style={{ marginRight: 12 }} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Şifrenizi giriniz"
              placeholderTextColor="#6B7280"
              style={{
                flex: 1,
                color: "white",
                fontSize: 16
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity 
          onPress={handleForgotPassword}
          style={{ alignSelf: "flex-end", marginBottom: 32 }}
        >
          <Text style={{ color: "#A78BFA", fontSize: 14, fontWeight: "500" }}>
            Şifrenizi mi unuttunuz?
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          style={{
            height: 56,
            borderRadius: 28,
            overflow: "hidden",
            marginBottom: 32
          }}
        >
          <LinearGradient
            colors={["#7C4DFF", "#A78BFA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
              Giriş Yap
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Skip Login Button */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/feed")}
          style={{
            height: 48,
            borderRadius: 24,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#374151",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <Text style={{ color: "#9CA3AF", fontWeight: "600", fontSize: 16 }}>
            Giriş yapmadan devam et
          </Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text style={{
            color: "#6B7280",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
            marginBottom: 16
          }}>
            
          </Text>
          
          <TouchableOpacity onPress={handleInviteCode}>
            <Text style={{ color: "#A78BFA", fontSize: 14, fontWeight: "500" }}>
              Bir invite kodunuz var mı?
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push("/register")}
            style={{ marginTop: 16 }}
          >
            <Text style={{ color: "#A78BFA", fontSize: 16, fontWeight: "600" }}>
              Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

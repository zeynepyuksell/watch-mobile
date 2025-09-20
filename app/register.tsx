import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, useWindowDimensions, Modal, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getCities, City } from "./data/mockData";

// 👇 PROP TÜRLERİNİ TANIMLAYIN
// Eğer InputField başka dosyadaysa, bu tanımı o dosyanın başına ekleyebilirsiniz.
interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  error?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  onTogglePasswordVisibility?: () => void;
}

// 👇 InputField bileşenini Register bileşeninin dışına taşıyın
const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    icon, 
    keyboardType = "default",
    secureTextEntry = false,
    showPasswordToggle = false,
    error,
    rightIcon,
    onRightIconPress,
    onTogglePasswordVisibility // Yeni eklenen prop
  }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        color: "#9CA3AF",
        fontSize: 14,
        marginBottom: 8,
        fontWeight: "500"
      }}>
        {label}
      </Text>
      <View style={{
        backgroundColor: "#1F2430",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: error ? 1 : 0,
        borderColor: error ? "#EF4444" : "transparent"
      }}
      pointerEvents="box-none"
      >
        <Ionicons name={icon as any} size={20} color="#6B7280" style={{ marginRight: 12 }} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          style={{
            flex: 1,
            color: "white",
            fontSize: 16
          }}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePasswordVisibility}>
            <Ionicons 
              name={secureTextEntry ? "eye-off" : "eye"} 
              size={20} 
              color="#6B7280" 
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Ionicons name={rightIcon as any} size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );

// -------------------------------------------------------------------

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    storeName: "",
    city: "",
    phone: "",
    email: "",
    inviteCode: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cities, setCities] = useState<City[]>([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const paddingHorizontal = Math.max(20, screenWidth * 0.05);
  const paddingTop = Math.max(12, insets.top + 8);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const citiesData = await getCities();
      setCities(citiesData);
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "İsim soyisim gerekli";
    }
    
    if (!formData.storeName.trim()) {
      newErrors.storeName = "Mağaza adı gerekli";
    }
    
    if (!selectedCity) {
      newErrors.city = "Şehir gerekli";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası gerekli";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "E-mail adresi gerekli";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Lütfen geçerli bir e-posta adresi girin";
    }
    
    if (!formData.inviteCode.trim()) {
      newErrors.inviteCode = "Davet kodu gerekli";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Şifre gerekli";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalı";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      console.log("Register data:", { ...formData, city: selectedCity });
      router.push("/verify-code");
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setShowCityModal(false);
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: "" }));
    }
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        {/* Header */}
        <View style={{ 
          alignItems: "center", 
          marginTop: paddingTop + 20,
          marginBottom: 32
        }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16
          }}>
            <View style={{
              width: 24,
              height: 24,
              backgroundColor: "#7C4DFF",
              borderRadius: 4,
              marginRight: 8
            }} />
            <View style={{
              width: 24,
              height: 24,
              backgroundColor: "#A78BFA",
              borderRadius: 4
            }} />
          </View>
          <Text style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600"
          }}>
            Watchcage
          </Text>
        </View>

        {/* Title */}
        <Text style={{
          color: "white",
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 8,
          textAlign: "left"
        }}>
          Kayıt Ol
        </Text>
        
        <Text style={{
          color: "#9CA3AF",
          fontSize: 16,
          marginBottom: 32,
          lineHeight: 22
        }}>
          Watchcage'e erişmek için gerekli bilgileri doldurun
        </Text>

        {/* Form Fields */}
        <InputField
          label="İsim Soyisim"
          placeholder="İsim soyisminizi giriniz"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange("fullName", text)}
          icon="person-outline"
          error={errors.fullName}
        />

        <InputField
          label="Mağaza Adı"
          placeholder="Mağaza adınızı giriniz"
          value={formData.storeName}
          onChangeText={(text) => handleInputChange("storeName", text)}
          icon="storefront-outline"
          error={errors.storeName}
        />

        {/* City Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            color: "#9CA3AF",
            fontSize: 14,
            marginBottom: 8,
            fontWeight: "500"
          }}>
            Şehir
          </Text>
          <TouchableOpacity
            onPress={() => setShowCityModal(true)}
            style={{
              backgroundColor: "#1F2430",
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderWidth: errors.city ? 1 : 0,
              borderColor: errors.city ? "#EF4444" : "transparent"
            }}
          >
            <Ionicons name="location-outline" size={20} color="#6B7280" style={{ marginRight: 12 }} />
            <Text style={{
              flex: 1,
              color: selectedCity ? "white" : "#6B7280",
              fontSize: 16
            }}>
              {selectedCity ? selectedCity.name : "Şehrinizi seçiniz"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
          {errors.city && (
            <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
              {errors.city}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{
            color: "#9CA3AF",
            fontSize: 14,
            marginBottom: 8,
            fontWeight: "500"
          }}>
            Telefon
          </Text>
          <View style={{
            backgroundColor: "#1F2430",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: errors.phone ? 1 : 0,
            borderColor: errors.phone ? "#EF4444" : "transparent"
          }}>
            <Ionicons name="call-outline" size={20} color="#6B7280" style={{ marginRight: 12 }} />
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
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Telefon numaranızı giriniz"
              placeholderTextColor="#6B7280"
              style={{
                flex: 1,
                color: "white",
                fontSize: 16
              }}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>
          {errors.phone && (
            <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
              {errors.phone}
            </Text>
          )}
        </View>

        <InputField
          label="E-mail"
          placeholder="E-mail adresinizi giriniz"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          icon="mail-outline"
          keyboardType="email-address"
          error={errors.email}
        />

        <InputField
          label="Davet Kodu"
          placeholder="Davet kodunuzu giriniz"
          value={formData.inviteCode}
          onChangeText={(text) => handleInputChange("inviteCode", text)}
          icon="gift-outline"
          error={errors.inviteCode}
        />

        <InputField
          label="Şifre Oluştur"
          placeholder="Şifrenizi oluşturun"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          icon="lock-closed-outline"
          secureTextEntry={!showPassword}
          showPasswordToggle={true}
          onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        {/* Info Text */}
        <View style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 32,
          paddingHorizontal: 4
        }}>
          <Ionicons name="information-circle-outline" size={16} color="#6B7280" style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={{
            color: "#6B7280",
            fontSize: 14,
            lineHeight: 20,
            flex: 1
          }}>
            Tüm bayiler incelenir. Doğru iş bilgileri gönderin.
          </Text>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          style={{
            height: 56,
            borderRadius: 28,
            overflow: "hidden",
            marginBottom: 24
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
              Kayıt Ol
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Back to Sign In */}
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ alignItems: "center", marginBottom: 20 }}
        >
          <Text style={{ color: "#9CA3AF", fontSize: 16, fontWeight: "500" }}>
            Giriş Sayfasına Dön
          </Text>
        </TouchableOpacity>

        {/* Bottom Line */}
        <View style={{
          height: 1,
          backgroundColor: "#374151",
          width: 40,
          alignSelf: "center"
        }} />
      </ScrollView>

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: "#0D1118" }}>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: insets.top + 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#374151"
          }}>
            <Text style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600"
            }}>
              Şehir Seçiniz
            </Text>
            <TouchableOpacity onPress={() => setShowCityModal(false)}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={cities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCitySelect(item)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#1F2430",
                  backgroundColor: selectedCity?.id === item.id ? "#1F2430" : "transparent"
                }}
              >
                <Text style={{
                  color: selectedCity?.id === item.id ? "#7C4DFF" : "white",
                  fontSize: 16,
                  fontWeight: selectedCity?.id === item.id ? "600" : "400"
                }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>
    </View>
  );
}
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

// OtpInput bileşenini dışarı taşıdık
const OtpInput = ({ value, onChangeText, onKeyPress, index, inputRefs }: {
  value: string;
  onChangeText: (text: string) => void;
  onKeyPress: (key: string) => void;
  index: number;
  inputRefs: React.MutableRefObject<TextInput[]>;
}) => (
  <TextInput
    ref={(ref) => {
      if (ref) inputRefs.current[index] = ref;
    }}
    value={value}
    onChangeText={onChangeText}
    onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key)}
    style={{
      width: 60,
      height: 60,
      backgroundColor: "#1F2430",
      borderRadius: 12,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "600",
      color: "white",
      borderWidth: 1,
      borderColor: value ? "#7C4DFF" : "#374151",
    }}
    keyboardType="numeric"
    maxLength={1}
    selectTextOnFocus={true}
    autoFocus={index === 0}
    editable={true}
    onFocus={() => {}}
    onBlur={() => {}}
  />
);

export default function VerifyCode() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const paddingHorizontal = Math.max(20, screenWidth * 0.05);
  const paddingTop = Math.max(12, insets.top + 8);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleOtpChange = (value: string, index: number) => {
    // Sadece sayı kabul et
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      console.log("Verification code:", otpCode);
      // Doğrulama sonrası kullanıcı tercihleri ekranına yönlendir
      router.replace("/user-preferences");
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setResendCountdown(30);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleCancel = () => {
    router.back();
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#0D1118" }}>
      <View style={{
        flex: 1,
        paddingHorizontal: paddingHorizontal,
        paddingTop: paddingTop,
        justifyContent: "center",
        alignItems: "center"
      }}>
        {/* Logo */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24
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

        {/* Title */}
        <Text style={{
          color: "white",
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 12,
          textAlign: "center"
        }}>
          Kimliğinizi Doğrulayın
        </Text>

        {/* Subtitle */}
        <Text style={{
          color: "#9CA3AF",
          fontSize: 16,
          textAlign: "center",
          lineHeight: 22,
          marginBottom: 40,
          paddingHorizontal: 20
        }}>
          E-posta/cihazınıza gönderilen doğrulama kodunu girin
        </Text>

        {/* OTP Input Fields */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 40,
          width: "100%",
          maxWidth: 280
        }}>
          {otp.map((digit, index) => (
            <OtpInput
              key={index}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(key) => handleKeyPress(key, index)}
              index={index}
              inputRefs={inputRefs}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          style={{
            width: "100%",
            maxWidth: 280,
            height: 56,
            borderRadius: 28,
            overflow: "hidden",
            marginBottom: 24,
            opacity: otp.join("").length === 4 ? 1 : 0.5
          }}
          disabled={otp.join("").length !== 4}
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
              Doğrula
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          {!canResend ? (
            <Text style={{
              color: "#6B7280",
              fontSize: 14,
              marginBottom: 8
            }}>
              Yeniden gönder {resendCountdown}s
            </Text>
          ) : null}
          
          <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
            <Text style={{
              color: canResend ? "#7C4DFF" : "#6B7280",
              fontSize: 14,
              fontWeight: "500",
              textDecorationLine: "underline"
            }}>
              Kodu Yeniden Gönder
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={handleCancel}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "auto",
            marginBottom: 40
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#7C4DFF" style={{ marginRight: 4 }} />
          <Text style={{
            color: "#7C4DFF",
            fontSize: 16,
            fontWeight: "500"
          }}>
            İptal
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

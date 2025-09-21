import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditPhone() {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mevcut telefon numarasını yükle
    AsyncStorage.getItem('user_profile').then(profileData => {
      if (profileData) {
        const profile = JSON.parse(profileData);
        setPhoneNumber(profile.phone || '');
      }
    });
  }, []);

  const handleSave = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Hata', 'Lütfen telefon numarası giriniz.');
      return;
    }

    // Basit telefon numarası validasyonu
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      // Profil verisini güncelle
      const profileData = await AsyncStorage.getItem('user_profile');
      const profile = profileData ? JSON.parse(profileData) : {};
      
      profile.phone = phoneNumber;
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      
      Alert.alert('Başarılı', 'Telefon numaranız güncellendi.', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Telefon numarası güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Sadece sayıları al
    const numbers = text.replace(/\D/g, '');
    
    // Türkiye formatı için
    if (numbers.startsWith('90')) {
      return `+90 ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 10)} ${numbers.slice(10)}`;
    }
    
    // Diğer ülkeler için
    if (numbers.length > 0) {
      return `+${numbers}`;
    }
    
    return text;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0D1118' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#374151'
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Edit Phone</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 32 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
          Update Phone Number
        </Text>
        <Text style={{ color: '#9CA3AF', fontSize: 16, marginBottom: 32 }}>
          Enter your new phone number. We'll send you a verification code.
        </Text>

        {/* Phone Input */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 8 }}>Phone Number</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1F2430',
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#374151'
          }}>
            <Ionicons name="call-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                paddingVertical: 16,
                paddingLeft: 12
              }}
              placeholder="+90 555 123 45 67"
              placeholderTextColor="#6B7280"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
              keyboardType="phone-pad"
              autoFocus
            />
          </View>
        </View>

        {/* Info Card */}
        <View style={{
          backgroundColor: '#1F2430',
          borderRadius: 12,
          padding: 16,
          marginBottom: 32
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="information-circle" size={20} color="#4C3BD7" style={{ marginRight: 12, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
                Verification Required
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 18 }}>
                We'll send a verification code to your new phone number to confirm the change.
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading || !phoneNumber.trim()}
          style={{
            backgroundColor: phoneNumber.trim() ? '#4C3BD7' : '#374151',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Saving...</Text>
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

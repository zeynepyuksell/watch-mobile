import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditEmail() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mevcut email adresini yükle
    AsyncStorage.getItem('user_profile').then(profileData => {
      if (profileData) {
        const profile = JSON.parse(profileData);
        setEmail(profile.email || '');
      }
    });
  }, []);

  const handleSave = async () => {
    if (!email.trim()) {
      Alert.alert('Hata', 'Lütfen email adresi giriniz.');
      return;
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir email adresi giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      // Profil verisini güncelle
      const profileData = await AsyncStorage.getItem('user_profile');
      const profile = profileData ? JSON.parse(profileData) : {};
      
      profile.email = email;
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      
      Alert.alert('Başarılı', 'Email adresiniz güncellendi.', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Email adresi güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
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
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Edit Email</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 32 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
          Update Email Address
        </Text>
        <Text style={{ color: '#9CA3AF', fontSize: 16, marginBottom: 32 }}>
          Enter your new email address. We'll send you a verification link.
        </Text>

        {/* Email Input */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 8 }}>Email Address</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1F2430',
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#374151'
          }}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                paddingVertical: 16,
                paddingLeft: 12
              }}
              placeholder="your.email@example.com"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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
                We'll send a verification link to your new email address to confirm the change.
              </Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={{
          backgroundColor: '#1F2430',
          borderRadius: 12,
          padding: 16,
          marginBottom: 32
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" style={{ marginRight: 12, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
                Security Notice
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 18 }}>
                Changing your email will require you to verify your identity for security purposes.
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading || !email.trim()}
          style={{
            backgroundColor: email.trim() ? '#4C3BD7' : '#374151',
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

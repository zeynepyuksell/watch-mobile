import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    fullName: '',
    storeName: '',
    city: '',
    storeAddress: '',
    storeDescription: '',
    phoneNumber: '',
    email: '',
    language: 'English',
    currency: 'CHF (Swiss Franc)',
    profileImage: ''
  });
  
  const [notifications, setNotifications] = useState({
    messageAlerts: true,
    offers: true,
    priceAlerts: false
  });
  
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user_profile').then(v => v && setForm(JSON.parse(v)));
    AsyncStorage.getItem('user_notifications').then(v => v && setNotifications(JSON.parse(v)));
  }, []);

  // Focus listener to refresh form when returning from language selection
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('user_profile').then(v => v && setForm(JSON.parse(v)));
    }, [])
  );

  const pickImage = async () => {
    // İzin iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gereklidir.');
      return;
    }

    Alert.alert(
      'Fotoğraf Seç',
      'Fotoğrafı nereden seçmek istiyorsunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Galeri', onPress: () => openImagePicker('library') },
        { text: 'Kamera', onPress: () => openImagePicker('camera') }
      ]
    );
  };

  const openImagePicker = async (source: 'library' | 'camera') => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera erişim izni gereklidir.');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setForm({ ...form, profileImage: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
    }
  };

  const save = async () => {
    await AsyncStorage.setItem('user_profile', JSON.stringify(form));
    await AsyncStorage.setItem('user_notifications', JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SectionCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <View style={{ backgroundColor: '#242430', borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Ionicons name={icon as any} size={20} color="#9CA3AF" />
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const InfoItem = ({ label, value, icon, onPress, showArrow = false }: { 
    label: string; 
    value?: string; 
    icon?: string; 
    onPress?: () => void; 
    showArrow?: boolean;
  }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2430'
      }}
      disabled={!onPress}
    >
      {icon && <Ionicons name={icon as any} size={20} color="#9CA3AF" style={{ marginRight: 12 }} />}
      <View style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{label}</Text>
        {value && <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{value}</Text>}
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A24' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={save} style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20
        }}>
          <Ionicons name="checkmark" size={16} color="white" />
          <Text style={{ color: 'white', marginLeft: 6, fontWeight: '500' }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Profile Header */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
            <Image 
              source={{ 
                uri: form.profileImage || 'https://via.placeholder.com/120x120/FFD700/000000?text=Watch' 
              }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0, 
              backgroundColor: '#4C3BD733', 
              borderRadius: 12, 
              width: 24, 
              height: 24, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Ionicons name="checkmark" size={12} color="white" />
            </View>
            <View style={{
              position: 'absolute',
              bottom: -5,
              right: -5,
              backgroundColor: '#4C3BD733',
              borderRadius: 15,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#1A1A24'
            }}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginTop: 16 }}>{form.storeName || 'Luxe Timepieces'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="location-outline" size={16} color="#9CA3AF" />
            <Text style={{ color: '#9CA3AF', marginLeft: 4 }}>{form.city || 'Zurich, Switzerland'}</Text>
          </View>
          <Text style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
            {form.storeDescription || 'Specialized in rare and vintage luxury watches since 1998.'}
          </Text>
        </View>

        {/* Store Information */}
        <SectionCard title="Store Information" icon="business-outline">
          <InfoItem 
            label="Store Logo" 
            value="Last updated 15 Feb, 2023" 
            icon="time-outline"
          />
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 8 }}>Store Address</Text>
            <TextInput
              placeholder="Enter store address"
              placeholderTextColor="#6B7280"
              value={form.storeAddress}
              onChangeText={(t) => setForm({ ...form, storeAddress: t })}
              style={{ 
                color: 'white', 
                backgroundColor: '#1F2430', 
                borderRadius: 8, 
                padding: 12,
                fontSize: 14
              }}
              multiline
            />
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 8 }}>Store Description</Text>
            <TextInput
              placeholder="Describe your store"
              placeholderTextColor="#6B7280"
              value={form.storeDescription}
              onChangeText={(t) => setForm({ ...form, storeDescription: t })}
              style={{ 
                color: 'white', 
                backgroundColor: '#1F2430', 
                borderRadius: 8, 
                padding: 12,
                fontSize: 14,
                minHeight: 80
              }}
              multiline
            />
          </View>
        </SectionCard>

        {/* Identity & Licenses */}
        <SectionCard title="Identity & Licenses" icon="document-text-outline">
          <InfoItem 
            label="Business Registration" 
            icon="checkmark-circle" 
            showArrow={false}
          />
          <InfoItem 
            label="Tax Certificate" 
            icon="checkmark-circle" 
            showArrow={false}
          />
          <TouchableOpacity style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingVertical: 12,
            justifyContent: 'space-between'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>ID Verification</Text>
            </View>
            <TouchableOpacity style={{ 
              backgroundColor: '#4C3BD733', 
              paddingHorizontal: 12, 
              paddingVertical: 6, 
              borderRadius: 16 
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>Upload Document</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </SectionCard>

        {/* Account */}
        <SectionCard title="Account" icon="person-outline">
          <InfoItem 
            label="Phone Number" 
            value="+41 ••• ••• 5678" 
            icon="call-outline"
            onPress={() => Alert.alert('Edit Phone', 'Phone number editing functionality')}
            showArrow
          />
          <InfoItem 
            label="Email" 
            value="info@••••••••••.com" 
            icon="mail-outline"
            onPress={() => Alert.alert('Edit Email', 'Email editing functionality')}
            showArrow
          />
          <InfoItem 
            label="Change Password" 
            icon="key-outline"
            onPress={() => Alert.alert('Change Password', 'Password change functionality')}
            showArrow
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon="notifications-outline">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Message Alerts</Text>
            <Switch 
              value={notifications.messageAlerts} 
              onValueChange={(v) => setNotifications({ ...notifications, messageAlerts: v })}
              trackColor={{ false: '#374151', true: '#4C3BD733' }}
              thumbColor={notifications.messageAlerts ? '#4C3BD7' : '#9CA3AF'}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Offers</Text>
            <Switch 
              value={notifications.offers} 
              onValueChange={(v) => setNotifications({ ...notifications, offers: v })}
              trackColor={{ false: '#374151', true: '#4C3BD733' }}
              thumbColor={notifications.offers ? '#4C3BD7' : '#9CA3AF'}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Price Alerts</Text>
            <Switch 
              value={notifications.priceAlerts} 
              onValueChange={(v) => setNotifications({ ...notifications, priceAlerts: v })}
              trackColor={{ false: '#374151', true: '#4C3BD733' }}
              thumbColor={notifications.priceAlerts ? '#4C3BD7' : '#9CA3AF'}
            />
          </View>
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences" icon="ellipsis-horizontal-outline">
          <InfoItem 
            label="Language" 
            value={form.language} 
            icon="globe-outline"
            onPress={() => router.push('/profile/language-selection')}
            showArrow
          />
          <InfoItem 
            label="Currency" 
            value={form.currency} 
            icon="cash-outline"
            onPress={() => Alert.alert('Currency', 'Currency selection functionality')}
            showArrow
          />
        </SectionCard>

        {/* Save Button */}
        <TouchableOpacity 
          onPress={save} 
          style={{ 
            backgroundColor: saved ? '#10B981' : '#4C3BD733', 
            padding: 16, 
            borderRadius: 12, 
            marginTop: 24,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Ionicons name={saved ? "checkmark" : "save"} size={20} color="white" />
          <Text style={{ color: 'white', fontWeight: '600', marginLeft: 8 }}>
            {saved ? 'Saved Successfully!' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity 
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/signin') }
          ])}
          style={{ 
            padding: 16, 
            borderRadius: 12, 
            marginTop: 16,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
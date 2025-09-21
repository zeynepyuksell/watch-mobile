import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<{ 
    fullName?: string; 
    storeName?: string; 
    city?: string; 
    profileImage?: string;
    phone?: string;
    email?: string;
    isVerified?: boolean;
    isPremium?: boolean;
    storeAddress?: string;
    storeDescription?: string;
  }>({});

  useEffect(() => {
    loadProfile();
  }, []);

  // Focus listener to refresh profile when returning from edit screen
  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    const profileData = await AsyncStorage.getItem('user_profile');
    if (profileData) {
      setProfile(JSON.parse(profileData));
    } else {
      // Varsayılan veriler
      setProfile({
        fullName: 'Ahmet Yılmaz',
        storeName: 'Luxe Timepieces',
        city: 'Zurich, Switzerland',
        phone: '+41 ••• ••• 5678',
        email: 'info@••••••••••.com',
        isVerified: true,
        isPremium: true,
        storeAddress: 'Bahnhofstrasse 31, 8001 Zurich, Switzerland',
        storeDescription: 'Specialized in rare and vintage luxury watches since 1998.'
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            AsyncStorage.clear().then(() => {
              router.replace('/signin');
            });
          }
        }
      ]
    );
  };

  const ProfileCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <View style={{
      backgroundColor: '#1F2430',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Ionicons name={icon as any} size={20} color="#9CA3AF" />
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const InfoItem = ({ label, value, icon, onPress, showArrow = false, rightElement }: { 
    label: string; 
    value?: string; 
    icon?: string; 
    onPress?: () => void; 
    showArrow?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#374151'
      }}
      disabled={!onPress}
    >
      {icon && <Ionicons name={icon as any} size={20} color="#9CA3AF" style={{ marginRight: 12 }} />}
      <View style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{label}</Text>
        {value && <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{value}</Text>}
      </View>
      {rightElement || (showArrow && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />)}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0D1118' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Profile Header */}
        <View style={{ alignItems: 'center', marginTop: insets.top + 20, marginBottom: 32 }}>
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <Image 
              source={{ 
                uri: profile.profileImage || 'https://via.placeholder.com/120x120/FFD700/000000?text=Watch' 
              }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0, 
              backgroundColor: '#4C3BD7', 
              borderRadius: 12, 
              width: 24, 
              height: 24, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Ionicons name="checkmark" size={12} color="white" />
            </View>
          </View>
          
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
              {profile.storeName || 'Luxe Timepieces'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="location-outline" size={16} color="#9CA3AF" />
              <Text style={{ color: '#9CA3AF', marginLeft: 4 }}>{profile.city || 'Zurich, Switzerland'}</Text>
            </View>
            <Text style={{ color: '#9CA3AF', textAlign: 'center', lineHeight: 20, marginBottom: 16 }}>
              {profile.storeDescription || 'Specialized in rare and vintage luxury watches since 1998.'}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/profile/edit')}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: 'white',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={{ color: 'white', marginLeft: 6, fontWeight: '500' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Store Information */}
        <ProfileCard title="Store Information" icon="business-outline">
          <InfoItem 
            label="Store Logo" 
            value="Last updated 15 Feb, 2023" 
            icon="time-outline"
          />
          <InfoItem 
            label="Store Address" 
            value={profile.storeAddress || 'Bahnhofstrasse 31, 8001 Zurich, Switzerland'}
          />
          <InfoItem 
            label="Store Description" 
            value={profile.storeDescription || 'Family-owned since 1998, we specialize in rare and vintage luxury watches. All our timepieces are authenticated by certified experts with a comprehensive warranty and after-sales service.'}
          />
        </ProfileCard>

        {/* Identity & Licenses */}
        <ProfileCard title="Identity & Licenses" icon="card-outline">
          <InfoItem 
            label="Business Registration" 
            icon="checkmark-circle"
            rightElement={<Ionicons name="checkmark-circle" size={20} color="#4C3BD7" />}
          />
          <InfoItem 
            label="Tax Certificate" 
            icon="checkmark-circle"
            rightElement={<Ionicons name="checkmark-circle" size={20} color="#4C3BD7" />}
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
              backgroundColor: '#4C3BD7', 
              paddingHorizontal: 12, 
              paddingVertical: 6, 
              borderRadius: 16 
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>Upload Document</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ProfileCard>

        {/* Account */}
        <ProfileCard title="Account" icon="person-outline">
          <InfoItem 
            label="Phone Number" 
            value={profile.phone || '+41 ••• ••• 5678'} 
            icon="call-outline"
            onPress={() => router.push('/profile/edit-phone')}
            showArrow
          />
          <InfoItem 
            label="Email" 
            value={profile.email || 'info@••••••••••.com'} 
            icon="mail-outline"
            onPress={() => router.push('/profile/edit-email')}
            showArrow
          />
          <InfoItem 
            label="Change Password" 
            icon="key-outline"
            onPress={() => router.push('/profile/change-password')}
            showArrow
          />
        </ProfileCard>

        {/* Notifications */}
        <ProfileCard title="Notifications" icon="notifications-outline">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Message Alerts</Text>
            <View style={{
              width: 44,
              height: 24,
              backgroundColor: '#4C3BD7',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 2
            }}>
              <View style={{
                width: 20,
                height: 20,
                backgroundColor: 'white',
                borderRadius: 10
              }} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Offers</Text>
            <View style={{
              width: 44,
              height: 24,
              backgroundColor: '#4C3BD7',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 2
            }}>
              <View style={{
                width: 20,
                height: 20,
                backgroundColor: 'white',
                borderRadius: 10
              }} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Price Alerts</Text>
            <View style={{
              width: 44,
              height: 24,
              backgroundColor: '#374151',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 2
            }}>
              <View style={{
                width: 20,
                height: 20,
                backgroundColor: '#9CA3AF',
                borderRadius: 10
              }} />
            </View>
          </View>
        </ProfileCard>

        {/* Preferences */}
        <ProfileCard title="Preferences" icon="ellipsis-horizontal-outline">
          <InfoItem 
            label="Language" 
            value="English" 
            icon="globe-outline"
            onPress={() => router.push('/profile/language-selection')}
            showArrow
          />
          <InfoItem 
            label="Currency" 
            value="CHF (Swiss Franc)" 
            icon="cash-outline"
            onPress={() => Alert.alert('Currency', 'Currency selection functionality')}
            showArrow
          />
        </ProfileCard>

        {/* Sign Out Button */}
        <TouchableOpacity 
          onPress={handleLogout}
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
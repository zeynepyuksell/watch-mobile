
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePassword() {
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    // Validasyonlar
    if (!currentPassword.trim()) {
      Alert.alert('Hata', 'Lütfen mevcut şifrenizi giriniz.');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Hata', 'Lütfen yeni şifrenizi giriniz.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Hata', 'Yeni şifre mevcut şifre ile aynı olamaz.');
      return;
    }

    setIsLoading(true);

    try {
      // Gerçek uygulamada burada API çağrısı yapılır
      // Şimdilik sadece AsyncStorage'a kaydediyoruz
      await AsyncStorage.setItem('user_password', newPassword);
      
      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi.', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = currentPassword.trim() && newPassword.trim() && confirmPassword.trim() && 
                     newPassword.length >= 6 && newPassword === confirmPassword && 
                     currentPassword !== newPassword;

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
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 32 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
          Change Password
        </Text>
        <Text style={{ color: '#9CA3AF', fontSize: 16, marginBottom: 32 }}>
          Enter your current password and choose a new one.
        </Text>

        {/* Current Password */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 8 }}>Current Password</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1F2430',
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#374151'
          }}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                paddingVertical: 16,
                paddingLeft: 12
              }}
              placeholder="Enter current password"
              placeholderTextColor="#6B7280"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              autoFocus
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Ionicons 
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 8 }}>New Password</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1F2430',
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#374151'
          }}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                paddingVertical: 16,
                paddingLeft: 12
              }}
              placeholder="Enter new password"
              placeholderTextColor="#6B7280"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons 
                name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 8 }}>Confirm New Password</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1F2430',
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: confirmPassword && newPassword !== confirmPassword ? '#EF4444' : '#374151'
          }}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                paddingVertical: 16,
                paddingLeft: 12
              }}
              placeholder="Confirm new password"
              placeholderTextColor="#6B7280"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>
          </View>
          {confirmPassword && newPassword !== confirmPassword && (
            <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
              Passwords do not match
            </Text>
          )}
        </View>

        {/* Password Requirements */}
        <View style={{
          backgroundColor: '#1F2430',
          borderRadius: 12,
          padding: 16,
          marginBottom: 32
        }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
            Password Requirements
          </Text>
          <View style={{ gap: 4 }}>
            <Text style={{ 
              color: newPassword.length >= 6 ? '#10B981' : '#9CA3AF', 
              fontSize: 12 
            }}>
              • At least 6 characters
            </Text>
            <Text style={{ 
              color: newPassword !== currentPassword ? '#10B981' : '#9CA3AF', 
              fontSize: 12 
            }}>
              • Different from current password
            </Text>
            <Text style={{ 
              color: newPassword === confirmPassword && confirmPassword ? '#10B981' : '#9CA3AF', 
              fontSize: 12 
            }}>
              • Passwords match
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading || !isFormValid}
          style={{
            backgroundColor: isFormValid ? '#4C3BD7' : '#374151',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Changing...</Text>
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

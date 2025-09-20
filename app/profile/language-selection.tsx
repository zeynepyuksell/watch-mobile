import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export default function LanguageSelection() {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    // Mevcut dili yükle
    AsyncStorage.getItem('user_profile').then(profileData => {
      if (profileData) {
        const profile = JSON.parse(profileData);
        if (profile.language) {
          // Dil kodunu bul
          const currentLang = LANGUAGES.find(lang => lang.name === profile.language);
          if (currentLang) {
            setSelectedLanguage(currentLang.code);
          }
        }
      }
    });
  }, []);

  const handleLanguageSelect = async (language: typeof LANGUAGES[0]) => {
    setSelectedLanguage(language.code);
    
    // Profil verisini güncelle
    const profileData = await AsyncStorage.getItem('user_profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      profile.language = language.name;
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
    } else {
      // Eğer profil verisi yoksa yeni oluştur
      await AsyncStorage.setItem('user_profile', JSON.stringify({ language: language.name }));
    }
    
    // Kısa bir gecikme sonra geri dön
    setTimeout(() => {
      router.back();
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Select your preferred language</Text>
        
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              selectedLanguage === language.code && styles.selectedLanguageItem
            ]}
            onPress={() => handleLanguageSelect(language)}
          >
            <View style={styles.languageInfo}>
              <Text style={[
                styles.languageName,
                selectedLanguage === language.code && styles.selectedLanguageName
              ]}>
                {language.nativeName}
              </Text>
              <Text style={[
                styles.languageEnglish,
                selectedLanguage === language.code && styles.selectedLanguageEnglish
              ]}>
                {language.name}
              </Text>
            </View>
            
            {selectedLanguage === language.code && (
              <Ionicons name="checkmark-circle" size={24} color="#4C3BD7" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A24',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#242430',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#242430',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedLanguageItem: {
    borderColor: '#4C3BD733',
    backgroundColor: '#4C3BD710',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: '#4C3BD7',
  },
  languageEnglish: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  selectedLanguageEnglish: {
    color: '#4C3BD7',
  },
});

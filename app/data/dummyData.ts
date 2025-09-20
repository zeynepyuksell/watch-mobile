// src/data/mockData.ts

export const userProfile = {
    storeName: "Luxe Timepieces",
    storeAddress: "Bahnhofstrasse 31, 8001 Zurich, Switzerland",
    storeDescription: "Specialized in rare and vintage luxury watches since 1998. Our timepieces are guaranteed with a comprehensive warranty and after-sales service.",
    lastUpdated: "15 Feb, 2023",
    profilePictureUrl: "https://example.com/profile-pic.jpg", // Örnek URL
    identity: {
      businessRegistration: true,
      taxCertificate: true,
      idVerification: false,
    },
    account: {
      phoneNumber: "+41 *** **** 5078",
      email: "info@***********.com",
    },
    preferences: {
      language: "en", // Varsayılan dil kodu
      currency: "USD", // Varsayılan para birimi
      messageAlerts: true,
      offers: false,
      priceAlerts: true,
    }
  };
  
  export const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];
  
  export const availableCurrencies = [
    { code: 'USD', name: 'USD ($)' },
    { code: 'EUR', name: 'EUR (€)' },
    { code: 'CHF', name: 'CHF (Fr.)' },
    { code: 'TRY', name: 'TRY (₺)' },
  ];
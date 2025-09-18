import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const englishTranslations = {
  translation: {
    // General
    "settings": "Settings",
    "general": "General",
    "appearance": "Appearance",
    "meditation": "Meditation",
    "privacy": "Privacy",
    "notifications": "Notifications",
    "accessibility": "Accessibility",
    "profile": "Profile",
    "advanced": "Advanced",
    "save_settings": "Save Settings",
    "export_settings": "Export Settings",
    "import_settings": "Import Settings",
    "reset_to_defaults": "Reset to Defaults",
    "general_settings": "General Settings",
    "manage_preferences": "Manage your general application preferences",
    "display_name": "Display Name",
    "email": "Email",
    "theme": "Theme",
    "language": "Language",
    "start_page": "Start Page",
    "select_theme": "Select theme",
    "select_language": "Select language",
    "select_start_page": "Select start page",
    "light": "Light",
    "dark": "Dark",
    "system": "System",
    "english": "English",
    "hindi": "Hindi",
    "dashboard": "Dashboard",
    "library": "Library",
    "sadhanas": "Sadhanas",
    "community": "Community",
    "enter_display_name": "Enter your display name",
    "enter_email": "Enter your email",
    
    // Settings page
    "settings_menu": "Settings Menu",
    "navigate_settings": "Navigate through different settings sections",
    "customize_experience": "Customize your SaadhanaBoard experience",
    "saving": "Saving...",
    "settings_saved_success": "Your settings have been successfully saved.",
    "save_failed": "Save Failed",
    "settings_save_error": "There was an error saving your settings. Please try again.",
    "settings_reset_success": "All settings have been reset to their default values.",
    "settings_export_success": "Your settings have been exported as a JSON file.",
    "settings_import_success": "Your settings have been successfully imported.",
    "import_failed": "Import Failed",
    "settings_import_error": "There was an error importing your settings. Please check the file format.",
    
    // Sidebar navigation
    "saadhana_board": "Saadhana Board",
    "your_yantras": "Your Yantras",
    "store": "Store",
    
    // Other common terms
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "close": "Close",
  }
};

// Hindi translations
const hindiTranslations = {
  translation: {
    // General
    "settings": "सेटिंग्स",
    "general": "सामान्य",
    "appearance": "उपस्थिति",
    "meditation": "ध्यान",
    "privacy": "गोपनीयता",
    "notifications": "सूचनाएं",
    "accessibility": "सुगमता",
    "profile": "प्रोफाइल",
    "advanced": "उन्नत",
    "save_settings": "सेटिंग्स सहेजें",
    "export_settings": "सेटिंग्स निर्यात करें",
    "import_settings": "सेटिंग्स आयात करें",
    "reset_to_defaults": "डिफ़ॉल्ट पर रीसेट करें",
    "general_settings": "सामान्य सेटिंग्स",
    "manage_preferences": "अपनी सामान्य एप्लिकेशन प्राथमिकताएं प्रबंधित करें",
    "display_name": "प्रदर्शन नाम",
    "email": "ईमेल",
    "theme": "थीम",
    "language": "भाषा",
    "start_page": "प्रारंभ पृष्ठ",
    "select_theme": "थीम चुनें",
    "select_language": "भाषा चुनें",
    "select_start_page": "प्रारंभ पृष्ठ चुनें",
    "light": "हल्का",
    "dark": "गहरा",
    "system": "सिस्टम",
    "english": "अंग्रेज़ी",
    "hindi": "हिंदी",
    "dashboard": "डैशबोर्ड",
    "library": "पुस्तकालय",
    "sadhanas": "साधनाएँ",
    "community": "समुदाय",
    "enter_display_name": "अपना प्रदर्शन नाम दर्ज करें",
    "enter_email": "अपना ईमेल दर्ज करें",
    
    // Settings page
    "settings_menu": "सेटिंग्स मेनू",
    "navigate_settings": "विभिन्न सेटिंग्स अनुभागों के माध्यम से नेविगेट करें",
    "customize_experience": "अपने SaadhanaBoard अनुभव को अनुकूलित करें",
    "saving": "सहेजा जा रहा है...",
    "settings_saved_success": "आपकी सेटिंग्स सफलतापूर्वक सहेजी गई हैं।",
    "save_failed": "सहेजने में विफल",
    "settings_save_error": "आपकी सेटिंग्स सहेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    "settings_reset_success": "सभी सेटिंग्स उनके डिफ़ॉल्ट मानों पर रीसेट कर दी गई हैं।",
    "settings_export_success": "आपकी सेटिंग्स को JSON फ़ाइल के रूप में निर्यात कर दिया गया है।",
    "settings_import_success": "आपकी सेटिंग्स सफलतापूर्वक आयात कर ली गई हैं।",
    "import_failed": "आयात विफल",
    "settings_import_error": "आपकी सेटिंग्स आयात करने में त्रुटि हुई। कृपया फ़ाइल प्रारूप की जाँच करें।",
    
    // Sidebar navigation
    "saadhana_board": "साधना बोर्ड",
    "your_yantras": "आपके यंत्र",
    "store": "स्टोर",
    
    // Other common terms
    "cancel": "रद्द करें",
    "save": "सहेजें",
    "edit": "संपादित करें",
    "close": "बंद करें",
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: englishTranslations,
      hi: hindiTranslations,
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
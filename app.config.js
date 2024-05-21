require('dotenv').config();

export default {
  expo: {
    name: "RunningSmash",
    slug: "RunningSmash",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    plugins: ["expo-router"],
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "This app uses your location to track your route."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID
        }
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};

import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import Navigation from "./navigation";
import { useAuthStore } from "./store/auth";
import "react-native-gesture-handler";
import { LoadingProvider, useLoading } from './store/LoadingContext';
import Loading from './components/loading';
import { NavigationContainer } from "@react-navigation/native";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#B8860B",
    onPrimary: "#252525",
    description: "#71727A",
    accent: "#7B5506",
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    titleLarge: {
      ...MD3DarkTheme.fonts.titleLarge,
      fontWeight: "bold",
    },
  },
  roundness: 4,
};

export default function App() {
  
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Poppins: require('./assets/fonts/Poppins/Poppins-Black.ttf'), // Font dosyasının yolu
      });
      setFontsLoaded(true);
    }
    
    // SplashScreen.hideAsync() kullanılmadan önce fontların yüklenmesini bekleyin
    async function prepare() {
      await loadFonts();
      await SplashScreen.hideAsync(); // SplashScreen'i gizle
    }

    prepare();
  }, []);

  const { fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUser()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size={80} color={theme.colors.primary} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  if (!fontsLoaded) {
    return null; // Fontlar yüklenene kadar bir şey döndürmeyin.
  }

  return (
    <LoadingProvider>
      <NavigationContainer>
        <Navigation />
        <LoadingOverlay /> {/* Loading bileşeni */}
      </NavigationContainer>
    </LoadingProvider>,

    <SafeAreaView style={styles.container}>
      <PaperProvider theme={theme}>
        <Navigation />
        <StatusBar style="light" backgroundColor="#252525" />
      </PaperProvider>
    </SafeAreaView>
  );
}

function LoadingOverlay() {
  const { loading } = useLoading();
  return loading ? <Loading /> : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252525",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252525",
  },
});
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import Navigation from './navigation'
import { useAuthStore } from './store/auth';
import 'react-native-gesture-handler'

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#B8860B',
    onPrimary: '#252525',
    description: "#71727A",
    accent: '#7B5506', 
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    titleLarge: {
      ...MD3DarkTheme.fonts.titleLarge,
      fontWeight: 'bold'
    }
  },
  roundness: 4,
}

export default function App() {
  const { fetchUser } = useAuthStore()
  
  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <PaperProvider theme={theme}>
        <Navigation />
        <StatusBar style='auto' />
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Navigation from './navigation'
import { useAuthStore } from './store/auth';
import 'react-native-gesture-handler'

export default function App() {
  const { fetchUser } = useAuthStore()
  
  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider>
        <Navigation />
        <StatusBar style='auto' />
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

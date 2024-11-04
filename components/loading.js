// components/Loading.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import loadingAnimation from '../data/loading.json';

export default function Loading() {
  return (
    <View style={styles.container}>
      <LottieView 
        source={loadingAnimation} 
        autoPlay 
        loop 
        style={styles.animation} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  animation: {
    width: 150,
    height: 150,
  },
});
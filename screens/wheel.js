import React from 'react';
import { SafeAreaView, View } from 'react-native';
import WheelOfFortune from '../components/wheel';

const BonusWheel = () => {
  const options = {
    rewards: ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5'],
    colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#0033A8'],
    duration: 4000, // Spin duration in milliseconds
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#252525' }}>
      <WheelOfFortune options={options} />
    </View>
  );
};

export default BonusWheel;

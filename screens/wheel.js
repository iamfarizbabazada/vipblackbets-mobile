import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import WheelOfFortune from '../components/wheel';
import api from '../lib/api'

const BonusWheel = () => {
  const [winner, setWinner] = useState(null)
  const [history, setHistory] = useState([])
  const [lastBonus, setLastBonus] = useState(null)

  const options = {
    rewards: ['2%', '3%', '4%', '5%', '1%', '10%'],
    colors: ['#262626', '#C79236', '#262626', '#C79236', '#262626', '#C79236'],
    duration: 4000, // Spin duration in milliseconds
  };

  useEffect(() => {
    api.get('/profile/history/bonus').then(res => setHistory(res.data))
    api.get('/profile/bonus/aviable').then(res => setLastBonus(res.data))
  }, [winner])

  const handleWinnerIndex = async () => {
    const res = await api.post('/profile/spin').catch(console.error)
    setWinner(res.data.bonus)
    return res.data.bonus
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#252525' }}>
      <WheelOfFortune winner={winner} options={options} getWinnerIndex={handleWinnerIndex} history={history} isAviable={lastBonus} />
    </View>
  );
};

export default BonusWheel;

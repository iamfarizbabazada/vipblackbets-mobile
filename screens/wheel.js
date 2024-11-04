import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import WheelOfFortune from '../components/wheel';
import api from '../lib/api'

const BonusWheel = () => {
  const [winner, setWinner] = useState(null); // Kazanan bonusu kaydeder
  const [history, setHistory] = useState([]); // Bonus geçmişini kaydeder
  const [lastBonus, setLastBonus] = useState(null); // Son kazanç durumunu kaydeder
  const [isSpinnable, setIsSpinnable] = useState(true); // Çarkın döndürülebilirliğini kontrol eder

  // Çark seçenekleri ve renk ayarları
  const options = {
    rewards: ['2%', '3%', '4%', '5%', '1%', '10%'], // Kazanılabilecek bonus oranları
    colors: ['#262626', '#C79236', '#262626', '#C79236', '#262626', '#C79236'], // Segment renkleri
    duration: 4000, // Spin süresi (milisaniye cinsinden)
  };

  // Çarkın geçmiş ve mevcut bonus durumunu almak için API çağrısı
  useEffect(() => {
    // Bonus geçmişini getir
    api.get('/profile/history/bonus').then(res => setHistory(res.data));
    // Mevcut bonus durumunu getir
    api.get('/profile/bonus/aviable').then(res => setLastBonus(res.data));
  }, [winner]); // Winner değiştikçe çağrıyı günceller

  // Çarkın kazanan segmentini belirleyen fonksiyon
  const handleWinnerIndex = async () => {
    // Çark döndürme butonu 1 dakika devre dışı bırakılacak
    if (!isSpinnable) {
      console.log("Çark sadece 1 dakikada bir çevrilebilir");
      return null; // Çark spin yapılamazsa null döndür
    }

    setIsSpinnable(false); // Çarkı döndürdükten sonra devre dışı bırakır

    // API'ye istek gönder ve kazanan bonusu al
    const res = await api.post('/profile/spin').catch(console.error);
    setWinner(res.data.bonus); // Kazanan bonusu kaydeder

    // Çarkı tekrar döndürebilmek için 1 dakika bekler
    setTimeout(() => setIsSpinnable(true), 60000);

    return res.data.bonus; // Kazanan bonusu döndürür
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#252525' }}>
      {/* Çarkı ekrana render eder ve gerekli parametreleri iletir */}
      <WheelOfFortune
        winner={winner}
        options={options}
        getWinnerIndex={handleWinnerIndex}
        history={history}
        isAviable={lastBonus}
      />
    </View>
  );
};

export default BonusWheel;
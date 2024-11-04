import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import Svg, { G, Path, Circle, Text as TextSvg } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import fireworkAnimation from '../data/fireworks.json';
import giftAnimation from '../data/gift.json';
import bgImage from '../assets/images/vbb-wheel-bg.png'; // Arkaplan görüntüsü
import knobImage from '../assets/images/knob.png'; // Dönen çarkın düğmesi
import { Button } from '../components/button';
import moment from 'moment';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('screen');

// Animasyonlu SVG bileşenleri
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WheelOfFortune = ({ options, getWinnerIndex, history, isAviable }) => {
  const [isSpinning, setIsSpinning] = useState(false); // Çarkın dönme durumu
  const [winner, setWinner] = useState(null); // Kazanan ödül
  const [showResult, setShowResult] = useState(false); // Sonuç ekranının görünürlüğü
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Butonun devre dışı durumu
  const angle = useRef(new Animated.Value(0)).current; // Çarkın dönme açısı
  const flashOpacity = useRef(new Animated.Value(1)).current; // Yanıp sönen ışıkların opaklığı
  const theme = useTheme();

  const numberOfSegments = options.rewards.length;
  const angleBySegment = 360 / numberOfSegments;
  const segmentCenterAngle = angleBySegment / 2;

  // Düğme pozisyonu
  const knobRadius = (width / 2) - 25; // Düğmenin konumlandırılma yarıçapı
  const knobX = Math.sin((segmentCenterAngle * Math.PI) / 180) * knobRadius;
  const knobY = -Math.cos((segmentCenterAngle * Math.PI) / 180) * knobRadius;

  // Yanıp sönen ışıkların animasyonu
  useEffect(() => {
    const flashLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    flashLoop.start();
  }, []);

  // Çarkın segmentlerini oluşturur
  const wheelPath = () => {
    const data = Array.from({ length: numberOfSegments }).fill(1);
    const arcs = d3Shape.pie()(data);
    const colors = options.colors || [
      '#262626', '#E8C22E', '#262626', '#4F991D',
      '#262626', '#5858D0', '#262626', '#D843B9',
    ];

    return arcs.map((arc, index) => {
      const arcGenerator = d3Shape
        .arc()
        .outerRadius(width / 2 - 20)
        .innerRadius(40);
        
      return {
        path: arcGenerator(arc),
        color: colors[index % colors.length],
        value: options.rewards[index],
      };
    });
  };

  // Çark döndürme işlemi
  const handleSpin = async () => {
    if (isSpinning || isButtonDisabled) return;
    setIsSpinning(true);
    setIsButtonDisabled(true); // Düğmeyi devre dışı bırak

    // 1 dakika sonra düğmeyi yeniden aktif et
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 10000);

    const spinDuration = options.duration || 4000;
    const randomWinnerIndex = await getWinnerIndex();
    const toValue = 360 * 3 + randomWinnerIndex * angleBySegment;

    Animated.timing(angle, {
      toValue,
      duration: spinDuration,
      useNativeDriver: true,
    }).start(() => {
      setWinner(options.rewards[randomWinnerIndex]);
      setIsSpinning(false);
      setShowResult(true);
      angle.setValue(0); // Çarkı sıfır açısına getir
    });
  };

  // Çark SVG'sini oluşturur
  const renderWheel = () => {
    const wheelSegments = wheelPath();
    const radius = 200;
    const segmentAngle = 360 / wheelSegments.length;
  
    return (
      <Svg width={500} height={500} viewBox="-400 -400 800 800">
        <AnimatedG
          style={{
            transform: [
              {
                rotate: angle.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
          originX={0}
          originY={0}
        >
          {wheelSegments.map((segment, index) => {
            const rotationAngle = index * segmentAngle;
            const textX = Math.sin((rotationAngle + segmentAngle / 2) * (Math.PI / 180)) * (radius / 1.5);
            const textY = Math.cos((rotationAngle + segmentAngle / 2) * (Math.PI / 180)) * (radius / 1.5);
  
            return (
              <G key={index}>
                <Path
                  d={segment.path}
                  fill={segment.color}
                  opacity={0.4}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <TextSvg
                  x={textX}
                  y={textY}
                  stroke="#fff"
                  strokeWidth={1}
                  fontSize={28}
                  fill="#fff"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="central"
                  transform={`rotate(${rotationAngle + segmentAngle / 2} ${textX} ${textY})`}
                >
                  {segment.value}
                </TextSvg>
              </G>
            );
          })}
        </AnimatedG>
  
        {/* Çarkın etrafında yanıp sönen ışıklar */}
        {[...Array(10).keys()].map((i) => (
          <AnimatedCircle
            key={i}
            cx={Math.cos((i / 10) * 2 * Math.PI) * (radius - 10)}
            cy={Math.sin((i / 10) * 2 * Math.PI) * (radius - 10)}
            r={10}
            fill="#B8860B"
            opacity={flashOpacity}
          />
        ))}
      </Svg>
    );
  };

  // Tarih öğelerini listelemek için kullanılan render işlevi
  const renderHistoryItem = ({ item }) => {
    return (
      <View style={{ padding: 10, borderWidth: 0.2, borderColor: theme.colors.primary, marginVertical: 10, borderRadius: 4 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {options.rewards[item.bonus]}
          </Text>
          <Text style={{ color: theme.colors.accent }}>
            {moment(item.createdAt).add(24, 'hours').format('DD.MM.YYYY - HH:mm')}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wheelContainer}>
        {renderWheel()}
        <Image source={bgImage} style={styles.bg} />
        <Image source={knobImage} style={styles.knob} />
      </View>

      {/* Çarkı Fırlat butonu */}
      <Button mode="contained" onPress={handleSpin} disabled={isButtonDisabled}>
        <Text style={styles.buttonText}>{isSpinning ? '...' : 'Çarxı Fırlat!'}</Text>
      </Button>

      <FlatList 
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 20 }}
        data={history}
        renderItem={renderHistoryItem}
      />

      {/* Sonuç gösterimi için modal */}
      <Modal visible={showResult} transparent={false} animationType="slide">
        <View style={styles.resultContainer}>
          <LottieView source={fireworkAnimation} autoPlay loop={true} style={styles.fireworks} />
          <LottieView source={giftAnimation} autoPlay loop={true} style={styles.gift} />
          <Text style={styles.winnerText}>Bonus: {options.rewards[winner]}</Text>
          <Button onPress={() => setShowResult(false)} mode="contained">
            <Text style={styles.closeButtonText}>Bağla</Text>
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wheelContainer: {
    width: width - 40,
    height: width - 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
    top: '10%',
    width: 300,
    height: 300,
    zIndex: -1,
    resizeMode: 'contain',
  },
  knob: {
    position: 'absolute',
    top: '10%',
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  winnerText: {
    marginTop: 20,
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fireworks: {
    width: 300,
    height: 300,
  },
  gift: {
    width: 200,
    height: 200,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WheelOfFortune;
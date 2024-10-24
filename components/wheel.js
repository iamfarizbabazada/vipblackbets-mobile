import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('screen');

const WheelOfFortune = ({ options }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const angle = useRef(new Animated.Value(0)).current;

  const numberOfSegments = options.rewards.length;
  const angleBySegment = 360 / numberOfSegments;

  const wheelPath = () => {
    const data = Array.from({ length: numberOfSegments }).fill(1);
    const arcs = d3Shape.pie()(data);
    const colors = options.colors || [
      '#E07026', '#E8C22E', '#ABC937', '#4F991D',
      '#22AFD3', '#5858D0', '#7B48C8', '#D843B9',
    ];

    return arcs.map((arc, index) => {
      const arcGenerator = d3Shape
        .arc()
        .outerRadius(width / 2 - 20)
        .innerRadius(50);
      return {
        path: arcGenerator(arc),
        color: colors[index % colors.length],
        value: options.rewards[index],
      };
    });
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const spinDuration = options.duration || 4000;
    const randomWinnerIndex = Math.floor(Math.random() * numberOfSegments);
    const toValue = 360 * 3 + randomWinnerIndex * angleBySegment;

    Animated.timing(angle, {
      toValue,
      duration: spinDuration,
      useNativeDriver: false, // or true, depending on what works best
    }).start(() => {
      setWinner(options.rewards[randomWinnerIndex]);
      setIsSpinning(false);
      angle.setValue(0); // Reset angle for next spin
    });
  };

  const renderWheel = () => {
    const wheelSegments = wheelPath();
    return (
      <Svg width={400} height={400} viewBox="-400 -400 800 800">
        <G rotation={angle} originX={0} originY={0}>
          {wheelSegments.map((segment, index) => (
            <Path
              key={index}
              d={segment.path}
              fill={segment.color}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </G>
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wheelContainer}>
        {renderWheel()}
      </View>
      <TouchableOpacity onPress={handleSpin} style={styles.button}>
        <Text style={styles.buttonText}>{isSpinning ? 'Spinning...' : 'Spin!'}</Text>
      </TouchableOpacity>
      {winner && <Text style={styles.winnerText}>Winner: {winner}</Text>}
    </SafeAreaView>
  );
};

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
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  winnerText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WheelOfFortune;

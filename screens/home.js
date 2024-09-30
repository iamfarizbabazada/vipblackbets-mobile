// FootballList.js
import React, { useEffect, useState } from 'react';
import { View, FlatList,TouchableOpacity, Dimensions, StyleSheet, Image, ScrollView } from 'react-native';
import {Button} from '../components/button'
import apiFootbal from '../lib/footbal';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Text, Divider } from 'react-native-paper';
import { Video } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('screen')

const FootballList = () => {
  const [leagues, setLeagues] = useState([]);
  const theme = useTheme()

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await apiFootbal.get('/leagues?season=2022&last=10'); // Replace with your leagues API
        console.log(response.data)
        setLeagues(response.data.response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeagues();
  }, []);
  const navigation = useNavigation();

  const renderLeague = ({ item }) => (
    <TouchableOpacity
      style={{padding: 10, height: 150, backgroundColor: theme.colors.accent, borderRadius: 25}}
      onPress={() => navigation.navigate('LeagueDetails', { league: item.league })}
    >
      <Image source={{ uri: item.league.logo }} style={styles.leagueLogo} />
      <Text style={{color: '#ffffff'}}>{item.league.name}</Text>
      <Image source={{ uri: item.country.flag }} style={styles.countryFlag} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
      <View  style={{height: 270, marginBottom: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Ionicons name='radio-outline' color={theme.colors.primary} size={16} />
        <Text variant='titleMedium' style={{color: theme.colors.primary, marginVertical: 10}}>Canlı</Text>
        </View>
      <YoutubePlayer
        height={300}
        videoId={'0BKuQGHM6RE'}  // Replace with your video ID
      />
      </View>

      <View style={{marginBottom: 40}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      <Ionicons name='earth' color={theme.colors.primary} size={16} />
      <Text variant='titleMedium' style={{color: theme.colors.primary, marginVertical: 10, marginTop: 5}}>Ligalar</Text>
      </View>
      <FlatList
        data={leagues}
        contentContainerStyle={{gap: 15}}
        renderItem={renderLeague}
        keyExtractor={(item) => item.league.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      </View>

      <View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      <Ionicons name='list-outline' color={theme.colors.primary} size={16} />
      <Text variant='titleMedium' style={{color: theme.colors.primary, marginVertical: 10, marginTop: 5}}>Təxminlər</Text>
      </View>
      <FlatList
        data={Array.from(leagues).reverse()}
        contentContainerStyle={{gap: 15}}
        renderItem={renderLeague}
        keyExtractor={(item) => item.league.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    padding: 10,
    gap: 20
  },
  leagueButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  leagueLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  leagueName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countryFlag: {
    width: 30,
    height: 20,
    marginTop: 5,
  },
});

export default FootballList;

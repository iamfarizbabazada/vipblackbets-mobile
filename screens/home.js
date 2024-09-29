// FootballList.js
import React, { useEffect, useState } from 'react';
import { View, FlatList,TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import {Button} from '../components/button'
import apiFootbal from '../lib/footbal';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Text } from 'react-native-paper';
import { Video } from 'expo-av';

const { width } = Dimensions.get('screen')

const FootballList = () => {
  const [leagues, setLeagues] = useState([]);
  const theme = useTheme()

  const videos = [
    {
      uri: "https://videos.pexels.com/video-files/9969035/9969035-hd_1080_1920_25fps.mp4",
      id: 1
    },
    {
      uri: "https://videos.pexels.com/video-files/9969035/9969035-hd_1080_1920_25fps.mp4",
      id: 2
    },
    {
      uri: "https://videos.pexels.com/video-files/9969035/9969035-hd_1080_1920_25fps.mp4",
      id: 3
    },
  ]

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await apiFootbal.get('/leagues?season=2022'); // Replace with your leagues API
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
      style={{padding: 10, backgroundColor: theme.colors.accent, borderRadius: 25}}
      onPress={() => navigation.navigate('LeagueDetails', { league: item.league })}
    >
      <Image source={{ uri: item.league.logo }} style={styles.leagueLogo} />
      <Text style={{color: '#ffffff'}}>{item.league.name}</Text>
      <Image source={{ uri: item.country.flag }} style={styles.countryFlag} />
    </TouchableOpacity>
  );

  const renderLiveVideo = ({ item }) => (
    <View>
      <Video style={{width: width - 20, height: 250}} useNativeControls source={{uri: item.uri}} />
    </View>
  )

  const renderLiveVideo2 = ({ item }) => (
    <View>
      <Video style={{width: width / 2, height: 200}} source={{uri: item.uri}} />
    </View>
  )

  return (
    <View style={styles.container}>
      <View >
      <FlatList 
      data={videos}
      contentContainerStyle={{gap: 15}}
      renderItem={renderLiveVideo}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      />
      </View>
      
      <View>
      <Text variant='titleLarge' style={{color: theme.colors.primary, marginBottom: 15}}>Canlı Yayımlar</Text>

      <FlatList 
      data={videos}
      contentContainerStyle={{gap: 15}}
      renderItem={renderLiveVideo2}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      />
      </View>

      <View>
      <Text variant='titleLarge' style={{color: theme.colors.primary, marginBottom: 15}}>Ligalar</Text>
      <FlatList
        data={leagues}
        contentContainerStyle={{gap: 15}}
        renderItem={renderLeague}
        keyExtractor={(item) => item.league.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      </View>
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

import React, { useState } from "react";
import {
	View,
	FlatList,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	Image,
	ScrollView,
	TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("screen");

const leagues = [
	{ id: 1, name: "La Liqa", logo: "https://e7.pngegg.com/pngimages/40/1023/png-clipart-2017-18-la-liga-atletico-madrid-spain-real-madrid-c-f-fc-barcelona-fc-barcelona-text-sport-thumbnail.png" },
	{ id: 2, name: "Premiyer Liqa", logo: "https://b.fssta.com/uploads/application/soccer/competition-logos/EnglishPremierLeague.png" },
	{ id: 3, name: "Bundesliga", logo: "https://yt3.googleusercontent.com/tSIDFFQZKkmb3H0uNxXbtOo5W_vbckp3xb1JGBwRx0uGgi9ex-rRdTJgvrQ6xcCI5zYshzIv=s900-c-k-c0x00ffffff-no-rj" },
	{ id: 4, name: "Italiya A Seriyası", logo: "https://icdn.football-italia.net/wp-content/uploads/2022/06/Lega-Serie-A-Logo-2022-23.jpg" },
];

const predictions = [
	{ id: 1, home: "Barcelona", homeScore: 4, away: "Real Madrid", awayScore: 2 },
	{ id: 2, home: "Bavaria", homeScore: 4, away: "Liverpool", awayScore: 2 },
];

const categoriesSport = [
	{ name: 'Futbol', icon: 'football' },
	{ name: 'Tenis', icon: 'tennisball' },
	{ name: 'Beyzbol', icon: 'american-football' },
	{ name: 'Basketbol', icon: 'basketball' },
	{ name: 'Ping Pong', icon: 'tennisball-outline' },
	{ name: 'Bilyard', icon: 'ellipse' },
	{ name: 'Şahmat', icon: 'ellipse' },
	
];

// Bileşenleri Ayrı Fonksiyonlar Halinde Tanımlama
const LeagueCard = ({ item }) => (
	<TouchableOpacity style={styles.leagueCard}>
		<Image source={{ uri: item.logo }} style={styles.leagueLogo} />
		<Text style={styles.leagueName}>{item.name}</Text>
	</TouchableOpacity>
);

const PredictionCard = ({ item }) => (
	<View style={styles.predictionCard}>
		<View style={styles.teamInfo}>
			<Text style={styles.teamName}>{item.home}</Text>
			<View style={styles.teamScore}>
				<Text style={styles.scoreText}>{item.homeScore}</Text>
			</View>
		</View>
		<View style={styles.teamInfo}>
			<View style={styles.teamScore}>
				<Text style={styles.scoreText}>{item.awayScore}</Text>
			</View>
			<Text style={styles.teamName}>{item.away}</Text>
		</View>
	</View>
);

const SportsCategories = ({ activeCategory, setActiveCategory }) => (
	<View style={styles.containerSport}>
		{categoriesSport.map((category) => (
			<TouchableOpacity
				key={category.name}
				style={[
					styles.categoryButtonSport,
					activeCategory === category.name && styles.activeCategoryButtonSport,
				]}
				onPress={() => setActiveCategory(category.name)}
			>
				<View style={styles.activeCategoryButton} >
				<Ionicons
					name={category.icon}
					size={24}
					color={activeCategory === category.name ? 'black' : '#fff'}
				/>
				{activeCategory === category.name && (
					<Text style={styles.categoryTextSport}>{category.name}</Text>
				)}
				</View>
			</TouchableOpacity>
		))}
	</View>
);

const Home = () => {
	const [activeCategory, setActiveCategory] = useState('Futbol');

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.heroSection}>
					{/* Header Section */}
					<View style={styles.header}>
						<Text style={styles.greeting}>Salam, Fariz. Qazanmağa</Text>
						<Text style={styles.readyText}>Hazırsan?</Text>
					</View>

					{/* Search Bar */}
					<View style={styles.searchContainer}>
						<Ionicons name="search" color="#e5a00d" size={20} />
						<TextInput
							placeholder="Liqa və ya təxmin axtar.."
							placeholderTextColor="#e5a00d"
							style={styles.searchInput}
						/>
					</View>
				</View>

				{/* Sports Categories Section */}
				<SportsCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

				{/* Leagues Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons name="trophy" color="#B8860B" size={22} />
						<Text style={styles.sectionTitle}>Liqalar</Text>
					</View>
					<FlatList
						data={leagues}
						horizontal
						contentContainerStyle={styles.leagueList}
						renderItem={({ item }) => <LeagueCard item={item} />}
						keyExtractor={(item) => item.id.toString()}
						showsHorizontalScrollIndicator={false}
					/>
				</View>

				{/* Recent Predictions Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons name="checkbox-outline" color="#B8860B" size={22} />
						<Text style={styles.sectionTitle}>Son Təxminlər</Text>
					</View>
					<FlatList
						data={predictions}
						horizontal
						contentContainerStyle={styles.predictionList}
						renderItem={({ item }) => <PredictionCard item={item} />}
						keyExtractor={(item) => item.id.toString()}
						showsHorizontalScrollIndicator={false}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

// Stil Tanımlamaları
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1b1b1b",
	},
	heroSection: {
		backgroundColor: "#B8860B",
		borderBottomRightRadius: 50,
		borderBottomLeftRadius: 50,
		marginBottom: 20,
	},
	header: {
		paddingVertical: 20,
		padding: 20,
	},
	greeting: {
		color: "#252525",
		fontSize: 18,
		marginTop: 10,
	},
	readyText: {
		color: "#252525",
		fontSize: 42,
		fontWeight: "900",
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#252525",
		borderRadius: 50,
		padding: 15,
		marginTop: 0,
		marginBottom: 40,
		marginHorizontal: 20,
	},
	searchInput: {
		marginLeft: 10,
		color: "#e5a00d",
		opacity: 0.7,
		flex: 1,
	},
	section: {
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	sectionTitle: {
		paddingLeft: 10,
		color: "#B8860B",
		fontSize: 22,
		fontWeight: "900",
	},
	leagueList: {
		marginTop: 10,
		gap: 15,
	},
	leagueCard: {
		width: 100,
		height: 110,
		backgroundColor: "#252525",
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	leagueLogo: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginBottom: 5,
	},
	leagueName: {
		color: "#B8860B",
		fontSize: 12,
		textAlign: "center",
	},
	predictionList:{
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderTopLeftRadius: 15,
		borderBottomLeftRadius: 15,
		paddingVertical: 10

	},
	predictionCard: {
		width: 150,
		height: 80,
		backgroundColor: "#252525",
		borderRadius: 10,
		padding: 10,
		marginHorizontal: 5,
		justifyContent: "space-between",
	},
	teamInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	teamName: {
		color: "#B8860B",
		fontSize: 12,
	},
	teamScore: {
		backgroundColor: "#B8860B",
		borderRadius: 15,
		width: 28,
		height: 28,
		justifyContent: "center",
		alignItems: "center",
	},
	scoreText: {
		color: "#252525",
		fontSize: 12,
		fontWeight: "900",
	},
	containerSport: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#252525',
		borderTopLeftRadius: 15,
		borderBottomLeftRadius: 15,
		paddingVertical: 20,
		marginLeft: 20
	},
	categoryButtonSport: {
		alignItems: 'center',
		paddingVertical: 10,
	},
	activeCategoryButtonSport: {
		backgroundColor: '#e5a00d',
		borderRadius: 15,
		paddingHorizontal: 10,
	},
	categoryTextSport: {
		color: 'black',
		marginLeft: 5,
	},
	activeCategoryButton:{
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	}
});

export default Home;
import React, { useEffect, useState, useMemo } from "react";
import {
	View,
	Image,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import apiFootbal from "../lib/footbal";
import moment from "moment";
import { useRoute } from "@react-navigation/native";
import { useTheme, Text } from "react-native-paper";

const TeamInfo = ({ team }) => (
	<View style={styles.team}>
		<Image style={styles.teamLogo} source={{ uri: team.logo }} />
		<Text style={styles.teamName}>{team.name}</Text>
	</View>
);

const MatchDetail = () => {
	const route = useRoute();
	const selectedLeague = route?.params?.league || null; // Added fallback
	const theme = useTheme();
	const [matchData, setMatchData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (selectedLeague?.id) {
			const fetchMatchDetails = async () => {
				try {
					const response = await apiFootbal.get(
						`/fixtures?league=${selectedLeague.id}&season=2022`,
					);
					setMatchData(response.data.response);
				} catch (error) {
					console.error("Error fetching match details:", error);
					setError("Failed to load match details.");
				} finally {
					setLoading(false);
				}
			};

			fetchMatchDetails();
		} else {
			setLoading(false);
		}
	}, [selectedLeague]);

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	if (error) {
		return <Text>{error}</Text>;
	}

	if (!matchData.length || !selectedLeague) {
		return <Text>No match data available.</Text>;
	}

	return (
		<View>
			<ScrollView contentContainerStyle={styles.container}>
				{matchData.map(({ fixture, league, teams, goals, score }) => (
					<View
						key={fixture.id}
						style={{
							borderBottomColor: theme.colors.primary,
							marginBottom: 20,
							borderBottomWidth: 2,
							padding: 20,
						}}
					>
						{/* League Info */}
						<View style={styles.leagueInfo}>
							<Image style={styles.leagueLogo} source={{ uri: league.logo }} />
							<Text style={styles.leagueName}>
								{league.name} - {league.season}
							</Text>
						</View>

						{/* Match Status */}
						<Text style={styles.matchStatus}>{fixture.status.long}</Text>

						{/* Date and Venue */}
						<Text style={styles.matchDate}>
							{moment(fixture.date).format("MMMM Do YYYY, h:mm a")} (UTC)
						</Text>
						<Text style={styles.venue}>
							{fixture.venue.name}, {fixture.venue.city}
						</Text>

						{/* Team Info */}
						<View style={styles.teamInfo}>
							<TeamInfo team={teams.home} />
							<Text style={styles.vsText}>vs</Text>
							<TeamInfo team={teams.away} />
						</View>

						{/* Score */}
						<View style={styles.scoreContainer}>
							<Text style={styles.score}>
								{goals.home} - {goals.away}
							</Text>
						</View>

						{/* Halftime Score */}
						<Text style={styles.halftimeScore}>
							Halftime: {score.halftime.home} - {score.halftime.away}
						</Text>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: "#fff",
	},
	leagueInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	leagueLogo: {
		width: 40,
		height: 40,
		marginRight: 8,
	},
	leagueName: {
		fontSize: 18,
		fontWeight: "bold",
	},
	matchStatus: {
		fontSize: 20,
		color: "#28a745",
		textAlign: "center",
		marginBottom: 8,
	},
	matchDate: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 4,
	},
	venue: {
		fontSize: 14,
		textAlign: "center",
		color: "#666",
		marginBottom: 16,
	},
	teamInfo: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginBottom: 16,
	},
	team: {
		alignItems: "center",
	},
	teamLogo: {
		width: 80,
		height: 80,
		marginBottom: 8,
	},
	teamName: {
		fontSize: 18,
		fontWeight: "bold",
	},
	vsText: {
		fontSize: 24,
		fontWeight: "bold",
		marginHorizontal: 16,
	},
	scoreContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	score: {
		fontSize: 32,
		fontWeight: "bold",
	},
	halftimeScore: {
		fontSize: 16,
		textAlign: "center",
		color: "#666",
	},
});

export default MatchDetail;

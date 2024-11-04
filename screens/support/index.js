import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FAB, Text, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import api from "../../lib/api";

export default function SupportScreen() {
	const navigation = useNavigation();
	const theme = useTheme();
	const [requests, setRequests] = useState([]);

	const fetchRequests = async () => {
		try {
			const response = await api.get("profile/support");
			setRequests(response.data);
		} catch (error) {
			console.error("Talepler alınamadı:", error);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>Açıq Müraciətlər</Text>
			
			{/* Talepleri Listeleme */}
			<FlatList
				data={requests}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <Text>{item.message}</Text>}
				contentContainerStyle={styles.list}
			/>

			{/* Yeni Talep Oluştur Düğmesi */}
			<FAB
				icon={() => <Ionicons name="chatbox-ellipses-outline" size={24} color="#fff" />}
				label="Yeni Müraciət"
				style={[styles.fab2, { backgroundColor: theme.colors.accent }]}
				onPress={() => navigation.navigate("Chat", {})}
			/>

			{/* Telegram Desteğine Gitme Düğmesi */}
			<FAB
				icon={() => <Ionicons name="paper-plane" size={24} color="#fff" />}
				style={[styles.fab, { backgroundColor: "#1B92D1" }]}
				onPress={() => Linking.openURL("tg://resolve?domain=VBBKASSA")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#252525",
	},
	headerText: {
		color: "#fff",
		fontSize: 24,
		padding: 20,
	},
	list: {
		flexGrow: 1,
		paddingHorizontal: 20,
	},
	fab: {
		position: "absolute",
		right: 16,
		bottom: 90,
		borderRadius: 12,
	},
	fab2: {
		position: "absolute",
		right: 16,
		bottom: 20,
		borderRadius: 8,
	},
});
import { useEffect, useState } from "react";
import {
	View,
	Image,
	FlatList,
	StyleSheet,
	RefreshControl,
} from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import api from "../../lib/api";
import { Button } from "../../components/button";
import image1 from "../../assets/images/providers/1.png";
import image2 from "../../assets/images/providers/2.png";
import image3 from "../../assets/images/providers/3.png";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BalanceList() {
	const theme = useTheme();
	const [orders, setOrders] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const navigation = useNavigation();

	const transtus = {
		PENDING: "Gözləyir",
		COMPLETED: "Ödənildi",
		REJECTED: "Ləğv edildi",
	};

	const images = {
		MOSTBET: image1,
		MELBET: image2,
		"1XBET": image3,
	};

	const fetchOrders = async () => {
		setRefreshing(true);
		try {
			const res = await api.get("/profile/history/balance");
			setOrders(res.data);
		} catch (error) {
			console.error(error); // Handle the error appropriately
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const renderItem = ({ item }) => (
		<View style={[styles.card, { backgroundColor: "#282828" }]}>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text style={[styles.title, { color: theme.colors.primary }]}>
					{item.amount}₼
				</Text>
				<Text
					style={[styles.title, { color: theme.colors.accent, fontSize: 14 }]}
				>
					{item.paymentType}
				</Text>
			</View>

			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text
					style={[
						styles.description,
						{ color: theme.colors.accent, opacity: 0.5 },
					]}
				>
					{dayjs(item.createdAt).format("DD.MM.YYYY - HH:mm")}
				</Text>
				<Text style={[styles.description, { color: theme.colors.accent }]}>
					Status:{" "}
					<Text
						style={[
							styles.description,
							{ color: theme.colors.accent, fontWeight: "bold" },
						]}
					>
						{transtus[item.status]}
					</Text>
				</Text>
			</View>
		</View>
	);

	return (
		<View style={{ backgroundColor: "#252525", flex: 1 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 10,
					opacity: 0.5,
				}}
			>
				<Ionicons
					name="information-circle"
					color={theme.colors.accent}
					size={24}
				/>
				<Text
					variant="titleSmall"
					style={{ color: theme.colors.accent, fontWeight: "bold" }}
				>
					Məbləğ balansa 1-30 dəqiqə ərzində yüklənir!
				</Text>
			</View>
			<FlatList
				data={orders}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={[styles.list, { flexGrow: 1 }]} // flexGrow: 1 eklendi
				refreshing={refreshing}
				onRefresh={fetchOrders}
				ListEmptyComponent={
					<Text style={{ color: "white", textAlign: "center" }}>
						No orders found.
					</Text>
				} // Boş liste için gösterim
			/>
			<View
				style={{
					paddingVertical: 10,
					paddingHorizontal: 20,
					backgroundColor: "#282828",
				}}
			>
				<Button mode="contained" onPress={() => navigation.navigate("Support")}>
					Texniki Dəstək
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	list: {
		padding: 20,
		backgroundColor: "#252525",
	},
	card: {
		padding: 16,
		marginBottom: 12,
		borderRadius: 8,
		elevation: 2, // For Android shadow
		shadowColor: "#000", // For iOS shadow
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1,
		gap: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	description: {
		fontSize: 14,
	},
});

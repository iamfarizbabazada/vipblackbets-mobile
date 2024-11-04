import React, { useEffect, useState } from "react";
import {
	View,
	Image,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { useAuthStore } from "../../store/auth";
import { Feather } from "@expo/vector-icons";
import api from "../../lib/api";
import { Divider } from 'react-native-paper';
import supportScreen from "../supportScreen";

const menuItems = [
	{ name: "Balans", to: "Balance", icon: "dollar-sign" },
	{ name: "Çıxarış", to: "Withdraw", icon: "download" },
	{ name: "Deposit", to: "Deposit", icon: "upload" },
	{ name: "Bonus", to: "BonusWheel", icon: "percent" },
	{ name: "Tarixçə", to: "History", icon: "clock" },
	{ name: "Tənzimlə", to: "Settings", icon: "settings" },
	{ name: "Təxminlər", to: "Predictions", icon: "check-square" },
	{ name: "Haqqında", to: "About", icon: "help-circle" },
	{ name: "Canlı Dəstək", to: "supportScreen", icon: "message-square" },
	{ name: "Çıxış et", to: null, icon: "log-out" }, // Çıkış işlemi
];

const rewards = ["2%", "3%", "4%", "5%", "1%", "10%"];



export default function Profile() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { user, fetchUser, logout } = useAuthStore();
	const [bonus, setBonus] = useState(null);
	const [visible, setVisible] = useState(false);


	useEffect(() => {
		fetchUser();
		api.get("/profile/bonus/aviable").then((res) => setBonus(res.data.bonus));
	}, []);

	const showDialog = () => setVisible(true);
	const hideDialog = () => setVisible(false);

	const handleLogout = async () => {
		try {
			await logout();
			hideDialog();
		} catch (err) {
			console.error(err.response?.data);
		}
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.menuItem}
			onPress={() => (item.to ? navigation.navigate(item.to) : showDialog())}
		>
			<Feather name={item.icon} color={theme.colors.primary} size={18} />
			<Text variant="titleMedium" style={styles.menuItemText}>
				{item.name}
			</Text>
		</TouchableOpacity>
	);

	if (!user) return <View></View>;

	return (
		<View style={styles.container}>
			<View style={[styles.info, { backgroundColor: "#B8860B" }]}>
	<Image style={styles.avatar} source={{ uri: user.avatarURL }} />
	<View style={styles.userInfo}>
					<Text variant="titleLarge" style={styles.userName}>
						{user.name}
					</Text>
					<Text variant="bodySmall" style={styles.userEmail}>
						{user.email}
					</Text>
					<View style={styles.balanceContainer}>
						<View>
							<Text style={styles.balanceLabel}>Balans</Text>
							<Text style={styles.balanceValue}>{user.currentBalance} ₼</Text>
						</View>
						<View>
							<Text style={styles.balanceLabel}>Bonus</Text>
							<Text style={styles.balanceValue}>
								{bonus?.aviable ? rewards[bonus?.bonus] : "-"}
							</Text>
						</View>
					</View>
					</View>
					</View>

			<FlatList
				data={menuItems}
				renderItem={renderItem}
				style={styles.flatList}
				keyExtractor={(item, idx) => idx.toString()}
				numColumns={2}
				columnWrapperStyle={styles.columnWrapper}
				showsVerticalScrollIndicator={false}
			/>

			<Portal>
				<Dialog
					style={styles.dialog}
					visible={visible}
					onDismiss={hideDialog}
				>
					<Dialog.Title>Hesabdan Çıxış</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">
							Hesabınızdan çıxmaq istədiyinizə əminsinizmi?
						</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button textColor={theme.colors.accent} onPress={hideDialog}>
							Ləğv et
						</Button>
						<Button onPress={handleLogout}>Çıxış et</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		paddingTop: 50,
		backgroundColor: "#1e1e1e",
	},
	info: {
		flexDirection: "row",
		gap: 15,
		padding: 10,
		borderRadius: 16,
	},
	avatar: {
		borderRadius: 16,
		flex: 1,
		backgroundColor: "#252525",
		width: "60px",
		height: "60px",
		


	},
	userInfo: {
		flex: 1,
		gap: 8,
		marginVertical: 10,
	},
	userName: {
		color: "#252525",
	},
	userEmail: {
		color: "#252525",
	},
	balanceContainer: {
		flexDirection: "row",
		gap: 20,
		marginTop: 10,
		backgroundColor: "#252525",
		padding: 10,
		borderRadius: 8

	},
	
	balanceLabel: {
		color: "#7B5506", // Altın sarısı rengi
		fontSize: 14,
	},
	balanceValue: {
		color: "#B8860B",
		fontSize: 18,
		fontWeight: "bold",
	},
	menuItem: {
		backgroundColor: "#252525",
		flex: 1,
		margin: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 18,
		paddingHorizontal: 14,
		borderRadius: 8,
	},
	menuItemText: {
		color: "#B8860B",
		marginLeft: 10,
	},
	columnWrapper: {
		justifyContent: "space-between",
	},
	dialog: {
		backgroundColor: "#252525",
	},
	flatList: {
		marginTop: 50,
		marginBottom: 10,
	},
});
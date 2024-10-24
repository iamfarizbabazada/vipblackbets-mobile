import {
	View,
	Image,
	StyleSheet,
	Alert,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { useAuthStore } from "../../store/auth";
import { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { user, fetchUser, logout } = useAuthStore();

	const [visible, setVisible] = useState(false);

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

	// const menu = [
	//   { name: 'Hesab Məlumatları', to: 'UpdateProfile' },
	//   { name: 'Depozit Yüklə', to: 'OrderCreate' },
	//   { name: 'Ödəniş Tarixçəsi', to: 'OrderList' },
	//   { name: 'Şifrəni Yenilə', to: 'Security' },
	//   { name: 'Şərtlər & Qaydalar', to: 'Terms' },
	//   { name: 'Gizlilik Siyasəti', to: 'Privacy' },
	//   { name: 'Hesabdan Çıx', to: null } // Çıkış işlemi
	// ]

	const menu = [
		{ name: "Balans", to: "Balance", icon: "dollar-sign" },
		{ name: "Bonus", to: "BonusWheel", icon: "percent" },
		{ name: "Deposit", to: "Deposit", icon: "upload" },
		{ name: "Çıxarış", to: "Withdraw", icon: "download" },
		{ name: "Tarixçə", to: "History", icon: "clock" },
		{ name: "Tənzimlə", to: "Settings", icon: "settings" },
		{ name: "Haqqında", to: "About", icon: "help-circle" },
		{ name: "Çıxış et", to: null, icon: "log-out" }, // Çıkış işlemi
	];

	useEffect(() => {
		fetchUser();
	}, []);

	if (!user) return <View></View>;

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.menuItem}
			onPress={() => (item.to ? navigation.navigate(item.to) : showDialog())}
		>
			<Feather name={item.icon} color={theme.colors.primary} size={18} />
			<Text variant="titleMedium" style={{ color: theme.colors.primary }}>
				{item.name}
			</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<LinearGradient colors={["#B8860B", "#7B5506"]} style={styles.info}>
				<Image
					style={{ borderRadius: 16, flex: 1 }}
					source={{ uri: user.avatarURL }}
				/>
				<View style={{ flex: 1 }}>
					<View style={{ gap: 8, marginVertical: 10 }}>
						<Text variant="titleLarge" style={{ color: "#000" }}>
							{user.name}
						</Text>
						<Text variant="bodySmall" style={{ color: "#252525" }}>
							{user.email}
						</Text>
					</View>
					<View style={styles.balanceContainer}>
						<View>
							<Text style={{ color: theme.colors.accent }}>Balans</Text>
							<Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
								{user.currentBalance}₼
							</Text>
						</View>
						<View>
							<Text style={{ color: theme.colors.accent }}>Bonus</Text>
							<Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
								5%
							</Text>
						</View>
					</View>
				</View>
			</LinearGradient>

			<FlatList
				data={menu}
				renderItem={renderItem}
				style={{ marginTop: 50, marginBottom: 10 }}
				keyExtractor={(item, idx) => idx.toString()}
				numColumns={2} // İki sütunlu grid
				columnWrapperStyle={styles.columnWrapper} // Her satırdaki sütunlara stil vermek için
				showsVerticalScrollIndicator={false}
			/>

			<Portal>
				<Dialog
					style={{ backgroundColor: "#252525" }}
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
		padding: 20,
		paddingTop: 50,
		backgroundColor: "#252525",
	},
	info: {
		flexDirection: "row",
		gap: 15,
		padding: 10,
		borderRadius: 16,
	},
	balanceContainer: {
		padding: 10,
		flexDirection: "row",
		borderRadius: 10,
		gap: 20,
		backgroundColor: "#252525",
	},
	menuItem: {
		backgroundColor: "#282828",
		flex: 1, // FlatList'te eşit genişlik dağılımı için
		margin: 10,
		gap: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 18,
		paddingHorizontal: 14,
		borderRadius: 8,
	},
	columnWrapper: {
		justifyContent: "space-between", // Kolonlar arasında boşluk bırakmak için
	},
});

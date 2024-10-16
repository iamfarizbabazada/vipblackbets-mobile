import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Örnek olarak Ionicons kullanıyoruz
import { useNavigation } from "@react-navigation/native";
import { Text, useTheme } from "react-native-paper";

const menuData = [
	{ id: "1", name: "Şərtlər & Qaydalar", icon: "alert-triangle", to: "Terms" },
	{ id: "2", name: "Gizlilik Siyasəti", icon: "git-branch", to: "Privacy" },
];

const MenuItem = ({ item }) => {
	const navigation = useNavigation(); // Gezinme hook'u
	const theme = useTheme();

	return (
		<TouchableOpacity onPress={() => navigation.navigate(item.to)}>
			<View style={styles.menuItem}>
				<Icon
					name={item.icon}
					size={24}
					color={
						item.to == "DeleteProfile"
							? theme.colors.accent
							: theme.colors.primary
					}
				/>
				<Text
					variant="titleMedium"
					style={{
						color:
							item.to == "DeleteProfile"
								? theme.colors.accent
								: theme.colors.primary,
					}}
				>
					{item.name}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const Menu = () => {
	return (
		<View style={{ flex: 1, backgroundColor: "#252525" }}>
			<FlatList
				contentContainerStyle={{ padding: 20 }}
				data={menuData}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <MenuItem item={item} />}
			/>
		</View>
	);
};

const About = () => {
	const theme = useTheme();

	return (
		<View style={{ flex: 1, backgroundColor: "#252525", padding: 20 }}>
			<View
				style={{
					paddingHorizontal: 40,
					paddingVertical: 20,
					height: 220,
					borderRadius: 16,
					alignItems: "center",
					justifyContent: "space-between",
					gap: 10,
					backgroundColor: "#151515",
				}}
			>
				<Text
					style={{
						color: theme.colors.primary,
						fontSize: 54,
						fontWeight: "bold",
					}}
				>
					VBB
				</Text>
				<Text style={{ color: theme.colors.accent, fontSize: 18 }}>
					Vipblackbets - 2024
				</Text>
				<Text
					style={{
						color: theme.colors.description,
						fontSize: 12,
						fontWeight: "bold",
					}}
				>
					Versiya - V2.0
				</Text>
			</View>

			<Menu />
		</View>
	);
};

const styles = StyleSheet.create({
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		gap: 10,
		borderBottomWidth: 0.2,
		borderBottomColor: "#71727A",
	},
});

export default About;

import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import image1 from "../../assets/images/onboard/1.jpg";
import image2 from "../../assets/images/onboard/2.jpg";
import image3 from "../../assets/images/onboard/3.jpg";

export default function Onboarding() {
	const navigation = useNavigation();
	const theme = useTheme();
	const [page, setPage] = useState(0);
	const MAX_PAGE = 2;

	const contents = [
		{
			image: image1,
			title: "Artıq Vipblackbets ilə Depozit Qayğısı Yoxdur!",
			body: "Bütün hesabları və depozitlərinizi bir mərkəzdən idarə etməyin rahatlığını yaşayın.",
		},
		{
			image: image2,
			title: "Tam Təhlükəsiz və Sürətli Balans Köçürmələri!",
			body: "Sadəcə balansını artırmaq istədiyiniz hesabı seçərək balansınızı artırın.",
		},
		{
			image: image3,
			title: "Çoxlu Ödəniş Növləri İlə Rahatlığı Yaşayın!",
			body: "Balansınızı artırmaq üçün Bank Kartı, M10, MPay kimi ödəniş növlərindən istədiyinizi seçə bilərsiniz.",
		},
	];

	const completeOnboarding = async () => {
		try {
			await AsyncStorage.setItem("hasCompletedOnboarding", "true");
			setShowOnboarding(false);
		} catch (error) {
			console.error("Error setting onboarding status:", error);
		}
	};

	const goToNextPage = () => {
		if (page < MAX_PAGE) {
			setPage(page + 1);
		} else {
			completeOnboarding();
			navigation.navigate("Login");
		}
	};

	const renderDots = useCallback(() => {
		return Array.from({ length: MAX_PAGE + 1 }).map((dot, index) => (
			<Ionicons
				color={page == index ? theme.colors.primary : theme.colors.accent}
				name="ellipse"
				key={index}
			/>
		));
	}, [page]);

	return (
		<View style={styles.container}>
			<Image style={styles.image} source={contents[page].image} />

			<View style={styles.actionContainer}>
				<View style={styles.display}>
					<View style={styles.dots}>{renderDots()}</View>
					<Text variant="titleLarge">{contents[page].title}</Text>
					<Text style={{ color: theme.colors.description }} variant="bodySmall">
						{contents[page].body}
					</Text>
				</View>

				<Button mode="contained" onPress={goToNextPage}>
					{page < MAX_PAGE ? "Davam et" : "Başla"}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#252525",
	},
	image: {
		width: "100%",
		height: "65%",
		objectFit: "cover",
	},
	actionContainer: {
		flex: 1,
		justifyContent: "space-between",
		padding: 20,
		gap: 10,
	},
	dots: {
		flexDirection: "row",
		margin: 10,
		gap: 5,
	},
	display: {
		gap: 10,
	},
});

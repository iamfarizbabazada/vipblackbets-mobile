import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import { IconButton, RadioButton, Text, useTheme } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

export default function FormPayment({ form }) {
	const theme = useTheme();

	const providers = [
		{
			name: "Bank Kartı",
			card: "0595 5432 2423 1234",
		},
		{
			name: "M10",
			card: "+994 55 515 82 83",
		},
		{
			name: "MPay",
			card: "4525 5332 2483 2235",
		},
	];

	const selected = form.values.paymentType;

	const copyToClipboard = async (provider) => {
		await Clipboard.setStringAsync(provider.card);
	};

	const handleSelect = (provider) => {
		form.setFieldValue("paymentType", provider.name);
		copyToClipboard(provider);
	};

	return (
		<ScrollView>
			{providers.map((provider, indx) => (
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => handleSelect(provider)}
					style={{
						marginVertical: 10,
						gap: 10,
						borderWidth: 0.5,
						borderColor:
							selected == provider.name
								? theme.colors.primary
								: theme.colors.accent,
						borderRadius: 25,
						paddingVertical: 10,
						paddingHorizontal: 10,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<RadioButton
							color={theme.colors.primary}
							uncheckedColor={theme.colors.accent}
							status={selected == provider.name ? "checked" : "unchecked"}
						/>
						<Text
							style={{
								color: theme.colors.primary,
								fontSize: 18,
								fontWeight: "bold",
							}}
						>
							{provider.name}
						</Text>
					</View>
					<View
						style={{
							padding: 20,
							backgroundColor:
								selected == provider.name
									? theme.colors.primary
									: theme.colors.accent,
							borderRadius: 15,
						}}
					>
						<Text style={{ color: "#252525", fontSize: 16 }}>
							{provider.card}
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}

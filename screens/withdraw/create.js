import {
	View,
	Image,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconButton, RadioButton, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth";
import * as Clipboard from "expo-clipboard";

const validationSchema = Yup.object({
	paymentType: Yup.string().required(),
	amount: Yup.number().min(1).required(),
	cardNumber: Yup.string().required(),
	withdrawId: Yup.string().required(),
	withdrawCode: Yup.string().required(),
});

const PaymentType = ({
	selected,
	provider,
	form,
	handleSelect,
	handleCopy,
}) => {
	const theme = useTheme();

	return (
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
			{selected == provider.name && (
				<View>
					<Input
					keyboardType="number-pad"
					onChangeText={(text) =>
						form.setFieldValue("cardNumber", text)
					}
				/>
					<Text variant="titleMedium" style={{ color: theme.colors.accent }}>
						{provider.desc}
					</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

function AmountInput({ form }) {
	const theme = useTheme();

	return (
		<View style={{}}>
			<View>
				<Input
					label="Məbləğ"
					mode="outlined"
					value={
						isNaN(form.values?.amount?.toString())
							? "0"
							: form.values?.amount?.toString()
					}
					keyboardType="number-pad"
					onChangeText={(text) =>
						form.setFieldValue("amount", Number.parseFloat(text))
					}
					cursorColor={theme.colors.primary}
				/>
			</View>
			<Text
				variant="titleSmall"
				style={{ color: theme.colors.accent, fontWeight: "bold" }}
			>
				Çıxarış üçün komissiya yoxdur
			</Text>
		</View>
	);
}

export default function BalanceCreate() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { user, fetchUser } = useAuthStore();
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(false);

	const formik = useFormik({
		initialValues: {
			paymentType: "Bank Kartına köçürmə",
			amount: 0,
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await api.post("/profile/withdraw", values);
				await fetchUser();
				navigation.navigate("ProfileList");
				setPage(page + 1);
			} catch (err) {
				console.error(err.response?.data);
			}
			setLoading(false);
		},
	});

	const providers = [
		{
			name: "Bank Kartına köçürmə",
			card: "0595 5432 2423 1234",
			desc: "Kartınızın 16 rəqəmini daxil edin!",
		},
		{
			name: "M10",
			card: "+994 55 515 82 83",
			desc: "m10 hesabınızın nömrəsini daxil edin!",
		},
		{
			name: "MPay",
			card: "4525 5332 2483 2235",
			desc: "MPay hesabınızın nömrəsini daxil edin!",
		},
	];

	const selected = formik.values.paymentType;

	const copyToClipboard = async (provider) => {
		await Clipboard.setStringAsync(provider.card);
	};

	const handleSelect = (provider) => {
		formik.setFieldValue("paymentType", provider.name);
	};

	// const renderBalanceError = useCallback(() => {
	//   if(formik.values.amount > user.currentBalance ) return (
	//     <Text style={{padding: 20, borderRadius: 16, backgroundColor: theme.colors.accent}}>Balansda kifayət qədər məbləğ yoxdur</Text>
	//   )

	// }, [formik.values.amount, user?.currentBalance])

	return (
		<View style={styles.container}>
			<View style={styles.actionContainer}>
				<View style={styles.display}>
					<Text
						variant="titleLarge"
						style={{ fontWeight: "bold", color: theme.colors.primary }}
					>
						Yeni Çıxarış
					</Text>
					<Text variant="titleMedium" style={{ color: theme.colors.accent }}>
						Çıxarış məbləğini daxil edin
					</Text>
				</View>

				<ScrollView>
					<View style={{ marginVertical: 20 }}>
						<AmountInput form={formik} />
					</View>

					{providers.map((provider, indx) => (
						<PaymentType
							form={formik}
							provider={provider}
							handleCopy={copyToClipboard}
							handleSelect={handleSelect}
							selected={selected}
							key={indx}
						/>
					))}


					<Text variant="titleMedium" style={{ color: theme.colors.accent, marginVertical: 10 }}>
						Çıxarış növünü seçin
					</Text>


					<View>
						<View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, height: 60, width: 80, borderBottomLeftRadius: 16, borderTopLeftRadius: 16}}>
							<Text style={{color: '#252525'}} variant="titleMedium">ID</Text>
						</View>
						<Input
							style={{ paddingLeft: 80 }}
							textColor="#fff" 
							onChangeText={text => formik.setFieldValue("withdrawId", text)}
						/>
					</View>

					<View style={{marginVertical: 16}}>
						<View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, height: 60, width: 80, borderBottomLeftRadius: 16, borderTopLeftRadius: 16}}>
							<Text style={{color: '#252525'}} variant="titleMedium">KOD</Text>
						</View>
						<Input
							style={{ paddingLeft: 80 }}
							textColor="#fff" 
							onChangeText={text => formik.setFieldValue("withdrawCode", text)}
						/>
					</View>
				</ScrollView>

				<Button
					loading={loading}
					mode="contained"
					disabled={(formik.values.amount > user.currentBalance) ||  formik.values.amount === 0 || formik.values.amount === null}
					onPress={formik.handleSubmit}
				>
					Təsdiqlə
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
		justifyContent: "space-between",
		backgroundColor: "#2F2F2F",
		padding: 20,
	},
	display: {
		gap: 10,
	},
});

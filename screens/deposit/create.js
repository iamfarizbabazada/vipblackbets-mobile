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
import image1 from "../../assets/images/providers/1.png";
import image2 from "../../assets/images/providers/2.png";
import image3 from "../../assets/images/providers/3.png";

// Form doğrulama için Yup kullanarak gerekli kuralları tanımlıyoruz
const validationSchema = Yup.object({
	provider: Yup.string().required(),
	amount: Yup.number().min(1).required(),
	withdrawId: Yup.string().required(),
});

// Ödeme türünü temsil eden bileşen
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
				backgroundColor:
					selected === provider.name
						? theme.colors.primary
						: theme.colors.accent,
				borderRadius: 25,
				paddingVertical: 10,
				paddingHorizontal: 10,
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<RadioButton
					color={"#252525"}
					uncheckedColor={"#252525"}
					status={selected === provider.name ? "checked" : "unchecked"}
				/>
				<Image source={provider.image} />
			</View>
			{selected === provider.name && (
				<View>
					<AmountInput form={form} />
					<Input
						mode="outlined"
						style={{ backgroundColor: "#252525" }}
						label="ID"
						onChangeText={(text) => form.setFieldValue("withdrawId", text)}
					/>
				</View>
			)}
		</TouchableOpacity>
	);
};

// Miktar inputu bileşeni
function AmountInput({ form }) {
	const theme = useTheme();

	return (
		<View>
			<Input
				label="Məbləğ"
				outlineStyle={{
					backgroundColor: "#252525",
				}}
				mode="outlined"
				value={
					isNaN(form.values?.amount?.toString())
						? "0"
						: form.values?.amount?.toString()
				}
				keyboardType="number-pad"
				onChangeText={(text) => {
					// Input boşsa 0 atanıyor, aksi takdirde sayısal değeri alıyor
					form.setFieldValue("amount", text ? Number.parseFloat(text) : 0);
				}}
				cursorColor={theme.colors.primary}
			/>
		</View>
	);
}

// Ana bileşen
export default function BalanceCreate() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { user, fetchUser } = useAuthStore(); // Kullanıcı bilgilerini getiriyoruz
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			provider: "MOSTBET",
			amount: 0,
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				// API'ye gönderim yapılır ve kullanıcı bilgileri güncellenir
				await api.post("/profile/pay/deposit", values);
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
			name: "MOSTBET",
			image: image1,
		},
		{
			name: "MELBET",
			image: image2,
		},
		{
			name: "1XBET",
			image: image3,
		},
	];

	const selected = formik.values.provider;

	// Clipboard'a kopyalama fonksiyonu
	const copyToClipboard = async (provider) => {
		await Clipboard.setStringAsync(provider.card);
	};

	// Sağlayıcı seçimini ayarlayan fonksiyon
	const handleSelect = (provider) => {
		formik.setFieldValue("provider", provider.name);
	};

	// Mevcut bakiye ile girilen miktarın karşılaştırıldığı fonksiyon
	const renderBalanceError = useCallback(() => {
		if (formik.values.amount > user.currentBalance) {
			return (
				<Text style={{ padding: 20, borderRadius: 16, backgroundColor: theme.colors.accent }}>
					Balansda kifayət qədər məbləğ yoxdur
				</Text>
			);
		}
	}, [formik.values.amount, user?.currentBalance]);

	return (
		<View style={styles.container}>
			<View style={styles.actionContainer}>
				{renderBalanceError()}
				<View style={styles.display}>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						<Text
							variant="titleLarge"
							style={{ fontWeight: "bold", color: theme.colors.primary }}
						>
							Depozit et
						</Text>
						<Text
							variant="titleMedium"
							style={{ color: theme.colors.description }}
						>
							Mövcud balans: {user.currentBalance}₼
						</Text>
					</View>
					<Text variant="titleMedium" style={{ color: theme.colors.accent }}>
						Depozit ediləcək provayderi seçin
					</Text>
				</View>

				<ScrollView>
					{providers.map((provider, indx) => (
						<PaymentType
							form={formik}
							provider={provider}
							handleCopy={copyToClipboard}
							handleSelect={handleSelect}
							selected={selected}
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={indx}
						/>
					))}
				</ScrollView>

				<Button
					loading={loading}
					mode="contained"
					onPress={formik.handleSubmit}
					disabled={
						formik.values.amount > user.currentBalance ||
						formik.values.amount === 0
					} // Bakiye kontrolü ve 0 değeri kontrolü
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
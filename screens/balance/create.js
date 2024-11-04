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

// Giriş doğrulama şeması. PaymentType zorunlu string, amount ise en az 1 olan bir sayı.
const validationSchema = Yup.object({
	paymentType: Yup.string().required(),
	amount: Yup.number().min(1).required(),
});

// PaymentType bileşeni: Kullanıcı seçimini ve kopyalama işlemini yönetir.
const PaymentType = ({ selected, provider, form, handleSelect, handleCopy }) => {
	const theme = useTheme();

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => handleSelect(provider)} // Sağlanan yöntemi çağırarak seçimi günceller.
			style={{
				marginVertical: 10,
				gap: 10,
				borderWidth: 0.5,
				borderColor: selected === provider.name
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
					status={selected === provider.name ? "checked" : "unchecked"}
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
			{/* Seçili ödeme yöntemi için, kart bilgisi ve kopyalama butonu gösteriliyor */}
			{selected === provider.name && (
				<>
					<View
						style={{
							paddingVertical: 5,
							paddingHorizontal: 10,
							justifyContent: "space-between",
							flexDirection: "row",
							flex: 1,
							borderWidth: 1,
							alignItems: "center",
							borderColor: theme.colors.accent,
							borderRadius: 15,
						}}
					>
						<Text
							style={{
								color: theme.colors.primary,
								fontSize: 16,
								borderRightWidth: 0.5,
								borderRightColor: theme.colors.primary,
								paddingRight: 10,
							}}
						>
							{provider.card}
						</Text>
						<Button
							icon={() => (
								<Ionicons
									name="clipboard-outline"
									color={theme.colors.primary}
									size={18}
								/>
							)}
							onPress={() => handleCopy(provider)}
						>
							Kopyala
						</Button>
					</View>
					<View>
						<AmountInput form={form} />
					</View>
				</>
			)}
		</TouchableOpacity>
	);
};

// AmountInput bileşeni: Kullanıcının girdiği miktarı günceller.
function AmountInput({ form }) {
	const theme = useTheme();

	return (
		<View>
			<Input
				label="Məbləğ"
				mode="outlined"
				value={
					isNaN(form.values?.amount?.toString()) ? "0" : form.values?.amount?.toString()
				}
				keyboardType="number-pad"
				onChangeText={(text) =>
					form.setFieldValue("amount", text ? Number.parseFloat(text) : 0) // Boş inputta 0 atanıyor
				}
				cursorColor={theme.colors.primary}
			/>
			<Text variant="titleSmall" style={{ color: theme.colors.accent, fontWeight: "bold" }}>
				Balans artımı üçün komissiya yoxdur
			</Text>
		</View>
	);
}

// BalanceCreate bileşeni: Kullanıcının balans artırmasına olanak tanır.
export default function BalanceCreate() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { user, fetchUser } = useAuthStore();
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(false);

	// Formik form yöneticisi
	const formik = useFormik({
		initialValues: {
			paymentType: "Bank Kartına köçürmə",
			amount: 0,
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const formData = new FormData();
				formData.append("paymentType", values.paymentType);
				formData.append("amount", values.amount);

				// Eğer dosya varsa, formdata'ya eklenir.
				if (file) {
					formData.append("file", {
						uri: file.uri,
						type: file.mimeType,
						name: file.name,
					});
				}

				// API'ye istek gönderiliyor
				await api.post("/profile/pay/balance", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				await fetchUser(); // Kullanıcı verisi güncelleniyor.
				navigation.navigate("ProfileList"); // ProfileList sayfasına yönlendirme.
				setPage(page + 1); // Sayfa sayısını günceller.
			} catch (err) {
				console.error(err.response?.data);
			}
			setLoading(false);
		},
	});

	// Ödeme yöntemleri listesi
	const providers = [
		{ name: "Bank Kartına köçürmə", card: "0595 5432 2423 1234" },
		{ name: "M10", card: "+994 55 515 82 83" },
		{ name: "MPay", card: "+994 55 515 82 83" },
	];

	const selected = formik.values.paymentType;

	// Kart numarasını panoya kopyalar.
	const copyToClipboard = async (provider) => {
		await Clipboard.setStringAsync(provider.card);
	};

	// Seçili ödeme yöntemini günceller.
	const handleSelect = (provider) => {
		formik.setFieldValue("paymentType", provider.name);
	};

	return (
		<View style={styles.container}>
			<View style={styles.actionContainer}>
				<View style={styles.display}>
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.primary }}>
							Balans artır
						</Text>
						<Text variant="titleMedium" style={{ color: theme.colors.description }}>
							Mövcud balans: {user.currentBalance}₼
						</Text>
					</View>
					<Text variant="titleMedium" style={{ color: theme.colors.accent }}>
						Balans artırmaq növünü seçin
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
							key={indx}
						/>
					))}
				</ScrollView>

				<Button
	loading={loading}
	mode="contained"
	disabled={formik.values.amount <= 0} // Mevcut bakiye kontrolü kaldırıldı
	onPress={formik.handleSubmit}
>
	Təsdiqlə
</Button>
			</View>
		</View>
	);
}

// Stil tanımları
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
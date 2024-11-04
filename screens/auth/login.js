import { View, Image, StyleSheet, Alert, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { Input, Password } from "../../components/input";
import { useFormik } from "formik";
import * as Yup from "yup";

import coverImage from "../../assets/images/vbb-login-cover.png";
import { useAuthStore } from "../../store/auth";
import { useState } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import api from "../../lib/api";
import LottieView from "lottie-react-native";
import vbbbeeAnimation from '../../data/vbbbee.json';

const validationSchema = Yup.object({
	email: Yup.string().email().required(),
	password: Yup.string().min(8).required(),
});

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

async function registerForPushNotificationsAsync() {
	let token;
	if (Device.isDevice) {
		const { status: existingStatus, ios } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		console.log("exitis", existingStatus);

		if (
			existingStatus !== "granted" ||
			ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
		) {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
			console.log(status);
		}
		// if (finalStatus !== 'granted') {
		//     alert(
		//         'Bildirişlər üçün icazə alına bilinmədi.Sifariş qəbul eləmək üçün Kloun.az proqramının parametrlər hissəsində Notifications bölməsinini aktiv edin!',
		//     );
		//     return;
		// }
		token = (
			await Notifications.getExpoPushTokenAsync({
				projectId: "412dc9e3-7b42-4d7f-a472-489ca129bb1a",
			})
		).data;
		console.log(token);
	} else {
		alert("Must use physical device for Push Notifications");
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.HIGH,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
			sound: "default",
		});
	}

	return token;
}

export default function Login() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { login } = useAuthStore();
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);
	const { actionFlag } = useRoute().params || {};

	const uploadToken = async () => {
		const token = await registerForPushNotificationsAsync();
		if (!token) {
			return Alert.alert(
				"Bildirişlər üçün icazə alına bilinmədi!",
			);
		}

		await api.post("/profile/notifications", { token });
	};

	const formik = useFormik({
		validationSchema: validationSchema,
		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			try {
				await login(values);
				await uploadToken();
				resetForm();
				navigation.navigate("Home");
			} catch (err) {
				setErr(err.response?.data?.message);
				console.warn(err.response?.data?.action);
				if (err.response?.data?.action == "VERIFICATION") {
					setLoading(false);
					setErr(null);
					return navigation.navigate("RegisterVerify", { email: values.email });
				}
			}
			setLoading(false);
		},
		initialValues: {
			email: "",
			password: "",
		},
	});

	return (
		<View style={styles.container}>
			<Image style={styles.image} source={coverImage} />
			<LottieView source={vbbbeeAnimation} autoPlay loop={true} style={styles.vbbbee} />

			<View style={styles.actionContainer}>
				{actionFlag == "VERIFIED" && (
					<View
					style={{
						padding: 20,
						backgroundColor: theme.colors.accent,
						borderRadius: 16,
					}}
					>
						<Text style={{ fontSize: 16, color: "white" }}>
							Hesabınız təsdiqləndi. Zəhmət olmasa giriş edin.
						</Text>
					</View>
				)}
				

				<Text
					style={{ color: theme.colors.primary, marginVertical: 0, marginTop: 20, fontSize: 26, textAlign: "left" }}
					variant="titleLarge"
				>
					Xoş Gəldin!
				</Text>
				<Text style={{ color: theme.colors.description }} variant="bodySmall">
						VBB hesabına daxil ol, elə indi qazanmağa başla
					</Text>
				{err && (
					<Text style={{ color: theme.colors.error }} variant="bodySmall">
						{err}
					</Text>
				)}

				<View style={styles.display}>
					<Input
					    style={styles.loginInput}
						error={formik.errors.email}
						keyboardType="email-address"
						// style={{ color: theme.colors.primary }}
						label="E-poçt ünvanı"
						value={formik.values.email}
						onChangeText={formik.handleChange("email")}
					/>
					<Password
						error={formik.errors.password}
						style={styles.loginInput}
						// style={{ color: theme.colors.primary }}
						label="Şifrə"
						value={formik.values.password}
						onChangeText={formik.handleChange("password")}
					/>

					<Text
						style={styles.loginForget}
						variant="bodySmall"
						onPress={() => navigation.navigate("ForgetPassword")}
					>
						Şifrəni unutdun?
					</Text>
				</View>

				<Button
					mode="contained"
					loading={loading}
					onPress={formik.handleSubmit}
					style={styles.loginButton}
				>
					Daxil ol
				</Button>

				<Text
					style={{ alignSelf: "center", color: theme.colors.description, marginTop: 30}}
					variant="bodyMedium" 
					>
					Hesabın yoxdur? {"  "}
					<Text
						style={{ color: theme.colors.primary }}
						onPress={() => navigation.navigate("Register")}
					>
						Qeydiyyatdan Keç
					</Text>
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	loginButton:{
		borderRadius: 10,
		color: "#252525",
		fontSize: 36,

	},
	loginInput:{
		borderRadius: 0,
		color: "#252525",
		fontSize: 14,

	},
	loginForget:{
		fontSize: 14,
		marginTop: 10,
		color: "#B8860B",

	},
	container: {
		flex: 1,
		backgroundColor: "#B8860B",

	},
	image: {
		width: "100%",
		height: "40%",
		backgroundColor: "#B8860B",

	},
	actionContainer: {
		flex: 1,
		padding: 20,
		gap: 10,
		backgroundColor: "#1e1e1e",
		borderTopRightRadius: 30,
		borderTopLeftRadius: 30,

	},
	display: {
		gap: 10,
		marginBottom: 10,
		marginTop: 0,
		color: "B8860B",
	},
	vbbbee: {
		position: 'absolute',
		top: 0,
		alignSelf: 'center', // Yatay olarak ortalama
		width: '50%', // Genişliği ihtiyaca göre ayarlayın
		height: '60%', // Yüksekliği ihtiyaca göre ayarlayın

	}
});

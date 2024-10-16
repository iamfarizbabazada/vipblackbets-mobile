import React, { useState } from "react";
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Checkbox, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { OtpInput } from "react-native-otp-entry";
import { Password } from "../../components/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../../store/auth";
import api from "../../lib/api";

const validationSchema = Yup.object({
	email: Yup.string().email().required(),
	otp: Yup.string().min(4).max(4).required(),
	password: Yup.string().min(8).required(),
});

export default function ResetPassword() {
	const navigation = useNavigation();
	const route = useRoute();
	const { email } = route.params;
	const theme = useTheme();
	const { resetOtp } = useAuthStore();
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		validationSchema: validationSchema,
		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			try {
				await api.post("/auth/password/reset", {
					email: email,
					newPassword: values.password,
					otp: values.otp,
				});
				resetForm();
				navigation.navigate("Login");
			} catch (err) {
				setErr(err.response?.data?.message);
			}
			setLoading(false);
		},
		initialValues: {
			otp: "",
			email: email,
			password: "",
		},
	});

	const resendOtp = async () => {
		try {
			await api.post("/auth/password/request", { email });
		} catch (err) {
			console.error(err.response?.data?.message);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<ScrollView contentContainerStyle={styles.scrollView}>
				{err && (
					<Text style={{ color: theme.colors.error }} variant="bodySmall">
						{err}
					</Text>
				)}

				<View style={styles.display}>
					<Text style={{ color: theme.colors.primary }} variant="titleLarge">
						Təsdiqləmə Kodunu Daxil Et
					</Text>
					<Text
						style={{
							color: theme.colors.description,
							textAlign: "center",
							marginBottom: 40,
						}}
						variant="bodySmall"
					>
						4 rəqəmli təsdiqləmə kodu {"\n"}
						{email} ünvanına göndərildi!
					</Text>

					<View style={{ gap: 20, height: "25%" }}>
						<OtpInput
							numberOfDigits={4}
							theme={{
								focusStickStyle: { backgroundColor: theme.colors.primary },
								focusedPinCodeContainerStyle: {
									borderColor: theme.colors.primary,
								},
								filledPinCodeContainerStyle: {
									borderColor: theme.colors.accent,
								},
								pinCodeTextStyle: { color: theme.colors.accent },
								pinCodeContainerStyle: { width: 70 },
							}}
							onTextChange={(text) => formik.setFieldValue("otp", text, true)}
						/>
						<View style={{ marginVertical: 25 }}>
							<Text
								style={{ color: theme.colors.primary, marginVertical: 10 }}
								variant="titleLarge"
							>
								Şifrəni Yenilə
							</Text>
							<Password
								error={formik.errors.password}
								label="Yeni Şifrə"
								value={formik.values.password}
								onChangeText={formik.handleChange("password")}
							/>
						</View>
					</View>
				</View>

				<View>
					<Button mode="text" onPress={resendOtp}>
						Yenidən göndər
					</Button>
					<Button
						mode="contained"
						loading={loading}
						onPress={formik.handleSubmit}
					>
						Təsdiqlə
					</Button>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#252525",
	},
	scrollView: {
		flexGrow: 1,
		padding: 20,
		justifyContent: "space-between",
	},
	display: {
		gap: 10,
		marginTop: "30%",
		marginBottom: 20,
		alignItems: "center",
		alignSelf: "center",
		width: "90%",
	},
});

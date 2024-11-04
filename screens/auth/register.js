import { View, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Checkbox, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { Input, Password } from "../../components/input";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import coverImage from "../../assets/images/vbb-login-cover.png";
import LottieView from "lottie-react-native";
import vbbbeeAnimation from '../../data/vbbbee.json';

const validationSchema = Yup.object({
	name: Yup.string().required(),
	email: Yup.string().email().required(),
	password: Yup.string().min(8).required(),
	confirmpassword: Yup.string()
		.oneOf([Yup.ref("password"), null], "Şifrələr eyni deyil")
		.required("Şifrənin təsdiqi vacibdir"),
	check: Yup.boolean().isTrue(),
});

export default function Register() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { register } = useAuthStore();
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await register(values);
				navigation.navigate("RegisterVerify", { email: values.email });
			} catch (err) {
				setErr(err.response?.data?.message);
			}
			setLoading(false);
		},
		initialValues: {
			name: "",
			email: "",
			password: "",
			confirmpassword: "",
			check: false,
		},
	});

	return (
		<View style={styles.container}>
			<Image style={styles.image} source={coverImage} />
			<LottieView source={vbbbeeAnimation} autoPlay loop={true} style={styles.vbbbee} />
			<View style={styles.actionContainer}>
				<View style={{ marginVertical: 10, gap: 5 }}>
					<Text style={{ color: theme.colors.primary }} variant="titleLarge">
						Qeydiyyatdan Keç
					</Text>
					<Text style={{ color: theme.colors.description }} variant="bodySmall">
						Yeni macəraya başlamaq üçün hesab aç
					</Text>
				</View>

				{err && (
					<Text style={{ color: theme.colors.error }} variant="bodySmall">
						{err}
					</Text>
				)}

				<View style={styles.display}>
					<Input
						error={formik.errors.name}
						label="Ad Soyad"
						value={formik.values.name}
						onChangeText={formik.handleChange("name")}
					/>

					<Input
						error={formik.errors.email}
						keyboardType="email-address"
						label="E-poçt ünvanı"
						value={formik.values.email}
						onChangeText={formik.handleChange("email")}
					/>
					<Password
						error={formik.errors.password}
						label="Şifrə"
						value={formik.values.password}
						onChangeText={formik.handleChange("password")}
					/>
					<Password
						error={formik.errors.confirmpassword}
						label="Şifrənin Təkrarı"
						value={formik.values.confirmpassword}
						onChangeText={formik.handleChange("confirmpassword")}
					/>

					<View style={{ flexDirection: "row", width: "90%", marginTop: 20 }}>
						<Checkbox
							status={formik.values.check ? "checked" : "unchecked"}
							onPress={() =>
								formik.setFieldValue("check", !formik.values.check, true)
							}
						/>
						<TouchableOpacity onPress={() => navigation.navigate("Terms")}>
							<Text style={{ color: theme.colors.primary, fontSize: 12 }}>Qeydiyyatdan keçərək,
        					Şərtlər & Qaydalar və Gizlilik Siyasəti ilə razılaşdığımı bildirirəm!
    						</Text>
						</TouchableOpacity>
					</View>
				</View>

				<Button
					mode="contained"
					loading={loading}
					onPress={formik.handleSubmit}
					style={styles.registerButton}
				>
					Davam Et
				</Button>

				<Text
					style={{ alignSelf: "center", color: theme.colors.description }}
					variant="bodyMedium"
				>
					Artıq hesabın var? {"  "}
					<Text
						style={{ color: theme.colors.primary }}
						onPress={() => navigation.navigate("Login")}
					>
						Daxil Ol 
					</Text>
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#B8860B",
		
	},
	image: {
		width: "100%",
		height: "20%",
		backgroundColor: "#B8860B",
	},
	vbbbee: {
		position: 'absolute',
		top: 0,
		alignSelf: 'flex-end', // Yatay olarak ortalama
		width: '40%', // Genişliği ihtiyaca göre ayarlayın
		height: '40%', // Yüksekliği ihtiyaca göre ayarlayın
		zIndex: 2,

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
		fontSize: 14,
		
	},
	registerButton:{
		borderRadius: 10,
		color: "#252525",
		marginBottom: 10,

	},
});

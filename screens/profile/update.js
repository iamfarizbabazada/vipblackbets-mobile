import { View, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { Input, Password } from "../../components/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";

import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import api from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";

const validationSchema = Yup.object({
	name: Yup.string(),
	email: Yup.string().email(),
});

export default function UpdateProfile() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { user, fetchUser } = useAuthStore();
	const [selectedImage, setSelectedImage] = useState(null);
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await api.put("/profile", { profile: values });
				await fetchUser();
				navigation.navigate("ProfileList");
			} catch (err) {
				setErr(err.response?.data?.message);
			}
			setLoading(false);
		},
		initialValues: {
			name: user.name,
			email: user.email,
		},
	});

	const pickImage = async () => {
		// Request permission
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("Permission to access camera roll is required!");
			return;
		}

		// Launch the image picker
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
			allowsMultipleSelection: false,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
			const formData = new FormData();
			formData.append("avatar", {
				uri: result.assets[0].uri,
				name: "avatar.jpg",
				type: "image/jpeg",
			});

			try {
				const res = await api.patch("/profile/upload/avatar", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				console.log(res.data);
				await fetchUser();
				setErr("Profil şəkli uğurla yükləndi");
			} catch (err) {
				console.error(err);
				setErr("Profil şəkli yüklənərkən xəta baş verdi");
			}
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.display}>
				{err && (
					<View
						style={{
							padding: 20,
							backgroundColor: theme.colors.accent,
							borderRadius: 16,
						}}
					>
						<Text style={{ fontSize: 16, color: "white" }}>{err}</Text>
					</View>
				)}
				<View style={styles.info}>
					<TouchableOpacity style={{ marginBottom: 20 }} onPress={pickImage}>
						<Avatar.Icon style={{ borderRadius: 16 }} size={100} icon="plus" />
						<Text style={{ opacity: 0.5, padding: 10 }}>+ Profil Şəkli</Text>
					</TouchableOpacity>
				</View>

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
			</View>

			<Button mode="contained" loading={loading} onPress={formik.handleSubmit}>
				Yenilə
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#252525",
		justifyContent: "space-between",
	},
	info: {
		alignItems: "center",
		gap: 5,
	},
	image: {
		width: "100%",
		height: "40%",
	},
	display: {
		gap: 10,
		marginBottom: 20,
	},
});

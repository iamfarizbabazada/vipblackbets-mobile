import {
	View,
	Image,
	StyleSheet,
	Alert,
	Dimensions,
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dialog, Divider, Portal, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { Input, Password } from "../../components/input";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import api from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";

const validationSchema = Yup.object({
	oldPassword: Yup.string().min(8),
});

export default function Security() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { user, fetchUser, delete: deleteUser } = useAuthStore();
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);

	const [visible, setVisible] = useState(false);

	const showDialog = () => setVisible(true);

	const hideDialog = () => setVisible(false);

	const formik = useFormik({
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			console.log(values);
			setLoading(true);
			try {
				await deleteUser(values);
				hideDialog();
			} catch (err) {
				setErr(err.response?.data?.error);
			}
			setLoading(false);
		},
		initialValues: {
			oldPassword: "",
			newPassword: "",
			confirmpassword: "",
		},
	});

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.display}>
					<Ionicons
						name="trash-bin-outline"
						size={Dimensions.get("screen").width / 4}
						style={{ alignSelf: "center", marginVertical: 32 }}
						color={theme.colors.description}
					/>

					<Text
						variant="titleMedium"
						style={{
							color: theme.colors.primary,
							textAlign: "center",
							marginVertical: 10,
						}}
					>
						Hesabın Silinməsi
					</Text>

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
					<View style={{ gap: 10 }}>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
						>
							<Ionicons name="ellipse" size={8} color={theme.colors.primary} />
							<Text
								variant="titleSmall"
								style={{ color: theme.colors.primary }}
							>
								Fikrinizi dəyişsəniz və ya təsadüfən VBB Hesabınızı
								silmisinizsə, onu müəyyən müddət ərzində bərpa edə bilərsiniz.
							</Text>
						</View>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
						>
							<Ionicons name="ellipse" size={8} color={theme.colors.primary} />
							<Text
								variant="titleSmall"
								style={{ color: theme.colors.primary }}
							>
								Hesabınızı silmək üçün mövcud şifrənizi daxil edin!{" "}
							</Text>
						</View>
					</View>

					<View style={{ gap: 15, marginBottom: 15 }}>
						<Password
							error={formik.errors.oldPassword}
							label="Mövcud Şifrə"
							value={formik.values.oldPassword}
							onChangeText={formik.handleChange("oldPassword")}
						/>
					</View>

					<View
						style={{
							flexDirection: "row",
							width: "80%",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Ionicons name="close-circle" size={18} color="#FF4D4F" />
						<Text variant="titleSmall" style={{ color: "#FF4D4F" }}>
							Hesabınızı silmək üçün mövcud şifrənizi daxil edin!{" "}
						</Text>
					</View>
				</View>
			</ScrollView>

			<Button
				mode="contained"
				loading={loading}
				style={{ backgroundColor: "#FF4D4F" }}
				onPress={showDialog}
			>
				Hesabımı sil
			</Button>

			<Portal>
				<Dialog
					style={{ backgroundColor: "#252525" }}
					visible={visible}
					onDismiss={hideDialog}
				>
					<Dialog.Title>Hesabı Sil</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">
							Hesabınızı silib və çıxmaq istədiyinizə əminsinizmi?
						</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button textColor={theme.colors.accent} onPress={hideDialog}>
							Ləğv et
						</Button>
						<Button onPress={formik.handleSubmit}>Sil</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
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
	image: {
		width: "100%",
		height: "40%",
	},
	display: {
		gap: 10,
		marginBottom: 20,
	},
});

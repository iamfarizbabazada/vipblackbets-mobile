import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Button } from "../../components/button";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../lib/api";

import FormProvider from "./form/provider";
import FormPayment from "./form/payment";
import FormAmount from "./form/amount";
import FormStatus from "./form/status";

const validationSchema = Yup.object({
	provider: Yup.string().required(),
	paymentType: Yup.string().required(),
	amount: Yup.number().min(1),
});

export default function OrderCreate() {
	const navigation = useNavigation();
	const theme = useTheme();
	const [page, setPage] = useState(0);
	const MAX_PAGE = 3;
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(false);

	const formik = useFormik({
		initialValues: {
			provider: "MOSTBET",
			paymentType: "Bank Kartı",
			amount: 0,
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const formData = new FormData();

				formData.append("provider", values.provider);
				formData.append("paymentType", values.paymentType);
				formData.append("amount", values.amount);

				console.log(file);

				if (file) {
					console.log("girdi");
					const formFile = {
						uri: file.uri,
						type: file.mimeType,
						name: file.name,
					};

					formData.append("file", formFile);
				}

				await api.post("/orders", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				setPage(page + 1);
			} catch (err) {
				console.error(err.response?.data);
			}
			setLoading(false);
		},
	});

	const contents = [
		{
			name: "Provayder",
			title: "Provayder Seçin",
			body: "Balansını artıracağınız provayderi seçin!",
			form: <FormProvider form={formik} />,
		},
		{
			name: "Ödəniş növü",
			title: "Ödəniş Növü",
			body: "Balansı hansı üsul ilə yükləyəcəyinizi seçin!",
			form: <FormPayment form={formik} />,
		},
		{
			name: "Məbləğ",
			title: "Depozit Miqdarı",
			body: "Balansa yüklənəcək məbləği daxil edin!",
			form: <FormAmount form={formik} setFile={setFile} />,
		},
		{
			name: "Status",
			title: "Ödənişin Statusu",
			body: "Ödənişiniz icradadır!",
			form: <FormStatus form={formik} />,
		},
	];

	const goToNextPage = () => {
		if (page == 2) {
			formik.handleSubmit();
		} else if (page < MAX_PAGE) {
			setPage(page + 1);
		} else {
			navigation.navigate("OrderList");
		}
	};

	const renderDots = useCallback(() => {
		return contents.map((dot, index) => (
			<View style={{ alignItems: "center" }}>
				<IconButton
					mode="contained"
					size={20}
					icon={page > index ? "check" : "chevron-right"}
					style={{ backgroundColor: "#fdfdfd" }}
					iconColor="#252525"
				/>
				<Text variant="bodySmall" style={{ color: theme.colors.description }}>
					{dot.name}
				</Text>
			</View>
		));
	}, [page]);

	const renderBtnLabel = useCallback(() => {
		if (page == MAX_PAGE) return "Statusu İzlə";
		if (page == 2) return "Ödənişi Təsdiqlə";
		if (page < MAX_PAGE) return "Növbəti";
	}, [page]);

	return (
		<View style={styles.container}>
			<View style={styles.dots}>{renderDots()}</View>

			<View style={styles.actionContainer}>
				<View style={styles.display}>
					<Text variant="titleLarge" style={{ color: theme.colors.primary }}>
						{contents[page].title}
					</Text>
					<Text style={{ color: theme.colors.description }} variant="bodySmall">
						{contents[page].body}
					</Text>
				</View>

				{contents[page].form}

				<Button loading={loading} mode="contained" onPress={goToNextPage}>
					{renderBtnLabel()}
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

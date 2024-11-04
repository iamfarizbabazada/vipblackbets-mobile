import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Input as TextInput } from "../../components/input"; // Özel bir girdi bileşeni
import api from "../../lib/api"; // API çağrıları için kullanılacak kütüphane
import { useAuthStore } from "../../store/auth"; // Kullanıcı bilgileri için kullanılacak store
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // Resim seçimi için kütüphane
import moment from "moment"; // Tarih ve saat formatlama için kütüphane

export default function Chat() {
	const { colors } = useTheme(); // Temaya erişim
	const { user } = useAuthStore(); // Kullanıcı bilgilerine erişim

	// State değişkenleri
	const [messages, setMessages] = useState([]); // Mesajları saklamak için state
	const [text, setText] = useState(""); // Girdi metnini saklamak için state

	useEffect(() => {
		// Bileşen yüklendiğinde genel mesaj havuzundaki mesajları al
		fetchMessages();
	}, []);

	// API'den mesajları alır ve durumu günceller
	const fetchMessages = async () => {
		try {
			const response = await api.get("messages/general"); // Genel mesaj havuzuna ait endpoint
			const formattedMessages = response.data.map(formatMessage); // Mesajları formatla
			setMessages(formattedMessages); // State güncelle
		} catch (error) {
			console.error("Mesajlar alınamadı:", error); // Hata durumunda konsola yaz
		}
	};

	// Mesajı belirli bir formatta oluşturur
	const formatMessage = (msg) => ({
		_id: msg.id, // Mesajın ID'si
		text: msg.text, // Mesaj metni
		createdAt: new Date(msg.createdAt), // Mesajın oluşturulma tarihi
		user: { _id: msg.senderId, name: msg.senderName }, // Mesajı gönderen kullanıcı bilgileri
	});

	// Resim seçme işlevi
	const pickImage = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Medya kütüphanesi izni iste
		if (!permission.granted) {
			Alert.alert("İzin gerekmekte", "Dosya yüklemek için izin vermeniz gerekmektedir.");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 1,
			base64: true,
		});

		if (!result.canceled && isValidImageSize(result.assets[0].base64)) {
			// Resim boyutunu kontrol et
			// Resmi genel havuza gönder
			await api.post("messages/general/upload", { image: result.assets[0].base64 });
		} else {
			Alert.alert("Hata!", "Seçilen dosya 1MB'dan büyük olamaz."); // Hata durumu
		}
	};

	// Mesaj gönderme işlevi
	const onSend = async (newMessages = []) => {
		const message = newMessages[0]; // Yeni gelen mesajı al
		if (message?.text.trim()) {
			try {
				await api.post("messages/general", { text: message.text }); // Mesajı API üzerinden gönder
				setMessages((previousMessages) =>
					GiftedChat.append(previousMessages, {
						...message,
						user: { _id: user._id, name: user.name }, // Kullanıcı bilgileri ile birlikte ekle
					})
				);
				setText(""); // Mesaj metnini sıfırla
			} catch (error) {
				console.error("Mesaj gönderilemedi:", error); // Hata durumunda konsola yaz
			}
		}
	};

	// 1MB boyut kontrolü
	const isValidImageSize = (base64) => {
		const base64Size = (base64.length * 3) / 4 - (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
		return base64Size <= 1048576; // 1MB
	};

	// Mesaj giriş alanını render eder
	const renderInputToolbar = () => (
		<View style={styles.inputContainer}>
			<IconButton icon="image-outline" size={32} color={colors.primary} onPress={pickImage} />
			<TextInput
				mode="outlined"
				placeholder="Mesajınızı yazın..."
				placeholderTextColor="#71727A4D"
				value={text}
				onChangeText={setText}
				style={styles.textInput}
			/>
			<IconButton
				icon={() => <Ionicons name="paper-plane" size={28} color="white" />}
				size={22}
				color="white"
				style={styles.sendButton}
				disabled={!text.trim()} // Mesaj boşsa butonu devre dışı bırak
				onPress={() => onSend([{ text, _id: Math.random().toString(36).substring(7), createdAt: new Date() }])} // Mesajı gönder
			/>
		</View>
	);

	return (
		<View style={styles.container}>
			<GiftedChat
				messages={messages}
				onSend={onSend}
				user={{ _id: user._id, name: user.name }} // Kullanıcı bilgileri
				renderAvatar={null} // Avatar'ı gizle
				renderInputToolbar={renderInputToolbar} // Giriş alanını render et
				style={{ backgroundColor: colors.background }} // Arka plan rengi
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#252525" },
	inputContainer: { flexDirection: "row", padding: 10, alignItems: "center" },
	textInput: { flex: 1, backgroundColor: "#1e1e1e" }, // Giriş alanı arka plan rengi
	sendButton: { backgroundColor: "primary", borderRadius: 16 }, // Gönder butonu stili
});
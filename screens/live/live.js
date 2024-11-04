import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";
import { Text, useTheme, IconButton, Divider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import YoutubeIframe from "react-native-youtube-iframe";
import { useAuthStore } from "../../store/auth";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import socket from "../../socket";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

const Live = () => {
	const theme = useTheme();
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");
	const [isPlaying, setIsPlaying] = useState(true);
	const playerRef = useRef(null);
	const { user } = useAuthStore();
	const videoId = "jfKfPfyJRdk";
	const receiverId = "admin";

	// Socket bağlantısı ve mesaj alma işlemleri
	useEffect(() => {
		socket.emit("join room", receiverId);
		socket.on("chat new", (newMessage) => {
			setMessages((previousMessages) =>
				GiftedChat.append(previousMessages, formatMessage(newMessage))
			);
		});
		socket.on("messages", (chatMessages) => {
			setMessages(chatMessages.map(formatMessage));
		});
		socket.emit("chat history");

		return () => {
			socket.emit("leave room");
			socket.off();
		};
	}, [receiverId]);

	// Sayfa odaklandığında videoyu oynat
	useFocusEffect(
		useCallback(() => {
			setIsPlaying(true);
			return () => setIsPlaying(false);
		}, [])
	);

	// Mesaj gönderme işlevi
	const onSend = (newMessages = []) => {
		const msg = newMessages[0];
		socket.emit("chat message", msg.text); // Mesajı socket ile gönder
		setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages)); // Mesajları güncelle
		setText(""); // Mesaj kutusunu temizle
	};

	// Mesaj kabarcıklarını özelleştir ve menü ekle (YouTube sohbet stili)
	const renderBubble = (props) => (
		<View style={styles.bubbleContainer}>
			{/* Kullanıcı Avatarı */}
			<Image
				source={{ uri: props.currentMessage.user.avatar }}
				style={styles.avatar}
			/>
			{/* Kullanıcı adı ve mesaj içeriği */}
			<View style={styles.messageContent}>
				<Text style={styles.userName}>{props.currentMessage.user.name}</Text>
				<Bubble
					{...props}
					wrapperStyle={{
						left: {
							backgroundColor: "transparent",
							borderWidth: 0.5,
							borderColor: theme.colors.description,
						},
						right: { backgroundColor: theme.colors.primary },
					}}
					textStyle={{ left: { color: "#fff" } }}
				/>
			</View>
			{/* Üç nokta menüsü */}
			<IconButton
				icon="dots-vertical"
				onPress={() => {
					props.currentMessage.user._id === user._id
						? handleDeleteMessage(props.currentMessage._id)
						: handleReportMessage(props.currentMessage);
				}}
				style={styles.menuButton}
			/>
		</View>
	);

	// Mesaj silme işlevi
	const handleDeleteMessage = (messageId) => {
		setMessages((prevMessages) =>
			prevMessages.filter((message) => message._id !== messageId)
		);
	};

	// Mesaj şikayet etme işlevi
	const handleReportMessage = (message) => {
		console.log(`Reported message: ${message.text}`);
		// Bildirim API'sine gönder veya UI'de geri bildirim göster
	};

	// Mesaj zamanını formatla
	const renderTime = ({ currentMessage }) => (
		<Text style={styles.timeText}>
			{moment(currentMessage.createdAt).format("HH:mm")}
		</Text>
	);

	// Mesaj giriş alanı ve gönderme butonu
	const renderInputToolbar = () => (
		<View style={styles.inputToolbar}>
			<TextInput
				placeholder="Yazmağa başlayın.."
				placeholderTextColor="#71727A4D"
				value={text}
				onChangeText={setText}
				style={styles.textInput}
			/>
			<IconButton
				icon={() => <Ionicons name="paper-plane" size={22} color="white" />}
				size={32}
				style={styles.sendButton}
				disabled={!text.trim()}
				onPress={() => onSend([{ text, user, createdAt: new Date(), _id: Date.now() }])}
			/>
		</View>
	);

	return (
		<View style={styles.container}>
			{/* Video Alanı */}
			<View style={{ pointerEvents: "none" }}>
				<YoutubeIframe
					ref={playerRef}
					height={240}
					videoId={videoId}
					play={isPlaying}
					onReady={() => console.log("Video hazır!")}
					onError={(error) => console.log("Error:", error)}
					webViewProps={{
						allowsInlineMediaPlayback: true,
						mediaPlaybackRequiresUserAction: false,
					}}
				/>
			</View>

			{/* Mesajlaşma Bölümü */}
			<View style={styles.chatSection}>
				<Text style={styles.subtitle}>Söhbət</Text>
				<Divider style={styles.divider} />
				<GiftedChat
					messages={messages}
					onSend={onSend}
					user={user}
					// renderAvatar={renderAvatar}
					renderInputToolbar={renderInputToolbar}
					renderBubble={renderBubble}
					renderTime={renderTime}
				/>
			</View>
		</View>
	);
};

// Yardımcı işlev: Mesaj formatını belirle
const formatMessage = (msg) => ({
	_id: msg._id,
	text: msg.text,
	createdAt: msg.createdAt,
	isReaded: msg.read,
	user: {
		name: msg.sender.name,
		_id: msg.sender._id,
		avatar: msg.sender.avatar, // Avatar URL'si ekledik
	},
	image: msg.fileURL,
});

// Stiller: YouTube sohbet tasarımına benzer olacak şekilde stil eklendi
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#252525" },
	subtitle: { color: "#B8860B", fontSize: 18, padding: 10},
	chatSection: { flex: 1, padding: 10 },
	inputToolbar: {
		flexDirection: "row",
		padding: 0,
		alignItems: "center",
	},
	textInput: {
		flex: 1,
		color: "#B8860B",
		paddingVertical: 15,
		fontSize: 16,
		backgroundColor: "#1e1e1e",
		borderRadius: 8,
		paddingHorizontal: 10,
	},
	sendButton: {
		backgroundColor: "#B8860B",
		padding: 10,
		borderRadius: 8,
		marginLeft: 8,
	},
	bubbleContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 5,
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		marginRight: 8,
	},
	messageContent: {
		flex: 1,
	},
	userName: {
		color: "gray",
		fontSize: 12,
	},
	menuButton: {
		marginLeft: 4,
	},
	timeText: {
		color: "#000",
		fontSize: 12,
		padding: 5,
	},
});

export default Live;
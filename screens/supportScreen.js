import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { io } from 'socket.io-client';
import { useAuthStore } from "../store/auth";

// API ve Socket URL'lerini yapılandırma
const API_URL = 'https://sizin-api-adresiniz.com'; // Buraya gerçek API adresinizi yazın
const SOCKET_URL = 'https://sizin-socket-adresiniz.com'; // Buraya gerçek Socket.io adresinizi yazın

const SupportScreen = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        connectSocket();
        fetchTickets();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const connectSocket = () => {
        try {
            const newSocket = io(SOCKET_URL, {
                auth: {
                    token: user.token
                },
                transports: ['websocket'],
                timeout: 10000,
            });

            newSocket.on('connect', () => {
                console.log('Socket.io bağlantısı başarılı');
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket bağlantı hatası:', error);
                Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanırken bir hata oluştu.');
            });

            newSocket.on('message', (newMessage) => {
                if (selectedTicket && selectedTicket.ticketId === newMessage.ticketId) {
                    setSelectedTicket(prev => ({
                        ...prev,
                        messages: [...prev.messages, newMessage]
                    }));
                }
            });

            setSocket(newSocket);
        } catch (error) {
            console.error('Socket başlatma hatası:', error);
            Alert.alert('Hata', 'Bağlantı kurulurken bir hata oluştu.');
        }
    };

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/tickets/user`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Destek talepleri alınamadı');
            }

            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Ticket getirme hatası:', error);
            Alert.alert('Hata', 'Destek talepleri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() || !selectedTicket) return;

        try {
            if (!socket?.connected) {
                Alert.alert('Bağlantı Hatası', 'Sunucu bağlantısı kurulamadı. Lütfen tekrar deneyin.');
                return;
            }

            socket.emit('send-message', {
                ticketId: selectedTicket.ticketId,
                message: message.trim(),
                sender: 'user'
            });

            // Mesajı hemen UI'da göster
            setSelectedTicket(prev => ({
                ...prev,
                messages: [...prev.messages, {
                    message: message.trim(),
                    sender: 'user',
                    timestamp: new Date().toISOString()
                }]
            }));

            setMessage('');
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);
            Alert.alert('Hata', 'Mesaj gönderilemedi. Lütfen tekrar deneyin.');
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!selectedTicket ? (
                <>
                    <Text style={styles.header}>Destek Talepleri</Text>
                    {tickets.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <Text>Henüz destek talebi bulunmuyor.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={tickets}
                            keyExtractor={(item) => item.ticketId}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.ticketItem}
                                    onPress={() => setSelectedTicket(item)}
                                >
                                    <Text style={styles.ticketId}>#{item.ticketId}</Text>
                                    <Text style={styles.ticketStatus}>{item.status}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </>
            ) : (
                <View style={styles.chatContainer}>
                    <View style={styles.chatHeader}>
                        <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                            <Text style={styles.backButton}>← Geri</Text>
                        </TouchableOpacity>
                        <Text style={styles.ticketTitle}>Talep #{selectedTicket.ticketId}</Text>
                    </View>
                    <FlatList
                        data={selectedTicket.messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={[
                                styles.messageContainer,
                                item.sender === 'user' ? styles.userMessage : styles.supportMessage
                            ]}>
                                <Text style={styles.messageText}>{item.message}</Text>
                                <Text style={styles.messageTime}>
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </Text>
                            </View>
                        )}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Mesajınızı yazın..."
                            placeholderTextColor="#666"
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                            onPress={sendMessage}
                            disabled={!message.trim()}
                        >
                            <Text style={styles.sendButtonText}>Gönder</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 15,
        backgroundColor: '#fff'
    },
    ticketItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ticketId: {
        fontSize: 16,
        fontWeight: '500'
    },
    ticketStatus: {
        fontSize: 14,
        color: '#666'
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
        marginRight: 15
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: '500'
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        maxWidth: '80%'
    },
    userMessage: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end'
    },
    supportMessage: {
        backgroundColor: '#E8E8E8',
        alignSelf: 'flex-start'
    },
    messageText: {
        color: '#fff',
        fontSize: 16
    },
    messageTime: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 5
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff'
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        marginRight: 10,
        fontSize: 16
    },
    sendButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        minWidth: 70,
        alignItems: 'center'
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc'
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16
    }
});

export default SupportScreen;
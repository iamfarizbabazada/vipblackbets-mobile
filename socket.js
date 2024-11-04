import { io } from 'socket.io-client';
import { Alert } from 'react-native';

const SOCKET_URL = 'http://192.168.1.89:8080';

const connectSocket = () => {
    try {
        // Socket options - sadece WebSocket kullan
        const socketOptions = {
            auth: {
                token: user.token
            },
            transports: ['websocket'], // Sadece WebSocket kullan
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            forceNew: true,
            autoConnect: false,
            path: '/socket.io/', // Path'i belirt
            secure: false, // HTTP için false
        };

        console.log('Bağlantı deneniyor:', SOCKET_URL);

        // Socket instance oluştur
        const socket = io(SOCKET_URL, socketOptions);

        // Debug için tüm events'leri dinle
        socket.onAny((event, ...args) => {
            console.log('[Socket Event]:', event, args);
        });

        // Bağlantı event handlers
        socket.on('connect', () => {
            console.log('[Socket] Bağlantı başarılı - ID:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('[Socket] Bağlantı hatası:', {
                message: error.message,
                description: error.description,
                type: error.type,
                context: error.context
            });
        });

        socket.on('error', (error) => {
            console.error('[Socket] Genel hata:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket] Bağlantı kesildi:', reason);
            if (reason === 'io server disconnect') {
                setTimeout(() => {
                    console.log('[Socket] Yeniden bağlanıyor...');
                    socket.connect();
                }, 1000);
            }
        });

		fetch('http://192.168.1.89:8080/health')
    .then(response => response.json())
    .then(data => console.log('Server erişilebilir:', data))
    .catch(error => console.error('Server erişim hatası:', error));

        // Manuel olarak bağlantıyı başlat
        socket.connect();

        // State'e kaydet
        setSocket(socket);

        // Cleanup function
        return () => {
            if (socket) {
                socket.removeAllListeners();
                socket.close();
                console.log('[Socket] Bağlantı kapatıldı');
            }
        };

    } catch (error) {
        console.error('[Socket] Başlatma hatası:', error);
        Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanırken bir hata oluştu.');
        return () => {};
    }
};

export default connectSocket;
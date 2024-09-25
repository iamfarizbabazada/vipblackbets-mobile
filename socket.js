import io from 'socket.io-client';
import { baseUrl, wssUrl } from './lib/api';


const socket = io(wssUrl, {
  transports: ['websocket'],
  secure: false,
  // jsonp: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  autoConnect: true,
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});

socket.on('connect_error', (error) => {
  console.error('Bağlantı hatası:', error);
});

// Diğer hataları dinleme
socket.on('error', (error) => {
  console.error('Socket hatası:', error);
});

// Başarılı bağlantı
socket.on('connect', () => {
  console.log('Başarıyla bağlandı!');
});

export default socket
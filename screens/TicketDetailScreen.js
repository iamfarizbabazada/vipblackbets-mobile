import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../lib/api';
import * as Notifications from 'expo-notifications';

const TicketDetailScreen = () => {
  const route = useRoute();
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();
  
  useEffect(() => {
    fetchTicketDetails();
    setupNotifications();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      setTicket(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Ticket detayları alınamadı:', error);
      setLoading(false);
    }
  };

  const setupNotifications = async () => {
    const permission = await Notifications.requestPermissionsAsync();
    if (permission.granted) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await api.post(`/tickets/${ticketId}/messages`, {
        content: message
      });
      setMessage('');
      fetchTicketDetails();
      scrollViewRef.current?.scrollToEnd();
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ticket Header */}
      <View style={styles.header}>
        <Text style={styles.ticketId}>{ticket?.ticketId}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(ticket?.status) }
        ]}>
          <Text style={styles.statusText}>{ticket?.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* Subject */}
      <View style={styles.subjectContainer}>
        <Text style={styles.subjectLabel}>Konu:</Text>
        <Text style={styles.subject}>{ticket?.subject}</Text>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {ticket?.messages.map((msg, index) => (
          <View 
            key={index}
            style={[
              styles.messageBox,
              msg.sender._id === ticket.userId 
                ? styles.userMessage 
                : styles.adminMessage
            ]}
          >
            <Text style={styles.messageSender}>
              {msg.sender.username}
            </Text>
            <Text style={styles.messageContent}>
              {msg.content}
            </Text>
            <Text style={styles.messageTime}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Mesajınızı yazın..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ticketId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subjectLabel: {
    fontSize: 14,
    color: '#666',
  },
  subject: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
  },
  adminMessage: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TicketDetailScreen;
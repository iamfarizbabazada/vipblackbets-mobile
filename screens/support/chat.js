import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {useRoute} from '@react-navigation/native' 
import { GiftedChat } from "react-native-gifted-chat";
import { IconButton, useTheme } from "react-native-paper";
import { Input as TextInput } from '../../components/input';
import socket from '../../socket'
import {useAuthStore} from '../../store/auth'

export default function Chat() {
  const route  = useRoute()
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { colors } = useTheme();
  const {user} = useAuthStore()

  const receiverId = route.params.admin?._id

  useEffect(() => {
    socket.emit('join room', receiverId);

    socket.on('chat new', (newMessage) => {
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
    });

    socket.on('messages', (chatMessages) => {
      const formattedMessages = chatMessages.map((msg) => ({
        _id: msg._id,
        text: msg.text,
        createdAt: msg.createdAt,
        user: {
          _id: msg.sender._id,
          name: msg.sender.name, // Make sure to include name in your message model
        },
      }));
      setMessages(formattedMessages);
    });

    socket.emit('chat history');

    return () => {
      socket.emit('leave room');
      socket.off();
    };
  }, [receiverId]);

  const onSend = (newMessages = []) => {
    const message = newMessages[0];
    socket.emit('chat message', message.text);
    setMessages((previousMessages) => GiftedChat.append(previousMessages, message));
  };


  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          mode="outlined"
          placeholder="Type your message here... 🚀⭐"
          value={text}
          onChangeText={setText}
          outlinedStyle={{ flex: 1  }}
        />
        <IconButton
          icon="send"
          mode="contained"
          size={40}
          disabled={text.length === 0}
          onPress={() => {
            if (text.trim().length > 0) {
              onSend([{ text, user: { _id: 1 }, createdAt: new Date(), _id: Math.random().toString(36).substring(7) }]);
              setText("");
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: user?._id }}
        renderInputToolbar={renderInputToolbar}
        style={{ backgroundColor: colors.background }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
});

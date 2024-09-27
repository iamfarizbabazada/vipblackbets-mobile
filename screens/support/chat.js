import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {useRoute} from '@react-navigation/native' 
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Input as TextInput } from '../../components/input';
import socket from '../../socket'
import {useAuthStore} from '../../store/auth'
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';


export default function Chat() {
  const route  = useRoute()
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { colors } = useTheme();
  const {user} = useAuthStore()

  const receiverId = route.params.admin?._id
  console.log(receiverId)

  useEffect(() => {
    socket.emit('join room', receiverId);

    socket.on('chat new', (newMessage) => {
      setMessages((previousMessages) => GiftedChat.append(newMessage, previousMessages ));
    });

    socket.on('messages', (chatMessages) => {
      const formattedMessages = chatMessages.map((msg) => ({
        _id: msg._id,
        text: msg.text,
        createdAt: msg.createdAt,
        isReaded: msg.read,
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

  
  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
      base64: true
    });

    const base64Size = (result.assets[0].base64.length * (3 / 4)) - (result.assets[0].base64.endsWith('==') ? 2 : result.assets[0].base64.endsWith('=') ? 1 : 0);
      
      if (base64Size > 1048576) { // 1 MB = 1048576 bytes
        alert("Selected image exceeds the 1MB size limit.");
        return;
      }

      if (!result.canceled) {
      socket.emit('upload file', result.assets[0].base64)
    }
  };


const onSend = (newMessages = []) => {
  const msg = newMessages[0];
  // Use the user's ID here
  socket.emit('chat message', msg.text);
  setMessages((previousMessages) => GiftedChat.append(previousMessages, {
    ...msg,
    user: {
      _id: user._id, // Replace with actual user's ID
      name: user.name // You may want to include the user's name as well
    }
  }));
};


  const renderBubble = (props) => {
    const { currentMessage } = props;
  
    return (
      <View>
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: colors.description },
          right: { backgroundColor: colors.primary },
        }}
        >
        <View style={styles.bubbleContainer}>
          <Text style={{ fontWeight: 'bold', color: 'black' }}>{currentMessage.user.name}</Text>
          <Text style={styles.bubbleText}>{currentMessage.text}</Text>
        </View>
      </Bubble>
        </View>
    );
  };
  


  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <IconButton
          icon={() => <Ionicons name="add" size={32} color={colors.primary} />}
          size={32}
          onPress={pickImage}
        />
        <TextInput
          mode="outlined"
          placeholder="Type your message here... 🚀⭐"
          value={text}
          onChangeText={setText}
          style={{flex: 1}}
        />
        <IconButton
          icon={() => <Ionicons name="paper-plane" size={22} color="white" />}
          mode="contained"
          size={32}
          style={{backgroundColor: colors.primary}}
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
        user={user}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
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
  bubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bubbleText: {
    color: 'white',
  },
  readText: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
});

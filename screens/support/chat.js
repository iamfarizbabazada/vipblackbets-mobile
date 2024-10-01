import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {useNavigation, useRoute} from '@react-navigation/native' 
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Input as TextInput } from '../../components/input';
import socket from '../../socket'
import {useAuthStore} from '../../store/auth'
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import moment from "moment";


export default function Chat() {
  const route  = useRoute()
  const navigation = useNavigation()
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { colors } = useTheme();
  const {user} = useAuthStore()

  const receiverId = route.params.admin?._id

  useEffect(() => {
    navigation.setOptions({headerTitle: route.params.admin?.name})

    socket.emit('join room', receiverId);

    socket.on('chat new', (newMessage) => {
      setMessages((previousMessages) => GiftedChat.append(previousMessages, {
        _id: newMessage._id,
        image: newMessage.fileURL,
        text: newMessage.text,
        createdAt: newMessage.createdAt,
        isReaded: newMessage.read,
        user: {
          name: newMessage.sender.name,
          _id: newMessage.sender._id
        },
      } ));
    });

    socket.on('messages', (chatMessages) => {
      console.log(chatMessages)

      const formattedMessages = chatMessages.map((msg) => ({
        _id: msg._id,
        text: msg.text,
        createdAt: msg.createdAt,
        isReaded: msg.read,
        user: {
          name: msg.sender.name,
          _id: msg.sender._id,
        },
        image: msg.fileURL
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
  // setMessages((previousMessages) => GiftedChat.append(previousMessages, {
  //   ...msg,
  //   user: {
  //     _id: user._id, // Replace with actual user's ID
  //     name: user.name // You may want to include the user's name as well
  //   }
  // }));
};


  const renderBubble = (props) => {
    const { currentMessage } = props;
  
    return (
      <View>
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: 'transparent', borderWidth: .5, borderColor: colors.description },
          right: { backgroundColor: colors.primary },
        }}
        textStyle={{left: { color: '#fff'}}}
        >
        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleText}>{currentMessage.text}</Text>
        </View>
      </Bubble>
        </View>
    );
  };

  
  const renderTime = (props) => {
    // Use moment to format the time in 24-hour format
    return (
      <View style={{padding: 5}}>
        <Text style={{ color: 'gray', fontSize: 12 }}>
        {moment(props.currentMessage.createdAt).format('HH:mm')}
      </Text>
      </View>
    );
  }

  


  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', gap: 5 }}>
        <IconButton
          icon={() => <Ionicons name="image-outline" size={32} color={colors.primary} />}
          size={32}
          onPress={pickImage}
        />
        <TextInput
          mode="outlined"
          placeholderTextColor={'#71727A4D'}
          placeholder="Yazmağa başlayın.."
          value={text}
          onChangeText={setText}
          style={{flex: 1}}
        />
        <IconButton
          icon={() => <Ionicons name="paper-plane" size={22} color="white" />}
          mode="contained"
          size={32}
          style={{backgroundColor: colors.primary, borderRadius: 16}}
          disabled={text.length === 0}
          onPress={() => {
            if (text.trim().length > 0) {
              onSend([{ text, user: { _id: user._id, name: user.name}, createdAt: new Date(), _id: Math.random().toString(36).substring(7) }]);
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
        renderAvatar={(props) => {
          return null;
        }}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
        renderTime={renderTime}
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
    color: 'red',
  },
  readText: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
});

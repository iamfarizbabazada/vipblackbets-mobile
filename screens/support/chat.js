import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { IconButton, useTheme } from "react-native-paper";
import { Input as TextInput } from '../../components/input';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { colors } = useTheme();

  const onSend = (newMessages) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TextInput
          mode="outlined"
          placeholder="Type your message here... 🚀⭐"
          value={text}
          onChangeText={setText}
          style={{ flex: 1 }}
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
        user={{ _id: 1 }}
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

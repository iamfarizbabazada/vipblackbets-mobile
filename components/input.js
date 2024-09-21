import { StyleSheet } from 'react-native'
import { TextInput as PaperInput } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'


export function Input({style, ...props}) {
  const combinedStyles = [styles.input, style]
  
  return <PaperInput mode='outlined' outlineStyle={{borderRadius: 16}} style={combinedStyles} {...props} />
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    paddingLeft: 10
  }
});


export function Password({style, ...props}) {
  const combinedStyles = [styles.input, style]
  const [eye, setEye] = useState(true)

  return <PaperInput
    secureTextEntry={eye}
    mode='outlined' 
    outlineStyle={{borderRadius: 16}} 
    style={combinedStyles} 
    {...props} 
    right={<PaperInput.Icon icon={eye ? 'eye' : 'eye-off'} onPress={() => setEye(!eye)} />} 
  />
}

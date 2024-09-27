import { StyleSheet } from 'react-native'
import { TextInput as PaperInput } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'


export function Input({style, outlineStyle, ...props}) {
  const combinedStyles = [styles.input, style]
  const combinedOutlineStyles = [styles.outline, outlineStyle]
  
  return <PaperInput mode='outlined' outlineStyle={combinedOutlineStyles} style={combinedStyles} {...props} />
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    paddingLeft: 10
  },
  outline: {
    borderRadius: 16
  }
});


export function Password({style, outlineStyle,...props}) {
  const combinedStyles = [styles.input, style]
  const combinedOutlineStyles = [styles.outline, outlineStyle]
  const [eye, setEye] = useState(true)

  return <PaperInput
    secureTextEntry={eye}
    mode='outlined' 
    outlineStyle={combinedOutlineStyles} 
    style={combinedStyles} 
    {...props} 
    right={<PaperInput.Icon icon={eye ? 'eye' : 'eye-off'} onPress={() => setEye(!eye)} />} 
  />
}

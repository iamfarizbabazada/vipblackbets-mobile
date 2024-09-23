import { Ionicons } from '@expo/vector-icons'
import { View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { IconButton, RadioButton, Text, TextInput, useTheme } from 'react-native-paper'

export default function FormStatus({form}) {
  const theme = useTheme()

  return (
    <View style={{alignItems: 'center', gap: 10}}>
      <Ionicons name='wallet' color={theme.colors.accent} size={100} />
      <View style={{flexDirection: 'row'}}>
      <Ionicons name='checkmark' color={theme.colors.primary} size={42} />
      <Text variant='displaySmall' style={{color: theme.colors.primary, fontWeight: 'bold'}}>UĞURLU</Text>
      </View>
      <Text variant='bodySmall' style={{color: theme.colors.description}}>Ödəniş uğurlu oldu!</Text>
    </View>
  )
}

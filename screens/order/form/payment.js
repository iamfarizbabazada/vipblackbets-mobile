import { View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { IconButton, RadioButton, Text, useTheme } from 'react-native-paper'

export default function FormPayment({form}) {
  const theme = useTheme()

  const providers = [
    {
      name: 'MASTERCARD',
      card: 'xxxx xxxx xxxx 1234',
    },
    {
      name: 'M10',
      card: 'xxxx xxxx xxxx 1234',
    },
    {
      name: 'MPay',
      card: 'xxxx xxxx xxxx 1234',
    },
  ]

  const selected = form.values.paymentType

  return (
    <ScrollView>
      {providers.map((provider, indx) => (
        <TouchableOpacity activeOpacity={.8} onPress={() => form.setFieldValue('paymentType', provider.name)} style={{ marginVertical: 10, gap: 10, borderWidth: .5,borderColor: selected == provider.name ? theme.colors.primary : theme.colors.accent, borderRadius: 25, paddingVertical: 20, paddingHorizontal: 10}}>
          <RadioButton color={theme.colors.primary} uncheckedColor={theme.colors.accent} status={selected == provider.name ? 'checked' : 'unchecked'} />
          <View style={{padding: 20, backgroundColor: selected == provider.name ? theme.colors.primary : theme.colors.accent, borderRadius: 15}}>
            <Text style={{color: 'black'}}>{provider.name}</Text>
            <Text style={{color: 'black'}}>{provider.card}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}



import { View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { IconButton, RadioButton, Text, useTheme } from 'react-native-paper'

import image1 from '../../../assets/images/providers/1.png'
import image2 from '../../../assets/images/providers/2.png'
import image3 from '../../../assets/images/providers/3.png'

export default function FormProvider({form}) {
  const theme = useTheme()

  const providers = [
    {
      name: 'MOSTBET',
      image: image1,
    },
    {
      name: 'MELBET',
      image: image2,
    },
    {
      name: '1XBET',
      image: image3,
    },
  ]

  const selected = form.values.provider

  return (
    <ScrollView>
      {providers.map((provider, indx) => (
        <TouchableOpacity activeOpacity={.8} onPress={() => form.setFieldValue('provider', provider.name)} style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center', gap: 10, backgroundColor: selected == provider.name ? theme.colors.primary : theme.colors.accent, borderRadius: 25, paddingVertical: 20, paddingHorizontal: 10}}>
          <RadioButton color='black' uncheckedColor='#252525' status={selected == provider.name ? 'checked' : 'unchecked'} />
          <Image source={provider.image} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}



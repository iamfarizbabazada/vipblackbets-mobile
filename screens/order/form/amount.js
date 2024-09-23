import { View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { IconButton, RadioButton, Text, TextInput, useTheme } from 'react-native-paper'

import image1 from '../../../assets/images/providers/1.png'
import image2 from '../../../assets/images/providers/2.png'
import image3 from '../../../assets/images/providers/3.png'

export default function FormAmount({form}) {
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

  const selectedProvider = providers.find(prov => prov.name == selected)

  return (
    <ScrollView>
     <View style={{borderRadius: 25,backgroundColor: theme.colors.primary, padding: 40, gap: 15}}>
      <Image width={'100%'} source={selectedProvider.image} />
      <AmountInput form={form} />
     </View>
    </ScrollView>
  )
}


function AmountInput({form}) {
  const theme = useTheme()

  return (
    <View style={{}}>
      <View>
      <TextInput
      mode="outlined"
      keyboardType='number-pad'
      outlineStyle={{
        borderRadius: 25,
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.primary
      }}
      onChangeText={(text) => form.setFieldValue('amount', parseFloat(text))}
      cursorColor={theme.colors.primary}
      />
      </View>
      {/* <Text variant='displayMedium' style={{ color: theme.colors.accent, fontWeight: 'bold'}}>₼</Text> */}
    </View>
  )
}
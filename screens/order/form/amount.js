import { View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { IconButton, RadioButton, Text, TextInput, useTheme } from 'react-native-paper'
import * as DocumentPicker from 'expo-document-picker';
import {Button} from '../../../components/button'

import image1 from '../../../assets/images/providers/1.png'
import image2 from '../../../assets/images/providers/2.png'
import image3 from '../../../assets/images/providers/3.png'

export default function FormAmount({form, setFile}) {
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

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'], // Allow images and PDFs
        copyToCacheDirectory: true, // Copy file to cache directory
        multiple: false
      });
      

      if (!result.canceled) {
        setFile(result.assets[0]);
      } else {
        Alert.alert('No file selected');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'File picking failed!');
    }
  };

  return (
    <ScrollView>
     <View style={{borderRadius: 25,backgroundColor: theme.colors.primary, padding: 40, gap: 15}}>
      <Image width={'100%'} source={selectedProvider.image} />
      <AmountInput form={form} />
     </View>
      <Button style={{marginVertical: 15, backgroundColor: theme.colors.accent}} mode='contained' onPress={handleChooseFile} >
        Qəbzi yüklə
      </Button>
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
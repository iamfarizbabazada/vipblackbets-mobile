import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { IconButton, RadioButton, Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import * as Clipboard from 'expo-clipboard';

const validationSchema = Yup.object({
  paymentType: Yup.string().required(),
  amount: Yup.number().min(1)
})

const PaymentType = ({selected, provider, form, handleSelect, handleCopy}) => {
  const theme = useTheme()

  return (
    <TouchableOpacity activeOpacity={.8} onPress={() => handleSelect(provider)} style={{ marginVertical: 10, gap: 10, borderWidth: .5,borderColor: selected == provider.name ? theme.colors.primary : theme.colors.accent, borderRadius: 25, paddingVertical: 10, paddingHorizontal: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton color={theme.colors.primary} uncheckedColor={theme.colors.accent} status={selected == provider.name ? 'checked' : 'unchecked'} />
            <Text style={{color: theme.colors.primary, fontSize: 18, fontWeight: 'bold'}}>{provider.name}</Text>
          </View>
          {selected == provider.name && (
            <>
            <View style={{paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'space-between', flexDirection: 'row', flex: 1, borderWidth: 1, alignItems: 'center', borderColor: selected == provider.name ? theme.colors.accent : theme.colors.accent, borderRadius: 15}}>
            <Text style={{color: theme.colors.primary, fontSize: 16, borderRightWidth: .5, borderRightColor: theme.colors.primary, paddingRight: 10}}>{provider.card}</Text>
            <Button icon={()=> <Ionicons name='clipboard-outline' color={theme.colors.primary} size={18} />} onPress={() => handleCopy(provider)}>Kopyala</Button>
            </View>
            
            <View>
              <AmountInput form={form} />
            </View>
            </>
          )}
    </TouchableOpacity>
  )
}

function AmountInput({form}) {
  const theme = useTheme()

  return (
    <View style={{}}>
      <View>
      <Input
      label="Məbləğ"
      mode="outlined"
      value={isNaN(form.values?.amount?.toString()) ? '0' : form.values?.amount?.toString()}
      keyboardType='number-pad'
      onChangeText={(text) => form.setFieldValue('amount', parseFloat(text))}
      cursorColor={theme.colors.primary}
      />
      </View>
      <Text variant='titleSmall' style={{ color: theme.colors.accent, fontWeight: 'bold'}}>Balans artımı üçün komissiya yoxdur</Text>
    </View>
  )
}


export default function BalanceCreate() {
  const navigation = useNavigation()
  const theme = useTheme()
  const { user, fetchUser } = useAuthStore()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(false)

  const formik = useFormik({
    initialValues: {
      paymentType: 'Bank Kartına köçürmə',
      amount: 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const formData = new FormData()
        
        formData.append('paymentType', values.paymentType)
        formData.append('amount', values.amount)

        console.log(file);
        
        if(file) {
          console.log('girdi')
          const formFile = {
            uri: file.uri,
            type: file.mimeType,
            name: file.name
          }

          formData.append('file', formFile)
        }

        await api.post('/profile/pay/balance', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        await fetchUser()
        navigation.navigate('ProfileList')
        setPage(page +1)
      } catch(err) {
        console.error(err.response?.data)
      }
      setLoading(false)
    }
  })

  const providers = [
    {
      name: 'Bank Kartına köçürmə',
      card: '0595 5432 2423 1234',
    },
    {
      name: 'M10',
      card: '+994 55 515 82 83',
    },
    {
      name: 'MPay',
      card: '4525 5332 2483 2235',
    },
  ]

  const selected = formik.values.paymentType

  
  const copyToClipboard = async (provider) => {
    await Clipboard.setStringAsync(provider.card);
  };

  const handleSelect = (provider) => {
    formik.setFieldValue('paymentType', provider.name)
  }

  // const renderBalanceError = useCallback(() => {
  //   if(formik.values.amount > user.currentBalance ) return (
  //     <Text style={{padding: 20, borderRadius: 16, backgroundColor: theme.colors.accent}}>Balansda kifayət qədər məbləğ yoxdur</Text>
  //   )

  // }, [formik.values.amount, user?.currentBalance])

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <View style={styles.display}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text variant='titleLarge' style={{fontWeight: 'bold', color: theme.colors.primary}}>Balans artır</Text>
            <Text variant='titleMedium' style={{color: theme.colors.description}}>Mövcud balans: {user.currentBalance}₼</Text>
          </View>
          <Text variant='titleMedium' style={{color: theme.colors.accent}}>Balans artırmaq növünü seçin</Text>
        </View>

        <ScrollView>
      {providers.map((provider, indx) => (
        <PaymentType form={formik} provider={provider} handleCopy={copyToClipboard} handleSelect={handleSelect} selected={selected} key={indx} />
      ))}
    </ScrollView>

        <Button loading={loading} mode='contained' onPress={formik.handleSubmit}>
          Təsdiqlə
        </Button>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525'
  },
  image: {
    width: '100%',
    height: '65%',
    objectFit: 'cover'
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    gap: 10
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2F2F2F',
    padding: 20,
  },
  display: {
    gap: 10
  },
});
import { View, Image, StyleSheet, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Checkbox, Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'
import { OtpInput } from "react-native-otp-entry";
import { Input, Password } from '../../components/input'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useAuthStore } from '../../store/auth'
import { useState } from 'react'

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  otp: Yup.string().min(4).max(4).required(),
})

export default function RegisterVerify() {
  const navigation = useNavigation()
  const route = useRoute()
  const { email } = route.params
  const theme = useTheme()
  const { verify, resetOtp } = useAuthStore()
  const [err, setErr] = useState(null)
  
  const formik = useFormik({
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await verify(values)
        navigation.navigate('Login')
      } catch(err) {
        setErr(err.response?.data?.message)
      }
    },
    initialValues: {
      otp: '',
      email: email,
    }
  })

  const resendOtp = async () => {
    try {
      await resetOtp({email})
    } catch(err) {
      console.error(err.response?.data?.message)
    }
  }

  return (
    <View style={styles.container}>
          
        
        {err && <Text style={{color: theme.colors.error}} variant='bodySmall'>{err}</Text>}

        <View style={styles.display}>
          <Text style={{color: theme.colors.primary}} variant='titleLarge'>Təsdiqləmə Kodunu Daxil Et</Text>
          <Text style={{color: theme.colors.description, textAlign: 'center', marginBottom: 40}} variant='bodySmall'>
          4 rəqəmli təsdiqləmə kodu {'\n'}
          {email} ünvanına göndərildi!
          </Text>

          {/* <Input error={formik.errors.email} keyboardType='email-address' label="E-poçt ünvanı" value={formik.values.email} onChangeText={formik.handleChange('email')} /> */}
          <OtpInput numberOfDigits={4} 
          theme={{
            focusStickStyle: {backgroundColor: theme.colors.primary}, 
            focusedPinCodeContainerStyle: {borderColor: theme.colors.primary,},
            filledPinCodeContainerStyle: {borderColor: theme.colors.accent},
            pinCodeTextStyle: {color: theme.colors.accent},
            pinCodeContainerStyle: {width: 70}
          }} 
          onTextChange={(text) => formik.setFieldValue('otp', text, true)} />
        </View>

        <View>
          <Button mode='text' onPress={resendOtp}>
          Yenidən göndər
          </Button>
          <Button mode='contained' onPress={formik.handleSubmit}>
            Təsdiqlə
          </Button>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#252525',
    justifyContent: 'space-between'
  },
  display: {
    gap: 10,
    marginTop: '30%',
    marginBottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%'
  },
});
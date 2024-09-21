import { View, Image, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'
import { Input, Password } from '../../components/input'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import coverImage from '../../assets/images/login.jpg'
import { useAuthStore } from '../../store/auth'
import { useState } from 'react'

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required()
})

export default function Login() {
  const navigation = useNavigation()
  const theme = useTheme()
  const { login } = useAuthStore()
  const [err, setErr] = useState(null)
  
  const formik = useFormik({
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values)
        navigation.navigate('Home')
      } catch(err) {
        if(err.response?.data?.action == 'VERIFICATION') return navigation.navigate('RegisterVerify', {email: values.email})
        setErr(err.response?.data?.message)
      }
    },
    initialValues: {
      email: '',
      password: ''
    }
  })


  return (
    <View style={styles.container}>
      <Image style={styles.image} source={coverImage} />
      
      <View style={styles.actionContainer}>
        <Text style={{color: theme.colors.primary, marginVertical: 10}} variant='titleLarge'>Xoş Gəldin!</Text>
        {err && <Text style={{color: theme.colors.error}} variant='bodySmall'>{err}</Text>}

        <View style={styles.display}>
          <Input error={formik.errors.email} keyboardType='email-address' label="E-poçt ünvanı" value={formik.values.email} onChangeText={formik.handleChange('email')} />
          <Password error={formik.errors.password} label="Şifrə" value={formik.values.password} onChangeText={formik.handleChange('password')} />

          <Text style={{color: theme.colors.primary}} variant='bodySmall' onPress={() => navigation.navigate('Onboarding')}>Şifrəni unutdun?</Text>
        </View>

        <Button mode='contained' onPress={formik.handleSubmit}>
          Daxil ol
        </Button>

        <Text style={{alignSelf: 'center', color: theme.colors.description}} variant='bodyMedium'>Hesabın yoxdur? <Text style={{color: theme.colors.primary}} onPress={() => navigation.navigate('Register')}>Qeydiyyatdan Keç</Text></Text>
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
    height: '40%'
  },
  actionContainer: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  display: {
    gap: 10,
    marginBottom: 20
  },
});
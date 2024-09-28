import { View, Image, StyleSheet, Alert, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'
import { Input, Password } from '../../components/input'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import coverImage from '../../assets/images/login.jpg'
import { useState } from 'react'

import api from '../../lib/api'

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
})


export default function ForgetPassword() {
  const navigation = useNavigation()
  const theme = useTheme()
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {
      setLoading(true)
      try {
        await api.post('/auth/password/request', {email: values.email})
        navigation.navigate('ResetPassword', {email: values.email})
        resetForm()
      } catch(err) {
        setErr(err.response?.data?.message)
      }
      setLoading(false)
    },
    initialValues: {
      email: '',
    }
  })


  return (
    <View style={styles.container}>
      <Image style={styles.image} source={coverImage} />
      
      <View style={styles.actionContainer}>
        <Text style={{color: theme.colors.primary, marginVertical: 10}} variant='titleLarge'>Şifrəni Yenilə!</Text>
        {err && <Text style={{color: theme.colors.error}} variant='bodySmall'>{err}</Text>}

        <View style={styles.display}>
          <Input error={formik.errors.email} keyboardType='email-address' label="E-poçt ünvanı" value={formik.values.email} onChangeText={formik.handleChange('email')} />
        </View>

        <Button mode='contained' loading={loading} onPress={formik.handleSubmit}>
          Yenilə
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
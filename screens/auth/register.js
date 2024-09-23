import { View, Image, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Checkbox, Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'
import { Input, Password } from '../../components/input'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useAuthStore } from '../../store/auth'
import { useState } from 'react'

const validationSchema = Yup.object({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required('Onay şifresi gereklidir'),
  check: Yup.boolean().isTrue()
})

export default function Register() {
  const navigation = useNavigation()
  const theme = useTheme()
  const { register } = useAuthStore()
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const formik = useFormik({
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        await register(values)
        navigation.navigate('RegisterVerify', {email: values.email})
      } catch(err) {
        setErr(err.response?.data?.message)
      }
      setLoading(false)
    },
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmpassword: '',
      check: false
    }
  })


  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <View style={{marginVertical: 10, gap: 5}}>
          <Text style={{color: theme.colors.primary}} variant='titleLarge'>Qeydiyyatdan Keç</Text>
          <Text style={{color: theme.colors.description}} variant='bodySmall'>Başlamaq üçün yeni hesab açın!</Text>
        </View>
        
        {err && <Text style={{color: theme.colors.error}} variant='bodySmall'>{err}</Text>}

        <View style={styles.display}>
          <Input error={formik.errors.name} label="Ad Soyad" value={formik.values.name} onChangeText={formik.handleChange('name')} />
         
          <Input error={formik.errors.email} keyboardType='email-address' label="E-poçt ünvanı" value={formik.values.email} onChangeText={formik.handleChange('email')} />
          <Password error={formik.errors.password} label="Şifrə" value={formik.values.password} onChangeText={formik.handleChange('password')} />
          <Password error={formik.errors.confirmpassword} label="Şifrənin Təkrarı" value={formik.values.confirmpassword} onChangeText={formik.handleChange('confirmpassword')} />

          <View style={{flexDirection: 'row', width: '90%'}}>
            <Checkbox status={formik.values.check ? 'checked' : 'unchecked'} onPress={() => formik.setFieldValue('check', !formik.values.check, true)} />
            <Text>
            Qeydiyyatdan keçərək, Şərtlər & Qaydalar və Gizlilik Siyasəti ilə razılaşdığımı bildirirəm.
            </Text>
          </View>

        </View>

        <Button mode='contained' loading={loading} onPress={formik.handleSubmit}>
          Qeydiyyatdan Keç
        </Button>

        <Text style={{alignSelf: 'center', color: theme.colors.description}} variant='bodyMedium'>Hesabın var? <Text style={{color: theme.colors.primary}} onPress={() => navigation.navigate('Login')}>Daxil ol</Text></Text>
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
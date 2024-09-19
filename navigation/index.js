import AuthStack from './auth'
import MainStack from './main'
import { useAuthStore } from '../store/auth'


export default function Navigation() {
  const user = useAuthStore.getState().user
  
  if(!user) return <AuthStack />
  return <MainStack />
}
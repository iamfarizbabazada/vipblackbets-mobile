import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Onboarding from '../screens/auth/onboarding'
import Login from '../screens/auth/login';
import Register from '../screens/auth/register';
import RegisterVerify from '../screens/auth/register-verify';


const Stack = createStackNavigator();

export default function AuthStack ()  {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" options={{headerShown: false}} component={Onboarding} />
        <Stack.Screen name="Login" options={{headerTitle: 'Daxil ol'}} component={Login} />
        <Stack.Screen name="Register" options={{headerTitle: 'Qeydiyyat'}} component={Register} />
        <Stack.Screen name="RegisterVerify" options={{headerTitle: 'A'}} component={RegisterVerify} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
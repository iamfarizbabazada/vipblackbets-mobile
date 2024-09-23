import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import Home from '../screens/home';
import Profile from '../screens/profile';
import UpdateProfile from '../screens/profile/update';
import Security from '../screens/profile/security';
import OrderCreate from '../screens/order/create';
import OrderList from '../screens/order/list';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const commonHeaderStyle = (theme) => ({
  headerStyle: {
    backgroundColor: '#252525',
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: { color: theme.colors.primary, fontWeight: 'bold' },
  headerTitleAlign: 'center',
});

function StackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator initialRouteName="ProfileList" screenOptions={{ ...commonHeaderStyle(theme) }}>
      <Stack.Screen
        options={{
          headerTitle: 'Hesab',
          ...commonHeaderStyle(theme),
        }}
        name="ProfileList"
        component={Profile}
      />
      <Stack.Screen
        options={{
          headerTitle: 'Hesab Məlumatları',
          ...commonHeaderStyle(theme),
        }}
        name="UpdateProfile"
        component={UpdateProfile}
      />
       <Stack.Screen
        options={{
          headerTitle: 'Təhlükəsizlik',
          ...commonHeaderStyle(theme),
        }}
        name="Security"
        component={Security}
      />
      <Stack.Screen
        options={{
          headerTitle: 'Depozit Yüklə',
          ...commonHeaderStyle(theme),
        }}
        name="OrderCreate"
        component={OrderCreate}
      />
      <Stack.Screen
        options={{
          headerTitle: 'Ödəniş Tarixçəsi',
          ...commonHeaderStyle(theme),
        }}
        name="OrderList"
        component={OrderList}
      />
    </Stack.Navigator>
  );
}

export default function AppStack() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Profile"
        screenOptions={{
          tabBarInactiveTintColor: '#fff',
          tabBarActiveTintColor: theme.colors.primary,
          tabBarStyle: {
            borderTopWidth: 0.2,
            borderColor: '#454545',
            backgroundColor: '#252525',
          },
          ...commonHeaderStyle(theme),
        }}
        sceneContainerStyle={{ backgroundColor: '#252525' }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: 'Kəşfet',
            tabBarLabel: 'Kəşfet',
            tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={StackNavigator}
          options={{
            headerShown: false,
            tabBarLabel: 'Hesab',
            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Support"
          component={Profile}
          options={{
            headerTitle: 'Dəstək',
            tabBarLabel: 'Dəstək',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import Home from '../screens/home';
import Profile from '../screens/profile';
import UpdateProfile from '../screens/profile/update';
import Security from '../screens/profile/security';
import NotificationList from '../screens/profile/notifications';
import OrderCreate from '../screens/order/create';
import OrderList from '../screens/order/list';
import Support from '../screens/support';
import Chat from '../screens/support/chat';
import { Button } from '../components/button';
import { Image, TouchableOpacity, View } from 'react-native';
import TermsAndConditions from '../screens/terms';
import MatchDetail from '../screens/fixtures';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const commonHeaderStyle = (theme) => ({
  headerStyle: {
    backgroundColor: '#252525',
    // borderBottomWidth: 0,
    elevation: 1,
    shadowOpacity: 2,
  },
  headerTitleStyle: { color: theme.colors.primary, fontWeight: 'bold' },
  headerTitleAlign: 'center',
});

function StackNavigator() {
  const theme = useTheme();
  const navigation = useNavigation()

  return (
    <Stack.Navigator initialRouteName="ProfileList" screenOptions={{ ...commonHeaderStyle(theme),   headerLeftLabelVisible: true,
      headerLeftContainerStyle: {
        paddingLeft: 10
      },
      headerLeft: (props) => <IconButton {...props} icon={() => <Ionicons name='chevron-back' size={24} color={theme.colors.primary} />} size={24} />}}>
      <Stack.Screen
        options={{
          headerTitle: 'Hesab',
          ...commonHeaderStyle(theme),
          headerLeftLabelVisible: false,
          headerLeft: false,
          headerShown: false
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
          headerTitle: 'Şifrəni Yenilə',
          ...commonHeaderStyle(theme),
        }}
        name="Security"
        component={Security}
      />
      <Stack.Screen
        options={{
          headerTitle: 'Depozit Yüklə',
          ...commonHeaderStyle(theme),
          headerLeft: (props) => <TouchableOpacity {...props}><Text style={{color: theme.colors.primary}}>Ləğv et</Text></TouchableOpacity>
        }}
        name="OrderCreate"
        component={OrderCreate}
      />
      <Stack.Screen
        options={{
          headerTitle: 'Ödəniş Tarixçəsi',
          ...commonHeaderStyle(theme),
          headerLeft: (props) => <IconButton onPress={() => navigation.navigate('ProfileList')} icon={() => <Ionicons name='chevron-back' size={24} color={theme.colors.primary} />} size={24} />
        }}
        name="OrderList"
        component={OrderList}
      />
      <Stack.Screen
        name="Terms"
        options={{
          headerTitle: 'Şərtlər və Qaydalar',
          ...commonHeaderStyle(theme),
        }}
        component={TermsAndConditions}
      />
      <Stack.Screen
        name="Privacy"
        options={{
          headerTitle: 'Gizlilik Siyasəti',
          ...commonHeaderStyle(theme),
        }}
        component={TermsAndConditions}
      />
    </Stack.Navigator>
  );
}


function FootbalStackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ ...commonHeaderStyle(theme), headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={Home}
      />
       <Stack.Screen
        name="LeagueDetails"
        component={MatchDetail}
      />
    </Stack.Navigator>
  );
}

function SupportStackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator initialRouteName="LiveSupport" screenOptions={{ ...commonHeaderStyle(theme), headerShown: false, headerLeftLabelVisible: true,
      headerLeftContainerStyle: {
        paddingLeft: 10
      },
      headerLeft: (props) => <IconButton {...props} icon={() => <Ionicons name='chevron-back' size={24} color={theme.colors.primary} />} size={24} />}}>
      <Stack.Screen
        options={{
          headerTitle: 'Canlı Dəstək',
          ...commonHeaderStyle(theme),
        }}
        name="LiveSupport"
        component={Support}
      />
      <Stack.Screen
        options={{
          headerTitle: 'BetWallet Admin',
          ...commonHeaderStyle(theme),
          headerShown: true 
        }}
        name="Chat"
        component={Chat}
      />
    </Stack.Navigator>
  );
}

export default function AppStack() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Index"
        screenOptions={{
          tabBarInactiveTintColor: "#d2d2d2",
          tabBarActiveTintColor: theme.colors.primary,
          tabBarStyle: {
            borderTopWidth: 0.2,
            borderColor: '#454545',
            backgroundColor: '#252525',
            paddingBottom: 15,
            paddingHorizontal: 20,
            height: 80,
            paddingTop: 15,
          },
          tabBarLabelStyle: {
            fontSize: 11,
          },
          ...commonHeaderStyle(theme),
        }}
        sceneContainerStyle={{ backgroundColor: '#252525' }}
      >
        <Tab.Screen
          name="Index"
          component={FootbalStackNavigator}
          options={{
            headerTitle: () =>  <View style={{alignItems: 'center'}}><Text style={{color: theme.colors.primary, fontSize: 32, fontWeight: '900'}}>VipBlack.Bet</Text></View>,
            tabBarLabel: 'Kəşfet',
            headerTitleAlign: 'left',
            tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} />,
          }}
        />
        

        <Stack.Screen
        options={{
          headerTitle: 'Bildirişlər',
          tabBarLabel: 'Bildirişlər',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />,
          ...commonHeaderStyle(theme),
        }}
        name="NotificationList"
        component={NotificationList}
      />


        <Tab.Screen
          name="Support"
          component={SupportStackNavigator}
          options={{
            headerShown: false,
            tabBarLabel: 'Canlı Dəstək',
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbox-ellipses-outline" color={color} size={size} />,
          }}
        />

        <Tab.Screen
          name="Profile"
          component={StackNavigator}
          options={{
            headerShown: false,
            tabBarLabel: 'Hesabım',
            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

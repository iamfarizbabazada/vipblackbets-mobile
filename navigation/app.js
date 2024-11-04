import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from 'react-native';
import Home from "../screens/home";
import About from "../screens/about";
import Profile from "../screens/profile";
import UpdateProfile from "../screens/profile/update";
import Security from "../screens/profile/security";
import Settings from "../screens/profile/settings";
import HistoryProfile from "../screens/profile/history";
import DeleteProfile from "../screens/profile/delete";
import NotificationList from "../screens/notifications/notifications";
import OrderCreate from "../screens/order/create";
import OrderList from "../screens/order/list";
import Support from "../screens/support";
import Chat from "../screens/support/chat";
import TermsAndConditions from "../screens/terms";
import MatchDetail from "../screens/fixtures";
import BalanceCreate from "../screens/balance/create";
import DepositCreate from "../screens/deposit/create";
import WithdrawCreate from "../screens/withdraw/create";
import BalanceList from "../screens/balance/history";
import DepositList from "../screens/deposit/history";
import WithdrawList from "../screens/withdraw/history";
import BonusWheel from "../screens/wheel";
import LottieView from "lottie-react-native";
import hostAnimation from '../data/host.json';
import live from "../screens/live/live";
import SupportScreen from "../screens/supportScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const commonHeaderStyle = (theme) => ({
    headerStyle: { backgroundColor: "#1e1e1e", elevation: 1, shadowOpacity: 3 },
    headerTitleStyle: { color: theme.colors.primary, fontWeight: "bold", fontFamily: "Poppins", fontSize: 24 }, // Poppins ve boyut ekledik
    headerTitleAlign: "center",
});

function StackNavigator() {
    const theme = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="ProfileList"
            screenOptions={{
                ...commonHeaderStyle(theme),
                headerLeftContainerStyle: { paddingLeft: 10 },
                headerLeft: (props) => (
                    <IconButton
                        {...props}
                        icon={() => <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />}
                        size={24}
                    />
                ),
            }}
        >
            {[
                { name: "ProfileList", component: Profile, title: "Hesab", headerShown: false },
                { name: "Settings", component: Settings, title: "Tənzimləmələr" },
                { name: "UpdateProfile", component: UpdateProfile, title: "Hesab Məlumatları" },
                { name: "BonusWheel", component: BonusWheel, title: "Bonus" },
                { name: "Security", component: Security, title: "Təhlükəsizlik" },
                { name: "History", component: HistoryProfile, title: "Tarixçə" },
                { name: "DeleteProfile", component: DeleteProfile, title: "Təhlükəsizlik" },
                { name: "Deposit", component: DepositCreate, title: "", cancelable: true },
                { name: "Withdraw", component: WithdrawCreate, title: "Çıxarış" },
                { name: "Balance", component: BalanceCreate, title: "", cancelable: true },
                { name: "BalanceList", component: BalanceList, title: "Balans Tarixçəsi" },
                { name: "WithdrawList", component: WithdrawList, title: "Çıxarış Tarixçəsi" },
                { name: "OrderCreate", component: OrderCreate, title: "Depozit Yüklə", cancelable: true },
                { name: "DepositList", component: DepositList, title: "Depozit Tarixçəsi" },
                { name: "OrderList", component: OrderList, title: "Ödəniş Tarixçəsi", backTo: "ProfileList" },
                { name: "About", component: About, title: "Haqqında", backTo: "ProfileList" },
                { name: "Terms", component: TermsAndConditions, title: "Şərtlər və Qaydalar" },
                { name: "Privacy", component: TermsAndConditions, title: "Gizlilik Siyasəti" },
				{ name: "live", component: TermsAndConditions, title: "Canlı" },
                { name: "Home", component: Home, title: "Home" },
                { name: "supportScreen", component: SupportScreen, title: "Canlı Dəstək" },
            ].map(({ name, component, title, headerShown = true, cancelable, backTo }) => (
                <Stack.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={{
                        headerTitle: title,
                        headerShown,
                        ...commonHeaderStyle(theme),
                        headerLeft: cancelable
                            ? (props) => (
                                <TouchableOpacity {...props}>
                                    <Text style={{ color: theme.colors.primary }}>Ləğv et</Text>
                                </TouchableOpacity>
                            )
                            : backTo
                                ? (props) => (
                                    <IconButton
                                        onPress={() => navigation.navigate(backTo)}
                                        icon={() => (
                                            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
                                        )}
                                        size={24}
                                    />
                                )
                                : undefined,
                    }}
                />
            ))}
        </Stack.Navigator>
    );
}

function FootbalStackNavigator() {
    const theme = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ ...commonHeaderStyle(theme), headerShown: false }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="LeagueDetails" component={MatchDetail} />
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
                    tabBarInactiveTintColor: "#a1a1a1",
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarStyle: styles.tabBarStyle,
                    tabBarLabelStyle: styles.tabBarLabelStyle,
                    ...commonHeaderStyle(theme),
                }}
                sceneContainerStyle={{ backgroundColor: "#1e1e1e" }}
				
            >
                <Tab.Screen
                    name="Index"
                    component={FootbalStackNavigator}
                    options={{
                        headerTitle: () => (
							<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 0 }}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
								<LottieView source={hostAnimation} autoPlay loop={true} style={styles.host} />
									<Text style={{ paddingLeft: 0, color: "#B8860B", fontSize: 32, fontWeight: "900", fontFamily: "Poppins", textAlign: "left" }}>
										VBB
									</Text>
								{/* <Ionicons name="shield-checkmark-outline" color="#B8860B" size={28} /> */}
								</View>
								<TouchableOpacity style={styles.balanceButton}>
									<Text style={styles.balanceText}>0₼</Text>
									<Ionicons name="add-circle-outline" fontWeight= "900" color="#1e1e1e" size={24} />
								</TouchableOpacity>
								
							</View>
						),
                        tabBarLabel: () => <Text style={{ color: theme.colors.primary }}>Kəşfet</Text>,
                        headerTitleAlign: "left",
                        tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} />,
                    }}
					
                />
				<Tab.Screen
						name="live"
						component={live}
						options={{
							headerTitle: () => <Text style={{ color: theme.colors.primary, fontSize: 18, fontWeight: 900, }}>VBB Canlı</Text>,
                            tabBarLabel: () => <Text style={{ color: theme.colors.primary }}>Canlı</Text>,
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="tv" color={color} size={size} />
							),
						}}
					/>

				

                <Tab.Screen
                    name="NotificationList"
                    component={NotificationList}
                    options={{
                        headerTitle: () => <Text style={{ color: theme.colors.primary }}>Bildirişlər</Text>,
                        tabBarLabel: () => <Text style={{ color: theme.colors.primary}}>Bildirişlər</Text>,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="notifications" color={color} size={size} />
                        ),
                    }}
                />
				
                <Tab.Screen
                    name="Profile"
                    component={StackNavigator}
                    options={{
						headerShown: false,
                        tabBarLabel: () => <Text style={{ color: theme.colors.primary }}>Hesabım</Text>,
                        tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    balanceButton: {
        backgroundColor: "#B8860B",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginTop: 0,
    },
    balanceText: {
        color: "#1e1e1e",
        fontWeight: "bold",
        marginRight: 8,
		fontSize: 18,
        
    },
    tabBarStyle: {
        backgroundColor: "#1e1e1e",
        borderTopWidth: 1,
        borderTopColor: "#252525",
		paddingBottom: 10,
		paddingHorizontal: 20,
		height: 70,
		paddingTop: 10,
    },
    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
    },
	
	host: {
		width: 50, // veya istediğiniz genişlik değeri
		height: 50, // veya istediğiniz yükseklik değeri
	}
});
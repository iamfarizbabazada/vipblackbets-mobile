import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "../screens/auth/onboarding";
import Login from "../screens/auth/login";
import Register from "../screens/auth/register";
import RegisterVerify from "../screens/auth/register-verify";
import TermsAndConditions from "../screens/terms";
import ForgetPassword from "../screens/auth/forget-password";
import ResetPassword from "../screens/auth/reset-password";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

const Stack = createStackNavigator();

export default function AuthStack() {
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkOnboardingStatus = async () => {
			try {
				const hasCompletedOnboarding = await AsyncStorage.getItem(
					"hasCompletedOnboarding",
				);
				if (hasCompletedOnboarding === null) {
					// Onboarding not completed, show it
					setShowOnboarding(true);
				}
			} catch (error) {
				console.error("Error checking onboarding status:", error);
			}
			setLoading(false);
		};

		checkOnboardingStatus();
	}, []);

	if (loading) return <View></View>;

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={showOnboarding ? "Onboarding" : "Login"}
				screenOptions={{ headerShown: false }}
			>
				{showOnboarding && (
					<Stack.Screen name="Onboarding" component={Onboarding} />
				)}
				<Stack.Screen
					name="Login"
					options={{ headerTitle: "Daxil ol" }}
					component={Login}
				/>
				<Stack.Screen
					name="Register"
					options={{ headerTitle: "Qeydiyyat" }}
					component={Register}
				/>
				<Stack.Screen name="RegisterVerify" component={RegisterVerify} />
				<Stack.Screen name="ForgetPassword" component={ForgetPassword} />
				<Stack.Screen name="ResetPassword" component={ResetPassword} />
				<Stack.Screen name="Terms" component={TermsAndConditions} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

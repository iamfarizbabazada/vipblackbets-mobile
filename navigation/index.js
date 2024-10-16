import AuthStack from "./auth";
import AppStack from "./app";
import { useAuthStore } from "../store/auth";

export default function Navigation() {
	const { user } = useAuthStore();

	if (!user) return <AuthStack />;
	return <AppStack />;
}

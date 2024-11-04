import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";

export function Button({ children, style, ...props }) {
	const combinedStyles = [styles.button, style];

	return (
		<PaperButton
			labelStyle={{ fontSize: 18, color: "#1e1e1e" }}
			style={combinedStyles}
			{...props}
		>
			{" "}
			{children}{" "}
		</PaperButton>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 10,
	},
});

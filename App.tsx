import React from "react";
import store from "./src/store";
import { Provider as StoreProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import Root from "./src";
import { theme } from "./src/ui/global";

export default function App() {
	return (
		<StoreProvider store={store}>
			<PaperProvider theme={theme}>
				<Root />
			</PaperProvider>
		</StoreProvider>
	);
}

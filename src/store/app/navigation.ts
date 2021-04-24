import { NavigationActions } from "react-navigation";
import type { NavigationParams, NavigationRoute } from "react-navigation";
import { NavigationContainerRef } from "@react-navigation/native";
import { ScreenId } from "./types";

let _container: NavigationContainerRef | null; // eslint-disable-line

function setContainer(container: NavigationContainerRef | null) {
	_container = container;
}

function navigate(routeName: ScreenId, params?: NavigationParams) {
	if (_container) {
		_container.dispatch(
			NavigationActions.navigate({
				action: {
					type: "Navigation/NAVIGATE",
					routeName,
					params,
				},
				routeName,
			})
		);
	}
}

export default {
	setContainer,
	navigate,
};

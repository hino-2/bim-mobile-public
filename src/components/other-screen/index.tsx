import React from "react";
import { Drawer, otherScreens } from "../../utils/navigation";
import CustomDrawer from "../../ui/drawer";

const OtherScreen = () => (
	<Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
		{otherScreens}
	</Drawer.Navigator>
);

export default OtherScreen;

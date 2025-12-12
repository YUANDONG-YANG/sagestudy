// app/src/navigation/AppNavigator.js
import React, { useEffect } from "react";
import {NavigationContainer, DefaultTheme} from "@react-navigation/native";
import RootNavigator from "./RootNavigator";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#6C4AB6",
        background: "#FFFFFF",
        card: "#FFFFFF",
        text: "#4A3A67",
        border: "#EDEAFF",
        notification: "#6C4AB6",
    },
};

// Create navigation ref for navigation after notification click
export const navigationRef = React.createRef();

export default function AppNavigator() {
    useEffect(() => {
        // Notification click handling will be implemented in Notifications.js via navigationRef
        // Just ensure navigationRef is available here
    }, []);

    return (
        <NavigationContainer ref={navigationRef} theme={MyTheme}>
            <RootNavigator/>
        </NavigationContainer>
    );
}

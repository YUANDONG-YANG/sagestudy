// app/src/navigation/AppNavigator.js
import React from "react";
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

export default function AppNavigator() {
    return (
        <RootNavigator/>
    );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppProvider } from "./src/context/TaskContext";

export default function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AppProvider>
    );
}

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LearnScreen from "../screen/LearnScreen";
import ReviewScreen from "../screen/ReviewScreen";
import TestScreen from "../screen/TestScreen";

const Stack = createNativeStackNavigator();

export default function LearningStack() {
    return (
        <Stack.Navigator
            initialRouteName="LearnMain"
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen name="LearnMain" component={LearnScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
            <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
    );
}


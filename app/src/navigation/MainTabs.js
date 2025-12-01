import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

import HomeScreen from "../screen/HomeScreen";
import LearnScreen from "../screen/LearnScreen";
import ProgressScreen from "../screen/ProgressScreen";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: "#6C4AB6",
                tabBarInactiveTintColor: "#999",

                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    height: 64,
                    paddingBottom: 6,
                    borderTopWidth: 1,
                    borderTopColor: "#EDEAFF",
                },

                tabBarIcon: ({ color }) => {
                    const icons = {
                        Home: "home",
                        Learn: "menu-book",
                        Progress: "bar-chart",
                        Profile: "person",
                    };

                    return <Icon name={icons[route.name]} color={color} size={26} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Learn" component={LearnScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

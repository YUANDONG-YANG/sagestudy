import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IconWithFallback from "../components/IconWithFallback";

import HomeScreen from "../screen/HomeScreen";
import LearningStack from "./LearningStack";
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

                    return <IconWithFallback name={icons[route.name]} color={color} size={26} useEmoji={true} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Learn" component={LearningStack} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

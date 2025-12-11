import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screen/ProfileScreen";
import PrivacyPolicyScreen from "../screen/PrivacyPolicyScreen";
import HelpSupportScreen from "../screen/HelpSupportScreen";
import ChangePasswordScreen from "../screen/ChangePasswordScreen";
import ReminderSettingsScreen from "../screen/planner/ReminderSettingsScreen";
import EditProfileScreen from "../screen/EditProfileScreen";
import PlannerStack from "./PlannerStack";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} />
            <Stack.Screen name="PlannerStack" component={PlannerStack} />
        </Stack.Navigator>
    );
}

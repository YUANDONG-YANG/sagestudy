import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TaskListScreen from "../screens/planner/TaskListScreen";
import AddTaskScreen from "../screens/planner/AddTaskScreen";
import TaskDetailScreen from "../screens/planner/TaskDetailScreen";
import AssessmentListScreen from "../screens/planner/AssessmentListScreen";
import CalendarScreen from "../screens/planner/CalendarScreen";
import ReminderSettingsScreen from "../screens/planner/ReminderSettingsScreen";

const Stack = createNativeStackNavigator();

export default function PlannerStack() {
    return (
        <Stack.Navigator
            initialRouteName="TaskList"
            screenOptions={{
                headerShown: false, // 全部使用 PurpleHeader，而不是默认头部
                animation: "slide_from_right", // 统一专业动画
            }}
        >
            {/* Main Planner Screens */}
            <Stack.Screen name="TaskList" component={TaskListScreen} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />

            {/* Secondary Views */}
            <Stack.Screen name="AssessmentList" component={AssessmentListScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} />
        </Stack.Navigator>
    );
}

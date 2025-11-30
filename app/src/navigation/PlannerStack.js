import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TaskListScreen from "../screen/planner/TaskListScreen";
import AddTaskScreen from "../screen/planner/AddTaskScreen";
import TaskDetailScreen from "../screen/planner/TaskDetailScreen";
import AssessmentListScreen from "../screen/planner/AssessmentListScreen";
import CalendarScreen from "../screen/planner/CalendarScreen";
import ReminderSettingsScreen from "../screen/planner/ReminderSettingsScreen";

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

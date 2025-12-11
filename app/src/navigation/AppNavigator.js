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

// 创建导航ref，用于通知点击后导航
export const navigationRef = React.createRef();

export default function AppNavigator() {
    useEffect(() => {
        // 通知点击处理将在Notifications.js中通过navigationRef实现
        // 这里只需要确保navigationRef可用
    }, []);

    return (
        <NavigationContainer ref={navigationRef} theme={MyTheme}>
            <RootNavigator/>
        </NavigationContainer>
    );
}

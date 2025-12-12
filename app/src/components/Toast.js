/**
 * Toast 消息提示组件
 */
import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

export default function Toast({ message, type = "info", visible, onHide, duration = 3000 }) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // 显示动画
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // 自动隐藏
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onHide) onHide();
        });
    };

    if (!visible && !message) return null;

    const getColors = () => {
        switch (type) {
            case "success":
                return { bg: "#4CAF50", icon: "check-circle" };
            case "error":
                return { bg: "#F44336", icon: "error" };
            case "warning":
                return { bg: "#FF9800", icon: "warning" };
            default:
                return { bg: "#2196F3", icon: "info" };
        }
    };

    const colors = getColors();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: colors.bg,
                },
            ]}
        >
            <Icon name={colors.icon} size={24} color="#fff" style={styles.icon} />
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 9999,
    },
    icon: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
});



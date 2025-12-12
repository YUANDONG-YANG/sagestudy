/**
 * 加载遮罩组件 - 显示API请求加载状态
 */
import React from "react";
import { View, StyleSheet, ActivityIndicator, Text, Modal } from "react-native";

export default function LoadingOverlay({ visible, message = "Loading...", transparent = true }) {
    if (!visible) return null;

    return (
        <Modal transparent={transparent} animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#6C4AB6" />
                    {message && <Text style={styles.message}>{message}</Text>}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        minWidth: 120,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    message: {
        marginTop: 12,
        fontSize: 14,
        color: "#4A3A67",
        fontWeight: "500",
    },
});



import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function CustomModal({
                                        visible,
                                        title,
                                        message,
                                        onCancel,
                                        onConfirm,
                                    }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    modalCard: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 25,
        color: "#666",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        marginRight: 6,
        borderRadius: 10,
        backgroundColor: "#ddd",
    },
    cancelText: {
        textAlign: "center",
        color: "#333",
        fontWeight: "600",
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 6,
        borderRadius: 10,
        backgroundColor: "#FF5252",
    },
    confirmText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "700",
    },
});

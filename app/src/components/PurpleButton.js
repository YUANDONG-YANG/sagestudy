import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function PurpleButton({ label, onPress, disabled }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.btn,
                disabled && { opacity: 0.4 }
            ]}
        >
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    label: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});

import React from "react";
import { View, StyleSheet } from "react-native";

export default function PurpleCard({ children, style }) {
    return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 22,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
    },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function PurpleHeader({ title, onBack }) {
    return (
        <View style={styles.header}>
            {onBack ? (
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 26 }} />
            )}

            <Text style={styles.title}>{title}</Text>

            <View style={{ width: 26 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 16,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "700",
    },
    backBtn: {
        padding: 4,
    },
});

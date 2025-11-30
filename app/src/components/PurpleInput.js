import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

export default function PurpleInput({ label, value, onChangeText, placeholder, multiline }) {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TextInput
                style={[styles.input, multiline && { height: 100 }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                multiline={multiline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
    },
    label: {
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#F3EFFF",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#4A3A67",
    },
});

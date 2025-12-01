import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function EditProfileScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <Text style={styles.placeholder}>
                (Your profile form goes here)
            </Text>

            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "700", color: "#4A3A67", marginBottom: 20 },
    placeholder: { color: "#777", marginBottom: 20 },
    saveButton: {
        backgroundColor: "#6C4AB6",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    saveText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    }
});

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";

export default function RegisterScreen({ navigation }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Missing Fields", "Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password Error", "Passwords do not match.");
            return;
        }

        // 这里你可以接入真实 API 或本地存储
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Login");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            {/* Full Name */}
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#B5A9C9"
                value={fullName}
                onChangeText={setFullName}
            />

            {/* Email */}
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#B5A9C9"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B5A9C9"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* Confirm Password */}
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#B5A9C9"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {/* Register Button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Login Redirect */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
        color: "#6C4AB6",
    },
    input: {
        backgroundColor: "#F1E9FF",
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        marginBottom: 18,
        color: "#4A3A67",
    },
    button: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 16,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    buttonText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 18,
    },
    linkText: {
        textAlign: "center",
        color: "#6C4AB6",
        fontSize: 15,
        marginTop: 10,
    },
});

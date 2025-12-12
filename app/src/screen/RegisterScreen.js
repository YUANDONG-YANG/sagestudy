import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import LoadingOverlay from "../components/LoadingOverlay";

export default function RegisterScreen({ navigation }) {
    const { register } = useContext(AuthContext);
    const { showSuccess, showError } = useContext(ToastContext);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            showError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const result = await register(fullName, email, password);
            if (result.success) {
                showSuccess("Account created successfully!");
                // 成功后会通过AuthContext自动导航到MainTabs
            } else {
                showError(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            showError("An unexpected error occurred. Please try again.");
            if (__DEV__) {
                console.error("Register error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LoadingOverlay visible={loading} message="Creating account..." />
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
            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
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
    buttonDisabled: {
        opacity: 0.6,
    },
});

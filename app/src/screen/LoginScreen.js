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
import IconWithFallback from "../components/IconWithFallback";

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const { showSuccess, showError } = useContext(ToastContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            showError("Please enter your email and password.");
            return;
        }

        setLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                showSuccess("Login successful! Welcome back!");
            } else {
                showError(result.message || "Login failed. Please try again.");
            }
            // 成功后会通过AuthContext自动导航到MainTabs
        } catch (error) {
            showError("An unexpected error occurred. Please try again.");
            if (__DEV__) {
                console.error("Login error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LoadingOverlay visible={loading} message="Signing in..." />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 60 }}>

                {/* ===== Logo & Title ===== */}
                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                        <Text style={styles.logoIcon}>📘</Text>
                    </View>
                    <Text style={styles.title}>Welcome to SageStudy</Text>
                    <Text style={styles.subtitle}>Learn smarter every day</Text>
                </View>

                {/* ===== Login Card ===== */}
                <View style={styles.card}>
                    {/* Email */}
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <IconWithFallback name="email" size={20} color="#6C4AB6" useEmoji={true} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <IconWithFallback name="lock" size={20} color="#6C4AB6" useEmoji={true} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.eye}>{showPassword ? "🙈" : "👁️"}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        onPress={() => alert("Forgot password feature coming soon")}
                    >
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity 
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* ===== Register ===== */}
                <View style={styles.bottom}>
                    <Text style={styles.bottomText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.registerText}>Create Account</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    /* Header */
    header: {
        alignItems: "center",
        marginBottom: 25,
    },

    logoWrapper: {
        width: 90,
        height: 90,
        backgroundColor: "#F3EFFF",
        borderRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    logoIcon: {
        fontSize: 44,
    },

    title: {
        marginTop: 20,
        fontSize: 28,
        fontWeight: "700",
        color: "#4A3A67",
    },

    subtitle: {
        color: "#7D6E9E",
        marginTop: 6,
    },

    /* Card */
    card: {
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 24,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    label: {
        fontWeight: "600",
        color: "#4A3A67",
        marginBottom: 6,
        fontSize: 15,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3EFFF",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        color: "#4A3A67",
    },

    eye: {
        fontSize: 20,
        marginLeft: 6,
    },

    forgotText: {
        color: "#6C4AB6",
        fontWeight: "600",
        fontSize: 14,
        marginTop: 12,
        textAlign: "right",
    },

    loginButton: {
        marginTop: 22,
        backgroundColor: "#6C4AB6",
        paddingVertical: 14,
        borderRadius: 20,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },

    loginText: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },

    /* Bottom Register */
    bottom: {
        marginTop: 30,
        alignItems: "center",
    },

    bottomText: {
        color: "#444",
        fontSize: 14,
    },

    registerText: {
        color: "#6C4AB6",
        fontSize: 16,
        fontWeight: "700",
        marginTop: 6,
    },
});


import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function SignUpScreen({ navigation }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [dailyGoal, setDailyGoal] = useState("20");

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [receiveUpdates, setReceiveUpdates] = useState(false);

    const onSubmit = () => {
        if (!fullName || !email || !password || !confirmPassword) {
            alert("Please fill all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!acceptTerms) {
            alert("You must agree to the Terms of Service.");
            return;
        }

        navigation.navigate("VerifyEmail");
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoIcon}>📘</Text>
                    </View>
                    <Text style={styles.title}>Join SageStudy</Text>
                    <Text style={styles.subtitle}>
                        Start your vocabulary learning journey
                    </Text>
                </View>

                {/* CARD */}
                <View style={styles.card}>
                    {/* Full Name */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>👤 Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>📩 Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>🔑 Password</Text>

                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a strong password"
                                secureTextEntry={!showPassword1}
                                value={password}
                                onChangeText={setPassword}
                            />

                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword1(!showPassword1)}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showPassword1 ? "🙈" : "👁️"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.mutedSmall}>
                            At least 8 characters with letters and numbers
                        </Text>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>✔ Confirm Password</Text>

                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                secureTextEntry={!showPassword2}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />

                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword2(!showPassword2)}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showPassword2 ? "🙈" : "👁️"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Learning Goal Picker */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>🎯 Learning Goal</Text>

                        <View style={styles.pickerBox}>
                            <Picker
                                selectedValue={dailyGoal}
                                onValueChange={(item) => setDailyGoal(item)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Choose your daily goal" value="" />
                                <Picker.Item label="10 words per day - Beginner" value="10" />
                                <Picker.Item label="20 words per day - Intermediate" value="20" />
                                <Picker.Item label="30 words per day - Advanced" value="30" />
                                <Picker.Item label="50 words per day - Expert" value="50" />
                            </Picker>
                        </View>
                    </View>

                    {/* Terms Accept */}
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setAcceptTerms(!acceptTerms)}
                    >
                        <Switch
                            value={acceptTerms}
                            onValueChange={setAcceptTerms}
                            thumbColor={acceptTerms ? "#764ba2" : "#ccc"}
                        />
                        <Text style={styles.checkboxLabel}>
                            I agree to the Terms of Service & Privacy Policy
                        </Text>
                    </TouchableOpacity>

                    {/* Optional Updates */}
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setReceiveUpdates(!receiveUpdates)}
                    >
                        <Switch
                            value={receiveUpdates}
                            onValueChange={setReceiveUpdates}
                            thumbColor={receiveUpdates ? "#764ba2" : "#ccc"}
                        />
                        <Text style={styles.checkboxLabel}>
                            Send me learning tips and updates
                        </Text>
                    </TouchableOpacity>

                    {/* Submit */}
                    <TouchableOpacity style={styles.signupButton} onPress={onSubmit}>
                        <Text style={styles.signupButtonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Already have account */}
                <View style={styles.signInBlock}>
                    <Text style={styles.signInText}>Already have an account?</Text>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

/* ----------------------------- */
/* STYLES */
/* ----------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#667eea"
    },

    header: {
        alignItems: "center",
        marginTop: 30
    },

    logoCircle: {
        width: 80,
        height: 80,
        backgroundColor: "#fff",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    logoIcon: {
        fontSize: 40
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 10
    },
    subtitle: {
        color: "#fff",
        opacity: 0.8
    },

    card: {
        marginTop: 25,
        backgroundColor: "#fff",
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 20
    },

    formGroup: {
        marginBottom: 18
    },

    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#555",
        marginBottom: 6
    },

    input: {
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 12,
        fontSize: 16
    },

    passwordWrapper: { position: "relative" },

    eyeButton: {
        position: "absolute",
        right: 10,
        top: 12
    },

    eyeIcon: {
        fontSize: 20
    },

    mutedSmall: {
        color: "#777",
        fontSize: 12,
        marginTop: 4
    },

    pickerBox: {
        backgroundColor: "#f2f2f2",
        borderRadius: 12
    },

    picker: {
        height: 50
    },

    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10
    },

    checkboxLabel: {
        marginLeft: 10,
        color: "#333"
    },

    signupButton: {
        marginTop: 20,
        backgroundColor: "#764ba2",
        padding: 15,
        borderRadius: 12
    },

    signupButtonText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
        fontWeight: "600"
    },

    signInBlock: {
        alignItems: "center",
        marginTop: 25
    },

    signInText: {
        color: "#fff",
        fontSize: 16
    },

    signInButton: {
        marginTop: 10,
        borderWidth: 2,
        borderColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 12
    },

    signInButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});

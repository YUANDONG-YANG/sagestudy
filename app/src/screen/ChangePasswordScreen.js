import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Switch,
    LayoutAnimation,
    UIManager,
    Platform,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ChangePasswordScreen({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [logoutDevices, setLogoutDevices] = useState(true);

    /* ---- Password Strength ---- */
    const getStrength = () => {
        const req = {
            length: newPassword.length >= 8,
            letter: /[a-zA-Z]/.test(newPassword),
            number: /\d/.test(newPassword),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        };

        const score = Object.values(req).filter(Boolean).length;

        if (score === 0) return { text: "Not set", width: "0%", color: "#aaa" };
        if (score === 1) return { text: "Weak", width: "20%", color: "#dc3545" };
        if (score === 2) return { text: "Fair", width: "40%", color: "#ff9800" };
        if (score === 3) return { text: "Good", width: "70%", color: "#03a9f4" };
        if (score === 4) return { text: "Strong", width: "100%", color: "#28a745" };
        return { text: "Not set", width: "0%", color: "#aaa" };
    };

    const strength = getStrength();
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    const isFormValid =
        currentPassword.length > 0 &&
        newPassword.length >= 8 &&
        passwordsMatch &&
        /[a-zA-Z]/.test(newPassword) &&
        /\d/.test(newPassword);

    const handleSubmit = () => {
        Alert.alert("Success", "Your password has been changed successfully.", [
            { text: "OK", onPress: () => navigation.goBack() },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Info Banner */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>🔐 Password Security Tips</Text>
                    <Text style={styles.infoText}>
                        Use a strong password with at least 8 characters including letters,
                        numbers, and symbols.
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.card}>

                    {/* Current Password */}
                    <InputWithIcon
                        label="Current Password"
                        placeholder="Enter current password"
                        secure={!showCurrent}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        toggleIcon={() => setShowCurrent(!showCurrent)}
                        show={showCurrent}
                    />

                    {/* New Password */}
                    <InputWithIcon
                        label="New Password"
                        placeholder="Create new password"
                        secure={!showNew}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        toggleIcon={() => setShowNew(!showNew)}
                        show={showNew}
                    />

                    {/* Strength */}
                    <View style={styles.strengthRow}>
                        <Text style={styles.strengthLabel}>Strength:</Text>
                        <Text style={[styles.strengthBadge, { backgroundColor: strength.color }]}>
                            {strength.text}
                        </Text>
                    </View>

                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: strength.width, backgroundColor: strength.color },
                            ]}
                        />
                    </View>

                    {/* Requirements */}
                    <View style={{ marginTop: 12 }}>
                        <Requirement met={newPassword.length >= 8} text="At least 8 characters" />
                        <Requirement met={/[a-zA-Z]/.test(newPassword)} text="Contains letters" />
                        <Requirement met={/\d/.test(newPassword)} text="Contains numbers" />
                        <Requirement
                            met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)}
                            text="Contains special characters"
                        />
                    </View>

                    {/* Confirm Password */}
                    <InputWithIcon
                        label="Confirm Password"
                        placeholder="Re-enter new password"
                        secure={!showConfirm}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        toggleIcon={() => setShowConfirm(!showConfirm)}
                        show={showConfirm}
                        style={{ marginTop: 16 }}
                    />

                    {/* Match Message */}
                    {confirmPassword.length > 0 && (
                        <Text
                            style={[
                                styles.matchText,
                                { color: passwordsMatch ? "green" : "red" },
                            ]}
                        >
                            {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                        </Text>
                    )}

                    {/* Logout Other Devices */}
                    <View style={styles.switchRow}>
                        <Switch value={logoutDevices} onValueChange={setLogoutDevices} />
                        <Text style={styles.switchLabel}>
                            Log out from all other devices after change
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        disabled={!isFormValid}
                        onPress={handleSubmit}
                        style={[
                            styles.primaryBtn,
                            !isFormValid && { opacity: 0.4 },
                        ]}
                    >
                        <Text style={styles.primaryBtnText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                {/* Tips Card */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipTitle}>💡 Security Recommendations</Text>
                    <Text style={styles.tipBullet}>• Use a unique password</Text>
                    <Text style={styles.tipBullet}>• Store it in a password manager</Text>
                    <Text style={styles.tipBullet}>• Change it regularly for best security</Text>
                </View>
            </ScrollView>
        </View>
    );
}

/* ---------------- Reusable UI Components ---------------- */

function InputWithIcon({ label, placeholder, secure, value, onChangeText, toggleIcon, show, style }) {
    return (
        <View style={[{ marginBottom: 16 }, style]}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    secureTextEntry={secure}
                    value={value}
                    onChangeText={onChangeText}
                />
                <TouchableOpacity onPress={toggleIcon}>
                    <Text style={styles.eye}>{show ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function Requirement({ met, text }) {
    return (
        <View style={styles.reqRow}>
            <Text style={[styles.reqIcon, { color: met ? "green" : "#aaa" }]}>
                {met ? "✔" : "✖"}
            </Text>
            <Text style={[styles.reqText, { opacity: met ? 1 : 0.5 }]}>{text}</Text>
        </View>
    );
}

/* ====================== Styles ======================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    /* Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6C4AB6",
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 12,
    },

    /* Info Card */
    infoCard: {
        backgroundColor: "#E8F0FF",
        marginHorizontal: 20,
        marginTop: 20,
        padding: 18,
        borderRadius: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 6,
    },
    infoText: {
        color: "#555",
        lineHeight: 20,
    },

    /* Main Card */
    card: {
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        marginTop: 20,
        padding: 22,
        borderRadius: 22,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    /* Input */
    label: {
        fontWeight: "700",
        marginBottom: 6,
        color: "#4A3A67",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3EFFF",
        borderRadius: 14,
        paddingHorizontal: 14,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        color: "#4A3A67",
    },
    eye: {
        fontSize: 20,
        marginLeft: 8,
    },

    /* Strength Bar */
    strengthRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    strengthLabel: {
        marginRight: 8,
        color: "#777",
    },
    strengthBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        color: "white",
        fontWeight: "700",
        fontSize: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#ddd",
        marginTop: 8,
        borderRadius: 10,
    },
    progressFill: {
        height: "100%",
        borderRadius: 10,
    },

    /* Requirements */
    reqRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    reqIcon: {
        marginRight: 8,
        fontSize: 16,
    },
    reqText: {
        color: "#555",
    },

    /* Password Match */
    matchText: {
        marginTop: -8,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "600",
    },

    /* Logout Other Devices */
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 14,
    },
    switchLabel: {
        marginLeft: 10,
        color: "#555",
        flex: 1,
    },

    /* Buttons */
    primaryBtn: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 14,
        borderRadius: 20,
        marginTop: 10,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 3,
    },
    primaryBtnText: {
        textAlign: "center",
        color: "white",
        fontSize: 17,
        fontWeight: "700",
    },

    cancelBtn: {
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 12,
        backgroundColor: "#eee",
    },
    cancelText: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
    },

    /* Tip Card */
    tipCard: {
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        marginTop: 24,
        padding: 18,
        borderRadius: 20,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    tipTitle: {
        fontWeight: "700",
        marginBottom: 8,
        color: "#4A3A67",
        fontSize: 16,
    },
    tipBullet: {
        color: "#555",
        marginBottom: 4,
        fontSize: 14,
    },
});

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Android 启用动画
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PrivacyPolicyScreen({ navigation }) {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        LayoutAnimation.easeInEaseOut();
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Privacy Policy</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Info Alert */}
                <View style={styles.infoAlert}>
                    <Text style={styles.alertText}>
                        <Icon name="event" size={18} color="#0d47a1" />
                        <Text style={{ fontWeight: "700" }}> Last Updated:</Text> October 16, 2025
                    </Text>
                </View>

                {/* Intro */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>ℹ️ Introduction</Text>
                    <Text style={styles.text}>
                        SageStudy is committed to protecting your privacy. This Privacy Policy explains
                        how we collect, use, disclose, and safeguard your information.
                    </Text>
                    <Text style={styles.text}>
                        By using SageStudy, you agree to the practices described in this policy.
                    </Text>
                </View>

                {/* Info Collect */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📚 Information We Collect</Text>

                    <Text style={styles.sectionLabel}>Personal Information</Text>
                    <Text style={styles.listItem}>• Name and email address</Text>
                    <Text style={styles.listItem}>• Learning preferences and goals</Text>
                    <Text style={styles.listItem}>• Progress and performance data</Text>

                    <Text style={styles.sectionLabel}>Usage Information</Text>
                    <Text style={styles.listItem}>• Words studied</Text>
                    <Text style={styles.listItem}>• Learning sessions</Text>
                    <Text style={styles.listItem}>• App usage patterns</Text>

                    <Text style={styles.sectionLabel}>Device Information</Text>
                    <Text style={styles.listItem}>• Device type and OS</Text>
                    <Text style={styles.listItem}>• Crash logs</Text>
                    <Text style={styles.listItem}>• Network information</Text>
                </View>

                {/* How We Use */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>⚙️ How We Use Your Information</Text>

                    <Text style={styles.bullet}>✔ Improve learning experience</Text>
                    <Text style={styles.textMuted}>Personalized study paths</Text>

                    <Text style={styles.bullet}>✔ Send notifications</Text>
                    <Text style={styles.textMuted}>Reminders & updates (optional)</Text>

                    <Text style={styles.bullet}>✔ Ensure security</Text>
                    <Text style={styles.textMuted}>Fraud detection & protection</Text>
                </View>

                {/* Sharing */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🔗 Information Sharing</Text>

                    <View style={styles.successAlert}>
                        <Text style={styles.successText}>✔ We NEVER sell or rent your personal information.</Text>
                    </View>

                    <Text style={styles.listItem}>• With your consent</Text>
                    <Text style={styles.listItem}>• Trusted service providers</Text>
                    <Text style={styles.listItem}>• Legal obligations</Text>
                    <Text style={styles.listItem}>• Safety protection</Text>
                </View>

                {/* Data Security */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🔐 Data Security</Text>

                    <Text style={styles.text}>We protect your data using:</Text>
                    <Text style={styles.listItem}>• Data encryption</Text>
                    <Text style={styles.listItem}>• Secure storage</Text>
                    <Text style={styles.listItem}>• Access control</Text>
                    <Text style={styles.listItem}>• Regular security audits</Text>
                </View>

                {/* Rights */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🧑‍⚖️ Your Rights</Text>

                    {[
                        { key: "access", title: "Right to Access", content: "You may request a copy of your personal data." },
                        { key: "correct", title: "Right to Correct", content: "Update incorrect or incomplete information." },
                        { key: "delete", title: "Right to Delete", content: "Request deletion of your account and data." },
                        { key: "export", title: "Right to Export Data", content: "Download data in machine-readable format." }
                    ].map((item) => (
                        <View key={item.key} style={styles.accordionBlock}>
                            <TouchableOpacity onPress={() => toggleSection(item.key)}>
                                <Text style={styles.accordionTitle}>
                                    {openSection === item.key ? "▼" : "▶"} {item.title}
                                </Text>
                            </TouchableOpacity>

                            {openSection === item.key && (
                                <Text style={styles.accordionContent}>{item.content}</Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Contact */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📬 Contact Us</Text>
                    <Text style={styles.text}>If you have questions, contact:</Text>
                    <Text style={styles.listItem}>• Email: privacy@sagestudy.com</Text>
                    <Text style={styles.listItem}>• In-app Help Center</Text>
                </View>

                {/* Updates */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🔔 Policy Updates</Text>
                    <Text style={styles.text}>
                        We may update this policy. Continued use of SageStudy means acceptance of updates.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

/* ================= Styles (Purple Unified Theme) ================= */

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
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    headerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 10,
    },

    /* Info */
    infoAlert: {
        backgroundColor: "#E3F2FD",
        marginHorizontal: 16,
        marginTop: 18,
        padding: 14,
        borderRadius: 14,
    },
    alertText: {
        color: "#0d47a1",
        fontSize: 14,
    },

    /* Card */
    card: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 20,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 2,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 12,
    },

    text: {
        fontSize: 15,
        color: "#444",
        marginBottom: 6,
        lineHeight: 20,
    },

    listItem: {
        fontSize: 15,
        color: "#555",
        marginBottom: 4,
    },

    textMuted: {
        fontSize: 13,
        color: "#777",
        marginBottom: 10,
    },

    sectionLabel: {
        marginTop: 14,
        marginBottom: 4,
        fontWeight: "700",
        color: "#6C4AB6",
    },

    bullet: {
        fontWeight: "700",
        color: "#4A3A67",
        marginTop: 6,
    },

    /* Success Alert */
    successAlert: {
        backgroundColor: "#E8F5E9",
        padding: 10,
        borderRadius: 12,
        marginBottom: 12,
    },
    successText: {
        color: "#2e7d32",
        fontWeight: "700",
    },

    /* Accordion */
    accordionBlock: {
        marginTop: 12,
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4A3A67",
    },
    accordionContent: {
        marginTop: 6,
        fontSize: 14,
        color: "#555",
        paddingLeft: 10,
        lineHeight: 20,
    },
});

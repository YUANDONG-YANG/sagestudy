import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SettingsScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    <Icon name="settings" size={22} /> Settings
                </Text>
            </View>

            {/* ACCOUNT SETTINGS */}
            <Text style={styles.sectionHeader}>Account Settings</Text>

            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("Profile")}
            >
                <Icon name="person" size={24} color="#667eea" />
                <Text style={styles.itemText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("ChangePassword")}
            >
                <Icon name="lock" size={24} color="#667eea" />
                <Text style={styles.itemText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("ReminderSettings")}
            >
                <Icon name="notifications" size={24} color="#667eea" />
                <Text style={styles.itemText}>Notification Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("PrivacyPolicy")}
            >
                <Icon name="policy" size={24} color="#667eea" />
                <Text style={styles.itemText}>Privacy Policy</Text>
            </TouchableOpacity>

            {/* APP SETTINGS */}
            <Text style={styles.sectionHeader}>App Settings</Text>

            <TouchableOpacity style={styles.item}>
                <Icon name="color-lens" size={24} color="#667eea" />
                <Text style={styles.itemText}>Theme</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
                <Icon name="language" size={24} color="#667eea" />
                <Text style={styles.itemText}>Language</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("HelpSupport")}
            >
                <Icon name="help" size={24} color="#667eea" />
                <Text style={styles.itemText}>Help & Support</Text>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => alert("Logged out.")}
            >
                <Icon name="logout" size={22} color="#fff" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        backgroundColor: "#667eea",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    headerText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },

    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10,
        marginLeft: 20,
        color: "#333",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    itemText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#333",
    },

    logoutButton: {
        marginTop: 40,
        marginHorizontal: 20,
        backgroundColor: "#ff4d4d",
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    logoutText: {
        color: "#fff",
        marginLeft: 8,
        fontWeight: "bold",
        fontSize: 16,
    },
});

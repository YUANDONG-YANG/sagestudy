import React, {useEffect, useState, useCallback} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";

export default function ProfileScreen({navigation}) {
    const [profile, setProfile] = useState({
        name: "SageStudy Student",
        email: "",
        phone: "",
    });

    const loadProfile = async () => {
        const saved = await AsyncStorage.getItem("userProfile");
        if (saved) {
            setProfile(JSON.parse(saved));
        }
    };

    // 每次页面聚焦时刷新
    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* ===== Header Section ===== */}
            <View style={styles.header}>
                <Image
                    source={
                        profile.avatar
                            ? { uri: profile.avatar }
                            : { uri: "https://i.pravatar.cc/150?img=12" }
                    }
                    style={styles.avatar}
                />

                {/* 动态名字 */}
                <Text style={styles.name}>
                    {profile.name || "SageStudy Student"}
                </Text>

                <Text style={styles.sub}>SageStudy Student</Text>

                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate("EditProfile")}
                >
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                {renderStat("126", "Words Learned")}
                {renderStat("8", "Days Streak")}
                {renderStat("5", "Quizzes Passed")}
            </View>

            {/* Account */}
            <Text style={styles.sectionHeader}>Account</Text>
            {renderItem("lock", "Change Password", () =>
                navigation.navigate("ChangePassword")
            )}
            {renderItem("notifications", "Study Reminders", () =>
                navigation.navigate("ReminderSettings")
            )}
            {renderItem("policy", "Privacy Policy", () =>
                navigation.navigate("PrivacyPolicy")
            )}

            {/* App */}
            <Text style={styles.sectionHeader}>App</Text>
            {renderItem("color-lens", "Theme")}
            {renderItem("language", "Language")}
            {renderItem("help", "Help & Feedback", () =>
                navigation.navigate("HelpSupport")
            )}

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <View style={{height: 50}}/>
        </ScrollView>
    );
}

/* Utilities unchanged */
function renderStat(value, label) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function renderItem(icon, text, onPress) {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <Icon name={icon} size={26} color="#6C4AB6"/>
            <Text style={styles.itemText}>{text}</Text>
            <Icon name="chevron-right" size={26} color="#bbb"/>
        </TouchableOpacity>
    );
}

/* Styles SAME as your uploaded version */
const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#ffffff"},
    header: {
        alignItems: "center",
        paddingVertical: 35,
        backgroundColor: "#F3EFFF",
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {width: 0, height: 4},
        elevation: 3,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: "#6C4AB6",
    },
    name: {
        fontSize: 26,
        fontWeight: "700",
        marginTop: 12,
        color: "#4A3A67",
    },
    sub: {color: "#7D6E9E", marginTop: 4},
    editBtn: {
        marginTop: 16,
        backgroundColor: "#6C4AB6",
        paddingVertical: 10,
        paddingHorizontal: 26,
        borderRadius: 20,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 6,
    },
    editBtnText: {color: "#fff", fontWeight: "600", fontSize: 15},
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 25,
    },
    statCard: {
        backgroundColor: "#F3EFFF",
        width: "30%",
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: "center",
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 6,
        elevation: 2,
    },
    statValue: {
        fontSize: 22,
        fontWeight: "700",
        color: "#6C4AB6",
    },
    statLabel: {marginTop: 6, color: "#6C4AB6", fontSize: 13},
    sectionHeader: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 30,
        marginLeft: 20,
        marginBottom: 12,
        color: "#4A3A67",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    itemText: {
        marginLeft: 14,
        fontSize: 16,
        flex: 1,
        color: "#4A3A67",
    },
    logoutButton: {
        marginTop: 40,
        alignSelf: "center",
        backgroundColor: "#FF4D4D",
        paddingHorizontal: 50,
        paddingVertical: 14,
        borderRadius: 14,
    },
    logoutText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
});

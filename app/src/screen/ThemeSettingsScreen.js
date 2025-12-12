import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeSettingsScreen({ navigation }) {
    const { theme, themeName, changeTheme, themes } = useContext(ThemeContext);

    const handleSelectTheme = async (themeKey) => {
        await changeTheme(themeKey);
        // 可以选择返回上一页
        // navigation.goBack();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Theme Settings</Text>
            </View>

            {/* Theme Options */}
            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Choose Theme
                </Text>

                {/* Light Theme */}
                <TouchableOpacity
                    style={[
                        styles.themeCard,
                        {
                            backgroundColor: theme.cardBackground,
                            borderColor: themeName === "light" ? theme.primary : theme.border,
                            borderWidth: themeName === "light" ? 2 : 1,
                        },
                    ]}
                    onPress={() => handleSelectTheme("light")}
                >
                    <View style={styles.themePreview}>
                        <View style={styles.previewBox}>
                            <View
                                style={[
                                    styles.previewHeader,
                                    { backgroundColor: themes.light.primary },
                                ]}
                            />
                            <View style={styles.previewBody}>
                                <View
                                    style={[
                                        styles.previewCard,
                                        { backgroundColor: "#F5F5F5" },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.previewCard,
                                        { backgroundColor: "#F5F5F5", marginTop: 8 },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.themeInfo}>
                        <Text style={[styles.themeName, { color: theme.text }]}>
                            Light Theme
                        </Text>
                        <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>
                            Clean and bright interface
                        </Text>
                    </View>
                    {themeName === "light" && (
                        <Icon name="check-circle" size={24} color={theme.primary} />
                    )}
                </TouchableOpacity>

                {/* Dark Theme */}
                <TouchableOpacity
                    style={[
                        styles.themeCard,
                        {
                            backgroundColor: theme.cardBackground,
                            borderColor: themeName === "dark" ? theme.primary : theme.border,
                            borderWidth: themeName === "dark" ? 2 : 1,
                            marginTop: 16,
                        },
                    ]}
                    onPress={() => handleSelectTheme("dark")}
                >
                    <View style={styles.themePreview}>
                        <View style={styles.previewBox}>
                            <View
                                style={[
                                    styles.previewHeader,
                                    { backgroundColor: themes.dark.primary },
                                ]}
                            />
                            <View style={[styles.previewBody, { backgroundColor: "#1E1E1E" }]}>
                                <View
                                    style={[
                                        styles.previewCard,
                                        { backgroundColor: "#2A2A2A" },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.previewCard,
                                        { backgroundColor: "#2A2A2A", marginTop: 8 },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.themeInfo}>
                        <Text style={[styles.themeName, { color: theme.text }]}>
                            Dark Theme
                        </Text>
                        <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>
                            Easy on the eyes in low light
                        </Text>
                    </View>
                    {themeName === "dark" && (
                        <Icon name="check-circle" size={24} color={theme.primary} />
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
    },
    headerText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    themeCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    themePreview: {
        marginRight: 16,
    },
    previewBox: {
        width: 60,
        height: 80,
        borderRadius: 8,
        overflow: "hidden",
    },
    previewHeader: {
        height: 20,
        backgroundColor: "#6C4AB6",
    },
    previewBody: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 6,
    },
    previewCard: {
        height: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
    },
    themeInfo: {
        flex: 1,
    },
    themeName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    themeDesc: {
        fontSize: 14,
    },
});


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

export default function LanguageSettingsScreen({ navigation }) {
    const { theme, languageCode, changeLanguage, languages } = useContext(ThemeContext);

    const handleSelectLanguage = async (langCode) => {
        await changeLanguage(langCode);
        // 可以选择返回上一页
        // navigation.goBack();
    };

    const languageList = Object.values(languages);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Language Settings</Text>
            </View>

            {/* Language Options */}
            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Choose Language
                </Text>

                {languageList.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        style={[
                            styles.languageCard,
                            {
                                backgroundColor: theme.cardBackground,
                                borderColor:
                                    languageCode === lang.code ? theme.primary : theme.border,
                                borderWidth: languageCode === lang.code ? 2 : 1,
                            },
                        ]}
                        onPress={() => handleSelectLanguage(lang.code)}
                    >
                        <View style={styles.languageInfo}>
                            <Text style={styles.flag}>{lang.flag}</Text>
                            <View style={styles.textInfo}>
                                <Text style={[styles.languageName, { color: theme.text }]}>
                                    {lang.name}
                                </Text>
                                <Text
                                    style={[styles.languageCode, { color: theme.textSecondary }]}
                                >
                                    {lang.code.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                        {languageCode === lang.code && (
                            <Icon name="check-circle" size={24} color={theme.primary} />
                        )}
                    </TouchableOpacity>
                ))}
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
    languageCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    languageInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    flag: {
        fontSize: 32,
        marginRight: 16,
    },
    textInfo: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    languageCode: {
        fontSize: 12,
    },
});


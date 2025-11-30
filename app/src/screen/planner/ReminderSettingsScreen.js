import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PurpleHeader from "../../components/PurpleHeader";
import PurpleCard from "../../components/PurpleCard";
import PurpleButton from "../../components/PurpleButton";

const REMINDER_KEY = "REMINDER_OFFSET";

const OPTIONS = [
    { label: "At the exact time", minutes: 0 },
    { label: "10 minutes before", minutes: 10 },
    { label: "30 minutes before", minutes: 30 },
    { label: "1 hour before", minutes: 60 },
    { label: "3 hours before", minutes: 180 },
    { label: "1 day before", minutes: 1440 },
];

export default function ReminderSettingsScreen({ navigation }) {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        loadSetting();
    }, []);

    const loadSetting = async () => {
        const saved = await AsyncStorage.getItem(REMINDER_KEY);
        if (saved !== null) {
            setSelected(Number(saved));
        }
    };

    const saveSetting = async () => {
        await AsyncStorage.setItem(REMINDER_KEY, String(selected));
        alert("Reminder settings saved!");
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <PurpleHeader
                title="Reminder Settings"
                onBack={() => navigation.goBack()}
            />

            <PurpleCard>
                <Text style={styles.sectionTitle}>Default Reminder Time</Text>
                <Text style={styles.description}>
                    Choose how early you want to be reminded before a task or assessment is due.
                </Text>

                {OPTIONS.map((opt) => (
                    <TouchableOpacity
                        key={opt.minutes}
                        style={[
                            styles.optionRow,
                            selected === opt.minutes && styles.optionActive,
                        ]}
                        onPress={() => setSelected(opt.minutes)}
                    >
                        <Text
                            style={[
                                styles.optionLabel,
                                selected === opt.minutes && styles.optionLabelActive,
                            ]}
                        >
                            {opt.label}
                        </Text>

                        {/* Radio */}
                        <View
                            style={[
                                styles.radio,
                                selected === opt.minutes && styles.radioActive,
                            ]}
                        />
                    </TouchableOpacity>
                ))}

                <PurpleButton label="Save Settings" onPress={saveSetting} />
            </PurpleCard>
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 10,
    },

    description: {
        color: "#777",
        marginBottom: 16,
    },

    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 14,
        marginBottom: 10,
        backgroundColor: "#EEE",
    },

    optionActive: {
        backgroundColor: "#6C4AB6",
    },

    optionLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#4A3A67",
    },

    optionLabelActive: {
        color: "white",
    },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "white",
        backgroundColor: "transparent",
    },

    radioActive: {
        backgroundColor: "#fff",
    },
});

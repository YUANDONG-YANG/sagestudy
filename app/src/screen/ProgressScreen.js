import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ProgressScreen() {
    /* ---------------- Static Demo Data ---------------- */

    const summary = {
        totalWords: 126,
        masteryRate: 68,
        streak: 8,
        studyTime: "3h 24m",
    };

    const weeklyActivity = [
        { day: "M", value: 2 },
        { day: "T", value: 5 },
        { day: "W", value: 3 },
        { day: "T", value: 4 },
        { day: "F", value: 1 },
        { day: "S", value: 0 },
        { day: "S", value: 2 },
    ];

    const vocabularyStatus = {
        mastered: 30,
        learning: 60,
        review: 36,
    };

    const recentWords = [
        { word: "Photosynthesis", status: "Mastered", date: "2024-11-22" },
        { word: "Ecosystem", status: "Learning", date: "2024-11-21" },
        { word: "Molecule", status: "Review", date: "2024-11-21" },
    ];

    const achievements = [
        { icon: "local-fire-department", name: "7-Day Streak", unlocked: true },
        { icon: "star", name: "50 Words Learned", unlocked: true },
        { icon: "emoji-events", name: "Mastery Level 1", unlocked: false },
        { icon: "workspace-premium", name: "Consistency Badge", unlocked: false },
    ];

    const recommendations = [
        "Review 10 learned words today.",
        "Practice spaced repetition for difficult words.",
        "Try a short quiz to reinforce mastery.",
    ];

    /* ---------------- State ---------------- */
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDays, setFilterDays] = useState("7");

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    <Icon name="bar-chart" size={22} /> My Progress
                </Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
                {renderSummaryCard("Total Words", summary.totalWords, "menu-book")}
                {renderSummaryCard("Mastery", summary.masteryRate + "%", "emoji-events")}
            </View>

            <View style={styles.summaryRow}>
                {renderSummaryCard("Streak", summary.streak + " days", "local-fire-department")}
                {renderSummaryCard("Study Time", summary.studyTime, "schedule")}
            </View>

            {/* Status Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Filters</Text>

                <View style={styles.filterRow}>
                    <FilterChip
                        label="All"
                        active={filterStatus === "All"}
                        onPress={() => setFilterStatus("All")}
                    />
                    <FilterChip
                        label="Mastered"
                        active={filterStatus === "Mastered"}
                        onPress={() => setFilterStatus("Mastered")}
                    />
                    <FilterChip
                        label="Learning"
                        active={filterStatus === "Learning"}
                        onPress={() => setFilterStatus("Learning")}
                    />
                    <FilterChip
                        label="Review"
                        active={filterStatus === "Review"}
                        onPress={() => setFilterStatus("Review")}
                    />
                </View>

                <View style={styles.filterRow}>
                    <FilterChip
                        label="7 Days"
                        active={filterDays === "7"}
                        onPress={() => setFilterDays("7")}
                    />
                    <FilterChip
                        label="30 Days"
                        active={filterDays === "30"}
                        onPress={() => setFilterDays("30")}
                    />
                    <FilterChip
                        label="90 Days"
                        active={filterDays === "90"}
                        onPress={() => setFilterDays("90")}
                    />
                </View>
            </View>

            {/* Weekly Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weekly Activity</Text>

                <View style={styles.weekRow}>
                    {weeklyActivity.map((d, i) => (
                        <View key={i} style={styles.weekCol}>
                            <View
                                style={[
                                    styles.activityDot,
                                    { opacity: 0.3 + d.value * 0.15 },
                                ]}
                            />
                            <Text style={styles.weekDay}>{d.day}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Vocabulary Status */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vocabulary Status</Text>

                {renderProgressBar("Mastered", vocabularyStatus.mastered, "#4CAF50")}
                {renderProgressBar("Learning", vocabularyStatus.learning, "#6C4AB6")}
                {renderProgressBar("Review", vocabularyStatus.review, "#FF9800")}
            </View>

            {/* Search */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Search Learned Words</Text>

                <View style={styles.row}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search words..."
                        value={search}
                        onChangeText={setSearch}
                    />
                    <TouchableOpacity
                        style={styles.searchBtn}
                        onPress={() => console.log("Search:", search)}
                    >
                        <Icon name="search" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recently Learned */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recently Learned</Text>

                {recentWords
                    .filter((w) =>
                        filterStatus === "All" ? true : w.status === filterStatus
                    )
                    .map((w, i) => (
                        <View key={i} style={styles.wordRow}>
                            <View>
                                <Text style={styles.word}>{w.word}</Text>
                                <Text style={styles.wordMeta}>
                                    {w.status} · {w.date}
                                </Text>
                            </View>
                            <Icon
                                name={
                                    w.status === "Mastered"
                                        ? "check-circle"
                                        : w.status === "Learning"
                                            ? "school"
                                            : "history"
                                }
                                size={24}
                                color={
                                    w.status === "Mastered"
                                        ? "#4CAF50"
                                        : w.status === "Learning"
                                            ? "#6C4AB6"
                                            : "#FF9800"
                                }
                            />
                        </View>
                    ))}
            </View>

            {/* Achievements */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>

                <View style={styles.achievementGrid}>
                    {achievements.map((a, i) => (
                        <View
                            key={i}
                            style={[
                                styles.achievementCard,
                                !a.unlocked && styles.lockedAchievement,
                            ]}
                        >
                            <Icon
                                name={a.icon}
                                size={36}
                                color={a.unlocked ? "#6C4AB6" : "#bbb"}
                            />
                            <Text
                                style={[
                                    styles.achievementLabel,
                                    !a.unlocked && styles.lockedText,
                                ]}
                            >
                                {a.name}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Study Recommendations</Text>

                {recommendations.map((r, i) => (
                    <View key={i} style={styles.recommendCard}>
                        <Icon name="lightbulb" size={22} color="#FFD740" />
                        <Text style={styles.recommendText}>{r}</Text>
                    </View>
                ))}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

/* ------------------- Helper Components ------------------- */

function renderSummaryCard(label, value, icon) {
    return (
        <View style={styles.summaryCard}>
            <Icon name={icon} size={28} color="#6C4AB6" />
            <Text style={styles.summaryValue}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    );
}

function FilterChip({ label, active, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.chip, active && styles.chipActive]}
        >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function renderProgressBar(label, value, color) {
    return (
        <View style={{ marginBottom: 15 }}>
            <Text style={styles.pbLabel}>
                {label} ({value})
            </Text>
            <View style={styles.pbTrack}>
                <View
                    style={[styles.pbFill, { width: `${value}%`, backgroundColor: color }]}
                />
            </View>
        </View>
    );
}

/* ------------------- Styles (Purple Theme) ------------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },

    headerText: { color: "#fff", fontSize: 22, fontWeight: "bold" },

    /* Summary Cards */
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginTop: 15,
    },

    summaryCard: {
        backgroundColor: "#F3EFFF",
        width: "48%",
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 2,
    },

    summaryValue: { fontSize: 24, fontWeight: "bold", marginTop: 8, color: "#4A3A67" },
    summaryLabel: { color: "#6C4AB6", marginTop: 3 },

    /* Sections */
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#4A3A67" },

    /* Filter Chips */
    filterRow: { flexDirection: "row", marginBottom: 10 },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
        backgroundColor: "#fff",
    },
    chipActive: {
        backgroundColor: "#6C4AB6",
        borderColor: "#6C4AB6",
    },
    chipText: { color: "#333" },
    chipTextActive: { color: "#fff", fontWeight: "600" },

    /* Weekly Activity */
    weekRow: { flexDirection: "row", justifyContent: "space-between" },
    weekCol: { alignItems: "center" },
    activityDot: {
        width: 16,
        height: 16,
        backgroundColor: "#6C4AB6",
        borderRadius: 8,
        marginBottom: 5,
    },
    weekDay: { fontSize: 12, color: "#444" },

    /* Progress Bars */
    pbLabel: { fontWeight: "600", marginBottom: 6, color: "#4A3A67" },
    pbTrack: {
        height: 12,
        backgroundColor: "#eee",
        borderRadius: 6,
        overflow: "hidden",
    },
    pbFill: {
        height: 12,
        borderRadius: 6,
    },

    /* Search */
    row: { flexDirection: "row", alignItems: "center" },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
        backgroundColor: "#FAF7FF",
        color: "#4A3A67",
    },
    searchBtn: {
        marginLeft: 10,
        backgroundColor: "#6C4AB6",
        padding: 12,
        borderRadius: 12,
    },

    /* Recently Learned */
    wordRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingVertical: 12,
    },
    word: { fontSize: 16, fontWeight: "600", color: "#4A3A67" },
    wordMeta: { fontSize: 12, color: "#777" },

    /* Achievements */
    achievementGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    achievementCard: {
        width: "48%",
        padding: 18,
        alignItems: "center",
        backgroundColor: "#F3EFFF",
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
    },
    lockedAchievement: { backgroundColor: "#eee" },
    achievementLabel: { marginTop: 8, fontWeight: "600", color: "#4A3A67" },
    lockedText: { color: "#999" },

    /* Recommendations */
    recommendCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF8E1",
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
    },
    recommendText: { marginLeft: 10, color: "#4A3A67", flex: 1 },
});

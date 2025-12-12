import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useContext } from "react";
import IconWithFallback from "../components/IconWithFallback";
import VocabularyAPI from "../services/api/vocabularyApi";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

export default function HomeScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const { showError } = useContext(ToastContext);
    const [dailyGoal, setDailyGoal] = useState(20);
    const [searchValue, setSearchValue] = useState("");
    const [stats, setStats] = useState({
        wordsLearned: 0,
        wordsToReview: 0,
        wordsToLearn: 0,
        streak: 0,
        todayProgress: 0,
    });
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const loadStats = async () => {
        try {
            setLoading(true);
            // 使用API获取数据
            const studyStats = await VocabularyAPI.getStudyStats();
            const history = await VocabularyAPI.getStudyHistory();
            const reviewWords = await VocabularyAPI.getWordsForReview();
            const learningWords = await VocabularyAPI.getWordsByStatus("learning");

            // 计算今天的进度
            const today = new Date().toISOString().split("T")[0];
            const todayCount = (history && history.dailyWordsLearned && history.dailyWordsLearned[today]) 
                ? history.dailyWordsLearned[today] 
                : 0;

            setStats({
                wordsLearned: studyStats?.mastered || 0,
                wordsToReview: reviewWords?.length || 0,
                wordsToLearn: learningWords?.length || 12,
                streak: history?.streak || 0,
                todayProgress: todayCount,
            });
        } catch (error) {
            if (__DEV__) {
                console.error("Load home stats error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            showError("Please enter a word to search.");
            return;
        }
        // 导航到Progress页面并传递搜索参数
        navigation.navigate("Progress", { searchQuery: searchValue.trim() });
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* ===== Header ===== */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerHello}>
                            👋 Hello, {user?.name ? (typeof user.name === 'string' ? user.name.split(" ")[0] : user.name) : "Student"}!
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Day {stats.streak || 1} of learning
                        </Text>
                    </View>

                    <View style={styles.streakBox}>
                        <View style={styles.streakCircle}>
                            <Text style={styles.streakIcon}>🔥</Text>
                            <Text style={styles.streakCount}>{stats.streak || 1}</Text>
                        </View>
                        <Text style={styles.streakLabel}>Day Streak</Text>
                    </View>
                </View>

                {/* ===== Search Card ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🔍 Search Vocabulary</Text>

                    <View style={styles.searchRow}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Type a word..."
                            value={searchValue}
                            onChangeText={setSearchValue}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <IconWithFallback name="search" size={22} color="#fff" useEmoji={true} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ===== Today's Goal ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📅 Today's Goal</Text>

                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>Learn {dailyGoal} new words</Text>
                        <Text style={styles.progressNumber}>
                            {stats.todayProgress}/{dailyGoal}
                        </Text>
                    </View>

                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${dailyGoal > 0 
                                        ? Math.min((stats.todayProgress / dailyGoal) * 100, 100) 
                                        : 0}%`,
                                },
                            ]}
                        />
                    </View>

                    <Text style={styles.smallMuted}>
                        ⏱ {Math.max(dailyGoal - stats.todayProgress, 0)} words left to finish today's goal
                    </Text>
                </View>

                {/* ===== Adjust Daily Goal ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>⚙️ Adjust Daily Goal</Text>

                    <Text style={styles.sliderLabel}>
                        Words per day: <Text style={styles.sliderValue}>{dailyGoal}</Text>
                    </Text>

                    <Text style={styles.mutedSmall}>(* Slider available in full version)</Text>
                </View>

                {/* ===== Section Title ===== */}
                <Text style={styles.sectionTitle}>Choose Learning Mode</Text>

                {/* ===== Learn New Words ===== */}
                <TouchableOpacity
                    style={styles.modeCard}
                    onPress={() => {
                        // 导航到Learn tab的LearnMain屏幕
                        navigation.navigate("Learn", { screen: "LearnMain" });
                    }}
                >
                    <View style={styles.modeIcon}>
                        <Text style={styles.modeIconText}>📘</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.modeTitle}>Learn New Words</Text>
                        <Text style={styles.modeDesc}>
                            {stats.wordsToLearn} words waiting
                        </Text>
                    </View>
                    <IconWithFallback name="chevron-right" size={28} color="#777" useEmoji={true} />
                </TouchableOpacity>

                {/* ===== Review ===== */}
                <TouchableOpacity
                    style={styles.modeCard}
                    onPress={() => {
                        // 先导航到Learn tab，然后导航到Review
                        navigation.navigate("Learn", { screen: "Review" });
                    }}
                >
                    <View style={[styles.modeIcon, { backgroundColor: "#E0FFE4" }]}>
                        <Text style={styles.modeIconText}>🔄</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.modeTitle}>Review Words</Text>
                        <Text style={styles.modeDesc}>
                            {stats.wordsToReview} words to review
                        </Text>
                    </View>
                    <IconWithFallback name="chevron-right" size={28} color="#777" useEmoji={true} />
                </TouchableOpacity>

                {/* ===== Quick Test ===== */}
                <TouchableOpacity
                    style={styles.modeCard}
                    onPress={() => {
                        // 先导航到Learn tab，然后导航到Test
                        navigation.navigate("Learn", { screen: "Test" });
                    }}
                >
                    <View style={[styles.modeIcon, { backgroundColor: "#FFF5CD" }]}>
                        <Text style={styles.modeIconText}>⚡</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.modeTitle}>Quick Test</Text>
                        <Text style={styles.modeDesc}>Challenge yourself</Text>
                    </View>
                    <IconWithFallback name="chevron-right" size={28} color="#777" useEmoji={true} />
                </TouchableOpacity>

                {/* ===== Weekly Stats ===== */}
                <View style={styles.statsCard}>
                    <Text style={styles.cardTitle}>📊 This Week</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{stats.wordsLearned}</Text>
                            <Text style={styles.statLabel}>Words Learned</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
                                {stats.wordsLearned + stats.wordsToLearn > 0
                                    ? Math.round(
                                          (stats.wordsLearned /
                                              (stats.wordsLearned + stats.wordsToLearn)) *
                                              100
                                      )
                                    : 0}
                                %
                            </Text>
                            <Text style={styles.statLabel}>Mastery</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[styles.statNumber, { color: "#FF9800" }]}>
                                {stats.streak}
                            </Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

/* ================= Styles (Purple Theme Unified) ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    /* Header */
    header: {
        padding: 24,
        backgroundColor: "#6C4AB6",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    headerHello: {
        fontSize: 24,
        fontWeight: "700",
        color: "#fff",
    },
    headerSubtitle: {
        color: "#F0E7FF",
        marginTop: 4,
    },

    streakBox: {
        alignItems: "center",
    },
    streakCircle: {
        width: 54,
        height: 54,
        borderRadius: 30,
        backgroundColor: "#FFC107",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    streakIcon: {
        fontSize: 18,
    },
    streakCount: {
        marginLeft: 4,
        fontSize: 18,
        fontWeight: "700",
    },
    streakLabel: {
        color: "#fff",
        marginTop: 6,
    },

    /* Cards */
    card: {
        backgroundColor: "#ffffff",
        marginHorizontal: 18,
        marginTop: 18,
        padding: 20,
        borderRadius: 22,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 12,
    },

    /* Search */
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        backgroundColor: "#F3EFFF",
        padding: 12,
        borderRadius: 16,
        color: "#4A3A67",
    },
    searchButton: {
        backgroundColor: "#6C4AB6",
        padding: 12,
        borderRadius: 16,
        marginLeft: 10,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3,
    },

    /* Today's Goal */
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    progressText: { fontWeight: "600", color: "#4A3A67" },
    progressNumber: { color: "#6C4AB6", fontWeight: "700" },

    progressBar: {
        height: 10,
        backgroundColor: "#E9D9FF",
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 6,
        marginTop: 4,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#6C4AB6",
    },
    smallMuted: {
        color: "#777",
        fontSize: 13,
    },

    /* Daily Goal */
    sliderLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4A3A67",
    },
    sliderValue: {
        color: "#6C4AB6",
        fontWeight: "700",
        fontSize: 16,
    },
    mutedSmall: { color: "#999", marginTop: 4, fontSize: 12 },

    /* Section Title */
    sectionTitle: {
        marginTop: 26,
        marginLeft: 20,
        fontSize: 18,
        color: "#4A3A67",
        fontWeight: "700",
    },

    /* Mode Cards */
    modeCard: {
        backgroundColor: "#ffffff",
        marginHorizontal: 18,
        marginTop: 14,
        padding: 16,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    modeIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#E5DEFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    modeIconText: {
        fontSize: 22,
    },
    modeTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4A3A67",
    },
    modeDesc: {
        color: "#777",
        fontSize: 13,
        marginTop: 2,
    },

    /* Weekly Stats */
    statsCard: {
        backgroundColor: "#ffffff",
        padding: 22,
        marginHorizontal: 18,
        marginTop: 24,
        borderRadius: 24,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 14,
    },
    statBox: { alignItems: "center" },
    statNumber: {
        fontSize: 22,
        fontWeight: "700",
        color: "#6C4AB6",
    },
    statLabel: {
        color: "#777",
        fontSize: 12,
        marginTop: 4,
    },
});

import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import VocabularyAPI from "../services/api/vocabularyApi";
import { initializeWords } from "../data/learning/InitialWords";
import { ToastContext } from "../context/ToastContext";
import LoadingOverlay from "../components/LoadingOverlay";

export default function LearnScreen({ navigation }) {
    const { showSuccess, showError } = useContext(ToastContext);
    const [currentWord, setCurrentWord] = useState(null);
    const [wordsToLearn, setWordsToLearn] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [confidence, setConfidence] = useState(3);
    const [notes, setNotes] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [options, setOptions] = useState([]);

    const confidenceLabel = {
        1: "Level 1 - Need Practice",
        2: "Level 2 - Somewhat Confident",
        3: "Level 3 - Moderate",
        4: "Level 4 - Very Confident",
        5: "Level 5 - Mastered",
    };

    useEffect(() => {
        loadWords();
    }, []);

    useEffect(() => {
        if (wordsToLearn.length > 0 && currentIndex < wordsToLearn.length) {
            setupCurrentWord(wordsToLearn[currentIndex]);
        }
    }, [currentIndex, wordsToLearn]);

    const loadWords = async () => {
        try {
            setLoading(true);
            // Initialize vocabulary if needed
            await initializeWords();

            // Fetch vocabulary using API
            const allWords = await VocabularyAPI.getAllWords();
            const learningWords = allWords.filter(
                (w) => w.status === "learning" || !w.lastReviewed
            );

            let wordsToSet = [];
            if (learningWords.length === 0) {
                // If no learning words, select from all words
                wordsToSet = allWords.slice(0, 12); // Maximum 12 words
            } else {
                wordsToSet = learningWords.slice(0, 12);
            }
            
            if (wordsToSet.length === 0) {
                showError("No words available to learn. Please add some words first.");
                navigation.goBack();
                return;
            }
            
            setWordsToLearn(wordsToSet);
            setCurrentIndex(0); // Reset index
        } catch (error) {
            showError("Failed to load words. Please try again.");
            if (__DEV__) {
                console.error("Load words error:", error);
            }
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const setupCurrentWord = (word) => {
        setCurrentWord(word);
        setNotes(word.notes || "");
        setConfidence(word.confidence || 3);
        setDifficulty(word.difficulty || "medium");
        setSelectedOption(null);

        // Generate options (including correct answer and 3 other random words)
        generateOptions(word);
    };

    const generateOptions = (word) => {
        // Simplified here, should actually select related words from vocabulary library
        const wrongOptions = ["Banana", "Orange", "Grapes"];
        const allOptions = [
            { label: word.word, correct: true },
            { label: wrongOptions[0], correct: false },
            { label: wrongOptions[1], correct: false },
            { label: wrongOptions[2], correct: false },
        ];

        // Randomly shuffle options
        const shuffled = allOptions.sort(() => Math.random() - 0.5);
        setOptions(shuffled);
    };

    const handleNext = async () => {
        if (!currentWord) return;

        setSaving(true);
        try {
            // Save complete learning progress, including difficulty, confidence level, notes, etc.
            await VocabularyAPI.updateWordProgress(currentWord.id, {
                difficulty: difficulty,
                confidence: confidence,
                notes: notes,
                lastReviewed: new Date().toISOString(),
                // If confidence level is high, update status
                status: confidence >= 4 ? "mastered" : confidence >= 3 ? "learning" : "review",
            });

            // 更新学习历史
            await VocabularyAPI.updateStudyHistory(5, 1); // 5分钟，1个词

            // 移动到下一个单词
            if (currentIndex < wordsToLearn.length - 1) {
                setCurrentIndex(currentIndex + 1);
                showSuccess("Progress saved!");
            } else {
                // 完成所有单词
                showSuccess("Congratulations! You've completed this learning session!");
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            }
        } catch (error) {
            showError("Failed to save progress. Please try again.");
            if (__DEV__) {
                console.error("Save progress error:", error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = () => {
        if (currentIndex < wordsToLearn.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.goBack();
        }
    };

    if (loading || !currentWord || wordsToLearn.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C4AB6" />
                <Text style={styles.loadingText}>
                    {loading ? "Loading words..." : "No words available"}
                </Text>
            </View>
        );
    }

    const progress = wordsToLearn.length > 0 
        ? ((currentIndex + 1) / wordsToLearn.length) * 100 
        : 0;

    return (
        <View style={styles.container}>
            <LoadingOverlay visible={saving} message="Saving progress..." />
            {/* ===== Header / Progress Bar ===== */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="close" size={26} color="#fff" />
                </TouchableOpacity>

                <View style={styles.progressWrapper}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                <Text style={styles.progressCount}>
                    {currentIndex + 1}/{wordsToLearn.length}
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                {/* ===== Difficulty Card ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🎚 Difficulty Level</Text>

                    <View style={styles.diffRow}>
                        <TouchableOpacity
                            style={[
                                styles.diffButton,
                                { backgroundColor: difficulty === "easy" ? "#DFF8E3" : "#EEE" },
                            ]}
                            onPress={() => setDifficulty("easy")}
                        >
                            <Text style={styles.diffText}>😊 Easy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.diffButton,
                                { backgroundColor: difficulty === "medium" ? "#FFF4C6" : "#EEE" },
                            ]}
                            onPress={() => setDifficulty("medium")}
                        >
                            <Text style={styles.diffText}>😐 Medium</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.diffButton,
                                { backgroundColor: difficulty === "hard" ? "#FFD9D9" : "#EEE" },
                            ]}
                            onPress={() => setDifficulty("hard")}
                        >
                            <Text style={styles.diffText}>😟 Hard</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ===== Word Card ===== */}
                <View style={styles.wordCard}>
                    {currentWord.imageUrl && (
                        <Image source={{ uri: currentWord.imageUrl }} style={styles.wordImage} />
                    )}

                    <Text style={styles.wordTitle}>{currentWord.word}</Text>

                    {currentWord.pronunciation && (
                        <View style={styles.pronounceRow}>
                            <Text style={styles.pronounceText}>{currentWord.pronunciation}</Text>
                            <TouchableOpacity 
                                style={styles.voiceBtn}
                                onPress={() => {
                                    // 语音播放功能（需要TTS库）
                                    showSuccess(`Pronunciation: ${currentWord.pronunciation}`);
                                }}
                            >
                                <Icon name="volume-up" size={20} color="#6C4AB6" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.definitionBox}>
                        <Text style={styles.badge}>n. 名词</Text>
                        <Text style={styles.definition}>
                            {currentWord.translation || currentWord.definition}
                        </Text>
                    </View>

                    {/* Example */}
                    {currentWord.example && (
                        <View style={styles.exampleBox}>
                            <Text style={styles.exampleTitle}>💬 Example</Text>

                            <View style={styles.exampleCard}>
                                <Text>{currentWord.example}</Text>
                                {currentWord.exampleTranslation && (
                                    <Text style={styles.exampleCN}>{currentWord.exampleTranslation}</Text>
                                )}
                            </View>
                        </View>
                    )}
                </View>

                {/* ===== Notes ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📝 Add Your Notes</Text>

                    <TextInput
                        style={styles.notesInput}
                        placeholder="Write your own notes or sentences..."
                        multiline
                        value={notes}
                        onChangeText={setNotes}
                    />

                    <Text style={styles.tipText}>💡 Writing short notes helps reinforce memory!</Text>
                </View>

                {/* ===== Image Selection Question ===== */}
                {options.length > 0 && (
                    <>
                        <Text style={styles.selectionPrompt}>
                            ✔ Select the image that matches "{currentWord.word}"
                        </Text>

                        <View style={styles.optionsGrid}>
                            {options.map((option, index) => (
                                <ImageOption
                                    key={index}
                                    label={option.label}
                                    img={
                                        option.correct && currentWord.imageUrl
                                            ? currentWord.imageUrl
                                            : "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200"
                                    }
                                    selected={selectedOption === index}
                                    onPress={() => setSelectedOption(index)}
                                />
                            ))}
                        </View>
                    </>
                )}

                {/* ===== Confidence Slider ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>😊 Confidence Level</Text>

                    <View style={styles.center}>
                        <Text style={styles.confidenceBadge}>{confidenceLabel[confidence]}</Text>
                    </View>

                    <View style={styles.confRow}>
                        <Text style={styles.confHint}>Not confident</Text>
                        <Text style={styles.confHint}>Very confident</Text>
                    </View>

                    <View style={styles.sliderRow}>
                        {[1, 2, 3, 4, 5].map((v, i) => (
                            <TouchableOpacity
                                key={v}
                                style={[
                                    styles.sliderDot,
                                    confidence === v && styles.sliderDotActive,
                                ]}
                                onPress={() => setConfidence(v)}
                            >
                                <Text style={styles.sliderEmoji}>
                                    {["😟", "😐", "🙂", "😊", "😄"][i]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ===== Action Buttons ===== */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: "#F3EFFF" }]}
                        onPress={handleSkip}
                    >
                        <Icon name="flag" size={26} color="#6C4AB6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: "#E8F4FF" }]}
                        onPress={async () => {
                            if (!currentWord) return;
                            try {
                                // 将单词标记为收藏（更新单词的favorite字段）
                                await VocabularyAPI.updateWordProgress(currentWord.id, {
                                    favorite: true,
                                });
                                showSuccess("Word saved to favorites! ⭐");
                            } catch (error) {
                                showError("Failed to save to favorites.");
                                if (__DEV__) {
                                    console.error("Favorite error:", error);
                                }
                            }
                        }}
                    >
                        <Icon name="bookmark" size={26} color="#6C4AB6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: "#6C4AB6" }]}
                        onPress={handleNext}
                    >
                        <Icon name="arrow-forward" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Skip */}
                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip this word →</Text>
                </TouchableOpacity>

                {/* Tip */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipTitle}>💡 Learning Tip</Text>
                    <Text style={styles.tipBody}>
                        Try making your own sentences to improve memory retention!
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

/* ---------------- Helper Components ---------------- */

const ImageOption = ({ img, label, onPress, selected }) => (
    <TouchableOpacity
        style={[styles.optionCard, selected && styles.optionSelected]}
        onPress={onPress}
    >
        <Image source={{ uri: img }} style={styles.optionImage} />
        <Text style={styles.optionLabel}>{label}</Text>
    </TouchableOpacity>
);

/* ================= Styles (Unified Purple Theme) ================= */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    loadingText: {
        marginTop: 10,
        color: "#777",
        fontSize: 16,
    },

    /* Header */
    topBar: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#6C4AB6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    progressWrapper: {
        flex: 1,
        marginHorizontal: 10,
    },
    progressTrack: {
        height: 8,
        backgroundColor: "#E0CFFF",
        borderRadius: 10,
    },
    progressFill: {
        height: 8,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    progressCount: {
        color: "white",
        fontWeight: "600",
    },

    /* Card */
    card: {
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 18,
        marginTop: 18,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    cardTitle: {
        fontWeight: "700",
        fontSize: 17,
        color: "#4A3A67",
        marginBottom: 10,
    },

    /* Diff Buttons */
    diffRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    diffButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },
    diffText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#4A3A67",
    },

    /* Word Card */
    wordCard: {
        marginTop: 20,
        marginHorizontal: 16,
        backgroundColor: "#ffffff",
        borderRadius: 24,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
        paddingBottom: 20,
    },
    wordImage: {
        height: 220,
        width: "100%",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    wordTitle: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 16,
        color: "#4A3A67",
    },

    pronounceRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 4,
        alignItems: "center",
    },
    pronounceText: {
        fontSize: 18,
        color: "#6C4AB6",
    },
    voiceBtn: {
        marginLeft: 10,
        padding: 6,
        borderRadius: 10,
        backgroundColor: "#F3EFFF",
    },

    definitionBox: {
        marginTop: 16,
        paddingHorizontal: 20,
    },
    badge: {
        backgroundColor: "#F3EFFF",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignSelf: "flex-start",
        color: "#6C4AB6",
        fontWeight: "600",
        marginBottom: 5,
    },
    definition: {
        fontSize: 16,
        color: "#4A3A67",
        lineHeight: 22,
    },

    /* Example */
    exampleBox: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    exampleTitle: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
        color: "#6C4AB6",
    },
    exampleCard: {
        backgroundColor: "#F8F8FF",
        padding: 12,
        borderRadius: 12,
    },
    exampleCN: {
        color: "#777",
        marginTop: 4,
    },

    /* Notes */
    notesInput: {
        backgroundColor: "#F3EFFF",
        borderRadius: 16,
        padding: 14,
        minHeight: 90,
        color: "#4A3A67",
        marginBottom: 6,
    },
    tipText: {
        fontSize: 13,
        color: "#777",
    },

    /* Image Selection */
    selectionPrompt: {
        textAlign: "center",
        color: "#4A3A67",
        marginTop: 20,
        fontWeight: "700",
        fontSize: 15,
    },
    optionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginTop: 12,
    },
    optionCard: {
        width: "48%",
        marginBottom: 16,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    optionSelected: {
        borderWidth: 3,
        borderColor: "#6C4AB6",
    },
    optionImage: {
        width: "100%",
        height: 110,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    optionLabel: {
        textAlign: "center",
        marginVertical: 8,
        fontSize: 14,
        color: "#4A3A67",
    },

    /* Confidence Slider */
    center: {
        alignItems: "center",
        marginBottom: 8,
    },
    confidenceBadge: {
        backgroundColor: "#6C4AB6",
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        fontWeight: "600",
    },
    confRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    confHint: { color: "#777", fontSize: 12 },

    sliderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    sliderDot: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#EEE",
        alignItems: "center",
        justifyContent: "center",
    },
    sliderDotActive: {
        backgroundColor: "#6C4AB6",
    },
    sliderEmoji: {
        fontSize: 22,
    },

    /* Action Buttons */
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 22,
        paddingHorizontal: 16,
    },
    actionBtn: {
        width: "31%",
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: "center",
    },

    /* Skip */
    skipBtn: {
        marginTop: 10,
        alignItems: "center",
    },
    skipText: {
        color: "#999",
        fontSize: 14,
        fontWeight: "500",
    },

    /* Tip */
    tipCard: {
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor: "#F8F8FF",
        padding: 18,
        borderRadius: 18,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    tipTitle: {
        fontWeight: "700",
        marginBottom: 6,
        color: "#4A3A67",
    },
    tipBody: {
        color: "#555",
        lineHeight: 20,
    },
});

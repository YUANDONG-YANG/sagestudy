import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import VocabularyAPI from "../services/api/vocabularyApi";
import { ToastContext } from "../context/ToastContext";
import LoadingOverlay from "../components/LoadingOverlay";

export default function ReviewScreen({ navigation }) {
    const { showSuccess, showError } = useContext(ToastContext);
    const [currentWord, setCurrentWord] = useState(null);
    const [wordsToReview, setWordsToReview] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadWords();
    }, []);

    useEffect(() => {
        if (wordsToReview.length > 0 && currentIndex < wordsToReview.length) {
            setCurrentWord(wordsToReview[currentIndex]);
            setShowAnswer(false);
        }
    }, [currentIndex, wordsToReview]);

    const loadWords = async () => {
        try {
            setLoading(true);
            const words = await VocabularyAPI.getWordsForReview();
            
            if (words.length === 0) {
                showSuccess("Great! No words to review right now. Keep learning!");
                setTimeout(() => navigation.goBack(), 1500);
                return;
            }

            setWordsToReview(words);
            setCurrentWord(words[0]);
        } catch (error) {
            showError("Failed to load words for review.");
            if (__DEV__) {
                console.error("Load review words error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (remembered) => {
        if (!currentWord) return;

        try {
            setSaving(true);
            
            // 更新单词的复习状态
            if (remembered) {
                // 如果记住了，增加掌握度
                await VocabularyAPI.updateWordProgress(currentWord.id, {
                    lastReviewed: new Date().toISOString(),
                    reviewCount: (currentWord.reviewCount || 0) + 1,
                    difficulty: currentWord.difficulty === "hard" ? "medium" : currentWord.difficulty === "medium" ? "easy" : "easy",
                });
                showSuccess("Good job! You remembered it! 🎉");
            } else {
                // 如果没记住，需要再次复习
                await VocabularyAPI.updateWordProgress(currentWord.id, {
                    lastReviewed: new Date().toISOString(),
                    reviewCount: (currentWord.reviewCount || 0) + 1,
                    difficulty: "hard",
                });
                showSuccess("Marked for review again. Keep practicing! 💪");
            }

            // 移动到下一个单词
            if (currentIndex < wordsToReview.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                // 完成所有复习
                showSuccess("You've finished reviewing all words! Great work! 🎊");
                setTimeout(() => navigation.goBack(), 1500);
            }
        } catch (error) {
            showError("Failed to save progress. Please try again.");
            if (__DEV__) {
                console.error("Review error:", error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = () => {
        if (currentIndex < wordsToReview.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            showSuccess("Review session completed!");
            navigation.goBack();
        }
    };

    if (loading) {
        return <LoadingOverlay visible={loading} />;
    }

    if (!currentWord || wordsToReview.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Review Words</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>🎉 No words to review!</Text>
                    <Text style={styles.emptySubtext}>Keep learning to add more words for review.</Text>
                </View>
            </View>
        );
    }

    const progress = ((currentIndex + 1) / wordsToReview.length) * 100;

    return (
        <View style={styles.container}>
            <LoadingOverlay visible={saving} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    Review ({currentIndex + 1}/{wordsToReview.length})
                </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Word Card */}
                <View style={styles.wordCard}>
                    {currentWord.imageUrl && (
                        <Image source={{ uri: currentWord.imageUrl }} style={styles.wordImage} />
                    )}

                    <Text style={styles.wordTitle}>{currentWord.word}</Text>

                    {currentWord.pronunciation && (
                        <Text style={styles.pronunciation}>{currentWord.pronunciation}</Text>
                    )}

                    {showAnswer && (
                        <View style={styles.answerBox}>
                            <Text style={styles.answerLabel}>Definition:</Text>
                            <Text style={styles.answerText}>
                                {currentWord.translation || currentWord.definition}
                            </Text>
                            
                            {currentWord.example && (
                                <>
                                    <Text style={styles.answerLabel}>Example:</Text>
                                    <Text style={styles.exampleText}>{currentWord.example}</Text>
                                </>
                            )}
                        </View>
                    )}

                    {!showAnswer && (
                        <TouchableOpacity
                            style={styles.showAnswerBtn}
                            onPress={() => setShowAnswer(true)}
                        >
                            <Text style={styles.showAnswerText}>Show Answer</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Action Buttons */}
                {showAnswer && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.forgotBtn]}
                            onPress={() => handleReview(false)}
                            disabled={saving}
                        >
                            <Icon name="close" size={24} color="#fff" />
                            <Text style={styles.actionBtnText}>Forgot</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.rememberBtn]}
                            onPress={() => handleReview(true)}
                            disabled={saving}
                        >
                            <Icon name="check" size={24} color="#fff" />
                            <Text style={styles.actionBtnText}>Remembered</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Skip Button */}
                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip this word →</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        backgroundColor: "#6C4AB6",
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
    progressContainer: {
        height: 4,
        backgroundColor: "#E0E0E0",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#6C4AB6",
    },
    scrollView: {
        flex: 1,
    },
    wordCard: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 24,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    wordImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: "#F0F0F0",
    },
    wordTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    pronunciation: {
        fontSize: 18,
        color: "#666",
        marginBottom: 20,
        fontStyle: "italic",
    },
    answerBox: {
        width: "100%",
        marginTop: 20,
        padding: 16,
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
    },
    answerLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        fontWeight: "600",
    },
    answerText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 16,
    },
    exampleText: {
        fontSize: 16,
        color: "#555",
        fontStyle: "italic",
    },
    showAnswerBtn: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#6C4AB6",
        borderRadius: 25,
    },
    showAnswerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        marginTop: 20,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        minWidth: 140,
        justifyContent: "center",
    },
    forgotBtn: {
        backgroundColor: "#FF6B6B",
    },
    rememberBtn: {
        backgroundColor: "#4CAF50",
    },
    actionBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    skipBtn: {
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 40,
        paddingVertical: 12,
    },
    skipText: {
        color: "#6C4AB6",
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    emptySubtext: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
});


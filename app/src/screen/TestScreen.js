import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import VocabularyAPI from "../services/api/vocabularyApi";
import { ToastContext } from "../context/ToastContext";
import LoadingOverlay from "../components/LoadingOverlay";

export default function TestScreen({ navigation }) {
    const { showSuccess, showError } = useContext(ToastContext);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [testFinished, setTestFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            // 获取已掌握的单词用于测试
            const allWords = await VocabularyAPI.getAllWords();
            const masteredWords = allWords.filter(
                (w) => w.status === "mastered" || w.status === "learning"
            );

            if (masteredWords.length < 4) {
                showError("Not enough words for a test. Please learn more words first.");
                setTimeout(() => navigation.goBack(), 2000);
                return;
            }

            // 生成10道测试题（从掌握的单词中随机选择）
            const shuffled = [...masteredWords].sort(() => Math.random() - 0.5);
            const selectedWords = shuffled.slice(0, Math.min(10, masteredWords.length));

            const generatedQuestions = selectedWords.map((word, index) => {
                // 为每道题生成4个选项（1个正确答案 + 3个干扰项）
                const wrongAnswers = masteredWords
                    .filter((w) => w.id !== word.id)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map((w) => w.translation || w.definition);

                const correctAnswer = word.translation || word.definition;
                const allAnswers = [correctAnswer, ...wrongAnswers].sort(
                    () => Math.random() - 0.5
                );

                return {
                    id: word.id || `q${index}`,
                    word: word.word,
                    correctAnswer: correctAnswer,
                    options: allAnswers,
                    correctIndex: allAnswers.indexOf(correctAnswer),
                };
            });

            setQuestions(generatedQuestions);
        } catch (error) {
            showError("Failed to load test questions.");
            if (__DEV__) {
                console.error("Load test questions error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = () => {
        setTestStarted(true);
        setScore(0);
        setCurrentIndex(0);
        setSelectedAnswer(null);
    };

    const handleSelectAnswer = (index) => {
        if (testFinished || selectedAnswer !== null) return;
        setSelectedAnswer(index);
    };

    const handleNext = async () => {
        const currentQuestion = questions[currentIndex];
        const isCorrect = selectedAnswer === currentQuestion.correctIndex;

        if (isCorrect) {
            setScore(score + 1);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
        } else {
            // 完成测试
            await finishTest();
        }
    };

    const finishTest = async () => {
        try {
            setSaving(true);
            setTestFinished(true);
            const percentage = Math.round((score / questions.length) * 100);

            // 更新学习历史
            await VocabularyAPI.updateStudyHistory(5, 0); // 5分钟学习时间

            if (percentage >= 80) {
                showSuccess(`Excellent! You got ${score}/${questions.length} correct! 🎉`);
            } else if (percentage >= 60) {
                showSuccess(`Good job! You got ${score}/${questions.length} correct! 👍`);
            } else {
                showSuccess(
                    `You got ${score}/${questions.length} correct. Keep practicing! 💪`
                );
            }
        } catch (error) {
            if (__DEV__) {
                console.error("Finish test error:", error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleRestart = () => {
        setTestStarted(false);
        setTestFinished(false);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        loadQuestions();
    };

    if (loading) {
        return <LoadingOverlay visible={loading} />;
    }

    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Quick Test</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Not enough words for a test</Text>
                    <Text style={styles.emptySubtext}>
                        Please learn more words before taking a test.
                    </Text>
                </View>
            </View>
        );
    }

    if (!testStarted) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Quick Test</Text>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.startCard}>
                        <Text style={styles.startIcon}>⚡</Text>
                        <Text style={styles.startTitle}>Ready to Test?</Text>
                        <Text style={styles.startDesc}>
                            This test has {questions.length} questions. Choose the correct
                            translation for each word.
                        </Text>
                        <TouchableOpacity style={styles.startBtn} onPress={handleStartTest}>
                            <Text style={styles.startBtnText}>Start Test</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (testFinished) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <View style={styles.container}>
                <LoadingOverlay visible={saving} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Test Results</Text>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.resultCard}>
                        <Text style={styles.resultIcon}>
                            {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
                        </Text>
                        <Text style={styles.resultScore}>
                            {score}/{questions.length}
                        </Text>
                        <Text style={styles.resultPercentage}>{percentage}%</Text>
                        <Text style={styles.resultMessage}>
                            {percentage >= 80
                                ? "Excellent work!"
                                : percentage >= 60
                                ? "Good job! Keep practicing!"
                                : "Keep learning! You'll get better!"}
                        </Text>

                        <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
                            <Text style={styles.restartBtnText}>Take Another Test</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backBtnText}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    Question {currentIndex + 1}/{questions.length}
                </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Question Card */}
                <View style={styles.questionCard}>
                    <Text style={styles.questionWord}>{currentQuestion.word}</Text>
                    <Text style={styles.questionPrompt}>
                        What is the correct translation?
                    </Text>

                    {/* Answer Options */}
                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => {
                            let buttonStyle = styles.optionButton;
                            if (selectedAnswer !== null) {
                                if (index === currentQuestion.correctIndex) {
                                    buttonStyle = styles.optionButtonCorrect;
                                } else if (
                                    index === selectedAnswer &&
                                    index !== currentQuestion.correctIndex
                                ) {
                                    buttonStyle = styles.optionButtonWrong;
                                }
                            } else {
                                if (selectedAnswer === index) {
                                    buttonStyle = styles.optionButtonSelected;
                                }
                            }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={buttonStyle}
                                    onPress={() => handleSelectAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedAnswer !== null &&
                                                index === currentQuestion.correctIndex &&
                                                styles.optionTextCorrect,
                                            selectedAnswer !== null &&
                                                index === selectedAnswer &&
                                                index !== currentQuestion.correctIndex &&
                                                styles.optionTextWrong,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                    {selectedAnswer !== null &&
                                        index === currentQuestion.correctIndex && (
                                            <Icon name="check-circle" size={24} color="#4CAF50" />
                                        )}
                                    {selectedAnswer !== null &&
                                        index === selectedAnswer &&
                                        index !== currentQuestion.correctIndex && (
                                            <Icon name="cancel" size={24} color="#FF6B6B" />
                                        )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Next Button */}
                    {selectedAnswer !== null && (
                        <TouchableOpacity
                            style={styles.nextBtn}
                            onPress={handleNext}
                            disabled={saving}
                        >
                            <Text style={styles.nextBtnText}>
                                {currentIndex < questions.length - 1 ? "Next" : "Finish"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
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
    startCard: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 32,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    startIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    startTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    startDesc: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 24,
    },
    startBtn: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 25,
    },
    startBtnText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    questionCard: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    questionWord: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 16,
    },
    questionPrompt: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
    },
    optionsContainer: {
        marginTop: 8,
    },
    optionButton: {
        backgroundColor: "#F5F5F5",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    optionButtonSelected: {
        backgroundColor: "#E8F4FF",
        borderWidth: 2,
        borderColor: "#6C4AB6",
    },
    optionButtonCorrect: {
        backgroundColor: "#E8F5E9",
        borderWidth: 2,
        borderColor: "#4CAF50",
    },
    optionButtonWrong: {
        backgroundColor: "#FFEBEE",
        borderWidth: 2,
        borderColor: "#FF6B6B",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    optionTextCorrect: {
        color: "#4CAF50",
        fontWeight: "600",
    },
    optionTextWrong: {
        color: "#FF6B6B",
    },
    nextBtn: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    nextBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    resultCard: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 32,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    resultIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    resultScore: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    resultPercentage: {
        fontSize: 32,
        fontWeight: "600",
        color: "#6C4AB6",
        marginBottom: 16,
    },
    resultMessage: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        marginBottom: 32,
    },
    restartBtn: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 25,
        marginBottom: 12,
        width: "100%",
    },
    restartBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    backBtn: {
        paddingVertical: 12,
        width: "100%",
    },
    backBtnText: {
        color: "#6C4AB6",
        fontSize: 16,
        textAlign: "center",
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


import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function LearnScreen({ navigation }) {
    const [selectedOption, setSelectedOption] = useState("C");
    const [confidence, setConfidence] = useState(3);
    const [notes, setNotes] = useState("");

    const confidenceLabel = {
        1: "Level 1 - Need Practice",
        2: "Level 2 - Somewhat Confident",
        3: "Level 3 - Moderate",
        4: "Level 4 - Very Confident",
        5: "Level 5 - Mastered",
    };

    return (
        <View style={styles.container}>
            {/* ===== Header / Progress Bar ===== */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="close" size={26} color="#fff" />
                </TouchableOpacity>

                <View style={styles.progressWrapper}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: "25%" }]} />
                    </View>
                </View>

                <Text style={styles.progressCount}>3/12</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

                {/* ===== Difficulty Card ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🎚 Difficulty Level</Text>

                    <View style={styles.diffRow}>
                        <DiffButton label="😊 Easy" color="#DFF8E3" />
                        <DiffButton label="😐 Medium" color="#FFF4C6" />
                        <DiffButton label="😟 Hard" color="#FFD9D9" />
                    </View>
                </View>

                {/* ===== Word Card ===== */}
                <View style={styles.wordCard}>
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600",
                        }}
                        style={styles.wordImage}
                    />

                    <Text style={styles.wordTitle}>Apple</Text>

                    <View style={styles.pronounceRow}>
                        <Text style={styles.pronounceText}>/ˈæpl/</Text>
                        <TouchableOpacity style={styles.voiceBtn}>
                            <Icon name="volume-up" size={20} color="#6C4AB6" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.definitionBox}>
                        <Text style={styles.badge}>n. 名词</Text>
                        <Text style={styles.definition}>苹果；苹果树</Text>
                    </View>

                    {/* Example */}
                    <View style={styles.exampleBox}>
                        <Text style={styles.exampleTitle}>💬 Example</Text>

                        <View style={styles.exampleCard}>
                            <Text>
                                I eat an <Text style={{ fontWeight: "bold" }}>apple</Text> every day.
                            </Text>
                            <Text style={styles.exampleCN}>我每天吃一个苹果。</Text>
                        </View>
                    </View>
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

                    <Text style={styles.tipText}>
                        💡 Writing short notes helps reinforce memory!
                    </Text>
                </View>

                {/* ===== Image Selection Question ===== */}
                <Text style={styles.selectionPrompt}>
                    ✔ Select the image that matches "Apple"
                </Text>

                <View style={styles.optionsGrid}>
                    <ImageOption
                        label="Banana"
                        img="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200"
                        selected={selectedOption === "A"}
                        onPress={() => setSelectedOption("A")}
                    />

                    <ImageOption
                        label="Orange"
                        img="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=200"
                        selected={selectedOption === "B"}
                        onPress={() => setSelectedOption("B")}
                    />

                    <ImageOption
                        label="Apple ✓"
                        img="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200"
                        selected={selectedOption === "C"}
                        onPress={() => setSelectedOption("C")}
                    />

                    <ImageOption
                        label="Grapes"
                        img="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200"
                        selected={selectedOption === "D"}
                        onPress={() => setSelectedOption("D")}
                    />
                </View>

                {/* ===== Confidence Slider ===== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>😊 Confidence Level</Text>

                    <View style={styles.center}>
                        <Text style={styles.confidenceBadge}>
                            {confidenceLabel[confidence]}
                        </Text>
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
                    <ActionBtn bg="#F3EFFF" icon="flag" color="#6C4AB6" />
                    <ActionBtn bg="#E8F4FF" icon="bookmark" color="#6C4AB6" />
                    <ActionBtn bg="#6C4AB6" icon="arrow-forward" color="#fff" />
                </View>

                {/* Skip */}
                <TouchableOpacity style={styles.skipBtn}>
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

const DiffButton = ({ label, color }) => (
    <View style={[styles.diffButton, { backgroundColor: color }]}>
        <Text style={styles.diffText}>{label}</Text>
    </View>
);

const ImageOption = ({ img, label, onPress, selected }) => (
    <TouchableOpacity
        style={[styles.optionCard, selected && styles.optionSelected]}
        onPress={onPress}
    >
        <Image source={{ uri: img }} style={styles.optionImage} />
        <Text style={styles.optionLabel}>{label}</Text>
    </TouchableOpacity>
);

const ActionBtn = ({ bg, icon, color }) => (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: bg }]}>
        <Icon name={icon} size={26} color={color} />
    </TouchableOpacity>
);

/* ================= Styles (Unified Purple Theme) ================= */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },

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

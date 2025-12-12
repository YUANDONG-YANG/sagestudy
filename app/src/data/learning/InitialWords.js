/**
 * Initial vocabulary data
 */
export const INITIAL_WORDS = [
    {
        word: "Apple",
        translation: "苹果",
        pronunciation: "/ˈæpl/",
        definition: "苹果；苹果树",
        example: "I eat an apple every day.",
        exampleTranslation: "我每天吃一个苹果。",
        imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600",
        difficulty: "easy",
    },
    {
        word: "Book",
        translation: "书",
        pronunciation: "/bʊk/",
        definition: "书；书本",
        example: "I love reading books.",
        exampleTranslation: "我喜欢读书。",
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
        difficulty: "easy",
    },
    {
        word: "Computer",
        translation: "电脑",
        pronunciation: "/kəmˈpjuːtər/",
        definition: "计算机；电脑",
        example: "I use my computer every day.",
        exampleTranslation: "我每天都用电脑。",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
        difficulty: "medium",
    },
    {
        word: "Education",
        translation: "教育",
        pronunciation: "/ˌedʒuˈkeɪʃn/",
        definition: "教育；培养",
        example: "Education is important for everyone.",
        exampleTranslation: "教育对每个人都很重要。",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
        difficulty: "medium",
    },
    {
        word: "Photosynthesis",
        translation: "光合作用",
        pronunciation: "/ˌfəʊtəʊˈsɪnθəsɪs/",
        definition: "光合作用",
        example: "Plants use photosynthesis to make food.",
        exampleTranslation: "植物利用光合作用制造食物。",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
        difficulty: "hard",
    },
    {
        word: "Ecosystem",
        translation: "生态系统",
        pronunciation: "/ˈiːkəʊsɪstəm/",
        definition: "生态系统",
        example: "The forest is a complex ecosystem.",
        exampleTranslation: "森林是一个复杂的生态系统。",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
        difficulty: "hard",
    },
    {
        word: "Molecule",
        translation: "分子",
        pronunciation: "/ˈmɒlɪkjuːl/",
        definition: "分子",
        example: "Water is made of molecules.",
        exampleTranslation: "水是由分子组成的。",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600",
        difficulty: "hard",
    },
    {
        word: "Beautiful",
        translation: "美丽的",
        pronunciation: "/ˈbjuːtɪfl/",
        definition: "美丽的；漂亮的",
        example: "She is a beautiful person.",
        exampleTranslation: "她是个美丽的人。",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
        difficulty: "medium",
    },
    {
        word: "Happy",
        translation: "快乐的",
        pronunciation: "/ˈhæpi/",
        definition: "快乐的；幸福的",
        example: "I feel happy today.",
        exampleTranslation: "我今天感到很快乐。",
        imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600",
        difficulty: "easy",
    },
    {
        word: "Challenge",
        translation: "挑战",
        pronunciation: "/ˈtʃælɪndʒ/",
        definition: "挑战；考验",
        example: "This is a great challenge for me.",
        exampleTranslation: "这对我来说是一个巨大的挑战。",
        imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600",
        difficulty: "medium",
    },
];

/**
 * 初始化词汇数据（仅在第一次使用时）
 * @returns {Promise<void>}
 */
export async function initializeWords() {
    try {
        const VocabularyStorage = (await import("./VocabularyStorage")).default;
        const words = await VocabularyStorage.getAllWords();
        
        if (words.length === 0) {
            // First time use, add initial vocabulary
            for (const wordData of INITIAL_WORDS) {
                try {
                    await VocabularyStorage.addWord(wordData);
                } catch (error) {
                    if (__DEV__) {
                        console.error(`Error adding initial word ${wordData.word}:`, error);
                    }
                    // Continue adding other words without interrupting the whole process
                }
            }
        }
    } catch (error) {
        if (__DEV__) {
            console.error("Error initializing words:", error);
        }
        // Don't throw error, allow app to continue running
    }
}


import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

const STORAGE_KEY = "VOCABULARY_DATA";
const STUDY_STATS_KEY = "STUDY_STATS";

/**
 * 词汇数据存储服务
 */
class VocabularyStorage {
    /**
     * 获取所有词汇
     * @returns {Promise<Array>}
     */
    async getAllWords() {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            return json ? JSON.parse(json) : [];
        } catch (error) {
            if (__DEV__) {
                console.error("Error getting words:", error);
            }
            return [];
        }
    }

    /**
     * 根据ID获取词汇
     * @param {string} wordId - 词汇ID
     * @returns {Promise<object|null>}
     */
    async getWordById(wordId) {
        try {
            const words = await this.getAllWords();
            return words.find((w) => w.id === wordId) || null;
        } catch (error) {
            if (__DEV__) {
                console.error("Error getting word by id:", error);
            }
            return null;
        }
    }

    /**
     * 添加新词汇
     * @param {object} wordData - 词汇数据
     * @returns {Promise<object>}
     */
    async addWord(wordData) {
        try {
            // 验证必填字段
            if (!wordData || !wordData.word || !wordData.word.trim()) {
                throw new Error("Word is required");
            }
            
            const words = await this.getAllWords();
            const newWord = {
                id: uuid.v4(),
                word: wordData.word.trim(),
                translation: (wordData.translation || "").trim(),
                pronunciation: (wordData.pronunciation || "").trim(),
                definition: (wordData.definition || "").trim(),
                example: (wordData.example || "").trim(),
                exampleTranslation: (wordData.exampleTranslation || "").trim(),
                imageUrl: (wordData.imageUrl || "").trim(),
                difficulty: wordData.difficulty || "medium", // easy, medium, hard
                status: "learning", // learning, mastered, review
                confidence: 3, // 1-5
                notes: (wordData.notes || "").trim(),
                createdAt: new Date().toISOString(),
                lastReviewed: null,
                reviewCount: 0,
                masteredAt: null,
            };
            words.push(newWord);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(words));
            return newWord;
        } catch (error) {
            if (__DEV__) {
                console.error("Error adding word:", error);
            }
            throw error;
        }
    }

    /**
     * 更新词汇
     * @param {object} updatedWord - 更新后的词汇数据
     * @returns {Promise<object>}
     */
    async updateWord(updatedWord) {
        try {
            const words = await this.getAllWords();
            const index = words.findIndex((w) => w.id === updatedWord.id);
            if (index === -1) {
                throw new Error("Word not found");
            }
            words[index] = { ...words[index], ...updatedWord };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(words));
            return words[index];
        } catch (error) {
            if (__DEV__) {
                console.error("Error updating word:", error);
            }
            throw error;
        }
    }

    /**
     * 删除词汇
     * @param {string} wordId - 词汇ID
     * @returns {Promise<void>}
     */
    async deleteWord(wordId) {
        try {
            const words = await this.getAllWords();
            const filtered = words.filter((w) => w.id !== wordId);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (error) {
            if (__DEV__) {
                console.error("Error deleting word:", error);
            }
            throw error;
        }
    }

    /**
     * 更新学习进度
     * @param {string} wordId - 词汇ID
     * @param {number} confidence - 信心等级 1-5
     * @param {string} notes - 笔记（可选）
     * @returns {Promise<object>}
     */
    async updateProgress(wordId, confidence, notes = null) {
        try {
            const word = await this.getWordById(wordId);
            if (!word) {
                throw new Error("Word not found");
            }

            const updates = {
                confidence,
                lastReviewed: new Date().toISOString(),
                reviewCount: (word.reviewCount || 0) + 1,
            };

            if (notes !== null) {
                updates.notes = notes;
            }

            // 如果信心等级达到5，标记为已掌握
            if (confidence >= 5) {
                updates.status = "mastered";
                updates.masteredAt = new Date().toISOString();
            } else if (confidence >= 3) {
                updates.status = "learning";
            } else {
                updates.status = "review";
            }

            // 保留原有字段，只更新必要的字段
            return await this.updateWord({ 
                ...word, 
                ...updates,
                // 确保保留原有字段
                difficulty: word.difficulty || "medium",
            });
        } catch (error) {
            if (__DEV__) {
                console.error("Error updating progress:", error);
            }
            throw error;
        }
    }

    /**
     * 搜索词汇
     * @param {string} query - 搜索关键词
     * @returns {Promise<Array>}
     */
    async searchWords(query) {
        try {
            if (!query || !query.trim()) return [];
            
            const words = await this.getAllWords();
            const lowerQuery = query.toLowerCase().trim();
            return words.filter(
                (w) =>
                    (w.word && w.word.toLowerCase().includes(lowerQuery)) ||
                    (w.translation && w.translation.toLowerCase().includes(lowerQuery)) ||
                    (w.definition && w.definition.toLowerCase().includes(lowerQuery))
            );
        } catch (error) {
            if (__DEV__) {
                console.error("Error searching words:", error);
            }
            return [];
        }
    }

    /**
     * 根据状态获取词汇
     * @param {string} status - 状态 (learning, mastered, review)
     * @returns {Promise<Array>}
     */
    async getWordsByStatus(status) {
        try {
            const words = await this.getAllWords();
            return words.filter((w) => w.status === status);
        } catch (error) {
            if (__DEV__) {
                console.error("Error getting words by status:", error);
            }
            return [];
        }
    }

    /**
     * 获取需要复习的词汇
     * @returns {Promise<Array>}
     */
    async getWordsForReview() {
        try {
            const words = await this.getAllWords();
            const now = new Date();
            return words.filter((w) => {
                if (!w) return false;
                if (w.status === "review") return true;
                if (w.status === "learning" && w.lastReviewed) {
                    try {
                        const reviewDate = new Date(w.lastReviewed);
                        if (isNaN(reviewDate.getTime())) return false;
                        const daysSinceReview = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24));
                        return daysSinceReview >= 1; // 至少1天前复习过
                    } catch (error) {
                        return false;
                    }
                }
                return false;
            });
        } catch (error) {
            if (__DEV__) {
                console.error("Error getting words for review:", error);
            }
            return [];
        }
    }

    /**
     * 获取学习统计
     * @returns {Promise<object>}
     */
    async getStudyStats() {
        try {
            const words = await this.getAllWords();
            const stats = {
                totalWords: words.length,
                mastered: words.filter((w) => w.status === "mastered").length,
                learning: words.filter((w) => w.status === "learning").length,
                review: words.filter((w) => w.status === "review").length,
            };
            stats.masteryRate = stats.totalWords > 0 ? Math.round((stats.mastered / stats.totalWords) * 100) : 0;
            return stats;
        } catch (error) {
            if (__DEV__) {
                console.error("Error getting study stats:", error);
            }
            return { totalWords: 0, mastered: 0, learning: 0, review: 0, masteryRate: 0 };
        }
    }

    /**
     * 获取学习记录
     * @returns {Promise<object>}
     */
    async getStudyHistory() {
        try {
            const json = await AsyncStorage.getItem(STUDY_STATS_KEY);
            const history = json ? JSON.parse(json) : {
                totalStudyTime: 0, // 分钟
                streak: 0,
                lastStudyDate: null,
                dailyWordsLearned: {},
            };
            return history;
        } catch (error) {
            if (__DEV__) {
                console.error("Error getting study history:", error);
            }
            return { totalStudyTime: 0, streak: 0, lastStudyDate: null, dailyWordsLearned: {} };
        }
    }

    /**
     * 更新学习记录
     * @param {number} minutesStudied - 学习分钟数
     * @param {number} wordsLearned - 学习的词汇数
     * @returns {Promise<void>}
     */
    async updateStudyHistory(minutesStudied = 0, wordsLearned = 0) {
        try {
            const history = await this.getStudyHistory();
            const today = new Date().toISOString().split("T")[0];
            
            // 确保字段存在并初始化
            history.totalStudyTime = (history.totalStudyTime || 0) + (minutesStudied || 0);
            history.dailyWordsLearned = history.dailyWordsLearned || {};
            history.dailyWordsLearned[today] = (history.dailyWordsLearned[today] || 0) + (wordsLearned || 0);
            
            // 计算连续学习天数
            if (history.lastStudyDate) {
                try {
                    const lastDate = new Date(history.lastStudyDate);
                    const todayDate = new Date(today);
                    
                    if (!isNaN(lastDate.getTime()) && !isNaN(todayDate.getTime())) {
                        const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
                        
                        if (daysDiff === 1) {
                            history.streak = (history.streak || 0) + 1;
                        } else if (daysDiff > 1) {
                            history.streak = 1; // 重新开始
                        }
                        // daysDiff === 0 表示同一天，保持streak不变
                    } else {
                        history.streak = 1;
                    }
                } catch (dateError) {
                    history.streak = 1;
                }
            } else {
                history.streak = 1;
            }
            
            history.lastStudyDate = today;
            await AsyncStorage.setItem(STUDY_STATS_KEY, JSON.stringify(history));
        } catch (error) {
            if (__DEV__) {
                console.error("Error updating study history:", error);
            }
        }
    }

    /**
     * 获取最近学习的词汇
     * @param {number} limit - 数量限制
     * @returns {Promise<Array>}
     */
    async getRecentWords(limit = 10) {
        try {
            const words = await this.getAllWords();
            return words
                .filter((w) => w && w.lastReviewed)
                .sort((a, b) => {
                    try {
                        const dateA = new Date(a.lastReviewed);
                        const dateB = new Date(b.lastReviewed);
                        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                            return 0;
                        }
                        return dateB - dateA;
                    } catch (error) {
                        return 0;
                    }
                })
                .slice(0, limit);
        } catch (error) {
            if (__DEV__) {
                console.error("Error getting recent words:", error);
            }
            return [];
        }
    }
}

export default new VocabularyStorage();


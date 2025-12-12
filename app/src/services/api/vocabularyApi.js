/**
 * 词汇学习相关API
 */
import apiClient from "../apiClient";
import VocabularyStorage from "../../data/learning/VocabularyStorage";

/**
 * 词汇API服务
 */
class VocabularyAPI {
    /**
     * 获取所有词汇
     */
    async getAllWords() {
        const apiResponse = await apiClient.get("/vocabulary");
        
        if (!apiResponse.success) {
            // API失败时使用本地数据
            return await VocabularyStorage.getAllWords();
        }

        // 实际应用中，这里会返回API数据
        // 现在返回本地数据
        return await VocabularyStorage.getAllWords();
    }

    /**
     * 获取单个词汇
     */
    async getWordById(wordId) {
        const apiResponse = await apiClient.get(`/vocabulary/${wordId}`);
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getWordById(wordId);
        }

        return await VocabularyStorage.getWordById(wordId);
    }

    /**
     * 添加词汇
     */
    async addWord(wordData) {
        const apiResponse = await apiClient.post("/vocabulary", wordData);
        
        if (!apiResponse.success) {
            // 即使API失败，也保存到本地
            return await VocabularyStorage.addWord(wordData);
        }

        // 保存到本地存储
        return await VocabularyStorage.addWord(wordData);
    }

    /**
     * 更新词汇
     */
    async updateWord(updatedWord) {
        const apiResponse = await apiClient.put(`/vocabulary/${updatedWord.id}`, updatedWord);
        
        if (!apiResponse.success) {
            return await VocabularyStorage.updateWord(updatedWord);
        }

        return await VocabularyStorage.updateWord(updatedWord);
    }

    /**
     * 删除词汇
     */
    async deleteWord(wordId) {
        const apiResponse = await apiClient.delete(`/vocabulary/${wordId}`);
        
        if (!apiResponse.success) {
            await VocabularyStorage.deleteWord(wordId);
            return { success: false, message: apiResponse.error };
        }

        await VocabularyStorage.deleteWord(wordId);
        return { success: true, message: "Word deleted successfully" };
    }

    /**
     * 更新学习进度
     */
    async updateProgress(wordId, confidence, notes = null) {
        const apiResponse = await apiClient.post(`/vocabulary/${wordId}/progress`, {
            confidence,
            notes,
        });
        
        if (!apiResponse.success) {
            return await VocabularyStorage.updateProgress(wordId, confidence, notes);
        }

        return await VocabularyStorage.updateProgress(wordId, confidence, notes);
    }

    /**
     * 更新单词进度（通用方法，可以更新任意字段）
     */
    async updateWordProgress(wordId, updates) {
        try {
            // 获取当前单词
            const word = await VocabularyStorage.getWordById(wordId);
            if (!word) {
                throw new Error("Word not found");
            }

            // 合并更新
            const updatedWord = { ...word, ...updates };
            
            // 调用API
            const apiResponse = await apiClient.put(`/vocabulary/${wordId}`, updatedWord);
            
            // 无论API成功与否，都更新本地存储
            return await VocabularyStorage.updateWord(updatedWord);
        } catch (error) {
            if (__DEV__) {
                console.error("Update word progress error:", error);
            }
            throw error;
        }
    }

    /**
     * 搜索词汇
     */
    async searchWords(query) {
        const apiResponse = await apiClient.get(`/vocabulary/search?q=${encodeURIComponent(query)}`);
        
        if (!apiResponse.success) {
            return await VocabularyStorage.searchWords(query);
        }

        return await VocabularyStorage.searchWords(query);
    }

    /**
     * 获取学习统计
     */
    async getStudyStats() {
        const apiResponse = await apiClient.get("/vocabulary/stats");
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getStudyStats();
        }

        return await VocabularyStorage.getStudyStats();
    }

    /**
     * 获取学习历史
     */
    async getStudyHistory() {
        const apiResponse = await apiClient.get("/vocabulary/history");
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getStudyHistory();
        }

        return await VocabularyStorage.getStudyHistory();
    }

    /**
     * 更新学习历史
     */
    async updateStudyHistory(minutesStudied, wordsLearned) {
        const apiResponse = await apiClient.post("/vocabulary/history", {
            minutesStudied,
            wordsLearned,
        });
        
        if (!apiResponse.success) {
            await VocabularyStorage.updateStudyHistory(minutesStudied, wordsLearned);
            return { success: false, message: apiResponse.error };
        }

        await VocabularyStorage.updateStudyHistory(minutesStudied, wordsLearned);
        return { success: true };
    }

    /**
     * 根据状态获取词汇
     */
    async getWordsByStatus(status) {
        const apiResponse = await apiClient.get(`/vocabulary?status=${status}`);
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getWordsByStatus(status);
        }

        return await VocabularyStorage.getWordsByStatus(status);
    }

    /**
     * 获取需要复习的词汇
     */
    async getWordsForReview() {
        const apiResponse = await apiClient.get("/vocabulary/review");
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getWordsForReview();
        }

        return await VocabularyStorage.getWordsForReview();
    }

    /**
     * 获取最近学习的词汇
     */
    async getRecentWords(limit = 10) {
        const apiResponse = await apiClient.get(`/vocabulary/recent?limit=${limit}`);
        
        if (!apiResponse.success) {
            // API失败时使用本地数据
            const words = await VocabularyStorage.getAllWords();
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
        }

        // 返回本地数据（实际应用中返回API数据）
        const words = await VocabularyStorage.getAllWords();
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
    }
}

export default new VocabularyAPI();


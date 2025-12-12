/**
 * Vocabulary learning related API
 */
import apiClient from "../apiClient";
import VocabularyStorage from "../../data/learning/VocabularyStorage";

/**
 * Vocabulary API service
 */
class VocabularyAPI {
    /**
     * Get all vocabulary words
     */
    async getAllWords() {
        const apiResponse = await apiClient.get("/vocabulary");
        
        if (!apiResponse.success) {
            // API失败时使用本地数据
            return await VocabularyStorage.getAllWords();
        }

        // In actual application, this would return API data
        // Currently returning local data
        return await VocabularyStorage.getAllWords();
    }

    /**
     * Get single vocabulary word
     */
    async getWordById(wordId) {
        const apiResponse = await apiClient.get(`/vocabulary/${wordId}`);
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getWordById(wordId);
        }

        return await VocabularyStorage.getWordById(wordId);
    }

    /**
     * Add vocabulary word
     */
    async addWord(wordData) {
        const apiResponse = await apiClient.post("/vocabulary", wordData);
        
        if (!apiResponse.success) {
            // Save to local even if API fails
            return await VocabularyStorage.addWord(wordData);
        }

        // Save to local storage
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
     * Update word progress (generic method, can update any field)
     */
    async updateWordProgress(wordId, updates) {
        try {
            // Get current word
            const word = await VocabularyStorage.getWordById(wordId);
            if (!word) {
                throw new Error("Word not found");
            }

            // Merge updates
            const updatedWord = { ...word, ...updates };
            
            // Call API
            const apiResponse = await apiClient.put(`/vocabulary/${wordId}`, updatedWord);
            
            // Update local storage regardless of API success
            return await VocabularyStorage.updateWord(updatedWord);
        } catch (error) {
            if (__DEV__) {
                console.error("Update word progress error:", error);
            }
            throw error;
        }
    }

    /**
     * Search vocabulary words
     */
    async searchWords(query) {
        const apiResponse = await apiClient.get(`/vocabulary/search?q=${encodeURIComponent(query)}`);
        
        if (!apiResponse.success) {
            return await VocabularyStorage.searchWords(query);
        }

        return await VocabularyStorage.searchWords(query);
    }

    /**
     * Get learning statistics
     */
    async getStudyStats() {
        const apiResponse = await apiClient.get("/vocabulary/stats");
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getStudyStats();
        }

        return await VocabularyStorage.getStudyStats();
    }

    /**
     * Get learning history
     */
    async getStudyHistory() {
        const apiResponse = await apiClient.get("/vocabulary/history");
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getStudyHistory();
        }

        return await VocabularyStorage.getStudyHistory();
    }

    /**
     * Update learning history
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
     * Get words by status
     */
    async getWordsByStatus(status) {
        const apiResponse = await apiClient.get(`/vocabulary?status=${status}`);
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getWordsByStatus(status);
        }

        return await VocabularyStorage.getWordsByStatus(status);
    }

    /**
     * Get words for review
     */
    async getWordsForReview() {
        const apiResponse = await apiClient.get("/vocabulary/review");
        
        if (!apiResponse.success) {
            return await VocabularyStorage.getWordsForReview();
        }

        return await VocabularyStorage.getWordsForReview();
    }

    /**
     * Get recently learned words
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

        // Return local data (would return API data in actual application)
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


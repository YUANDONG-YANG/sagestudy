import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image,
} from 'react-native';

// ✅ 把真正的 API 请求移动到 src/data 目录
import { fetchRandomDogFromAPI } from '../src/data/dogApiService';

const DogAPI = ({ onAddDogTask }) => {
    // State for managing dog data and loading
    const [currentDog, setCurrentDog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dogHistory, setDogHistory] = useState([]);
    const [totalFetched, setTotalFetched] = useState(0);

    // 🐕 调用封装在 src/data 的 API 函数
    const handleFetchRandomDog = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('🐕 Fetching random dog via dogApiService...');
            const dogData = await fetchRandomDogFromAPI(); // 👈 从 service 获取已处理好的 dogData

            setCurrentDog(dogData);
            setTotalFetched(prev => prev + 1);

            // 只保留最近 5 条历史记录
            setDogHistory(prevHistory => [dogData, ...prevHistory.slice(0, 4)]);
        } catch (err) {
            console.error('❌ Error fetching dog:', err);
            const msg = err?.message || 'Unknown error';
            setError(`Failed to fetch dog: ${msg}`);
            Alert.alert('API Error', `Unable to fetch dog from API: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    // 🎯 Add dog as a todo task
    const addDogAsTask = () => {
        if (!currentDog) {
            Alert.alert('No Dog', 'Please fetch a dog first!');
            return;
        }

        const dogTask = {
            id: `dog_${currentDog.id}_${Date.now()}`,
            text: '🐕 Look at this cute dog!',
            description: `Random dog from RandomDog API. ${
                currentDog.isVideo ? 'Video' : 'Image'
            } file: ${currentDog.url}`,
            completed: false,
            source: 'api',
            apiType: 'randomdog',
            dogUrl: currentDog.url,
            isVideo: currentDog.isVideo,
        };

        onAddDogTask(dogTask);

        Alert.alert(
            '🐕 Dog Added!',
            'The dog has been added to your todo list as a task to look at!',
            [{ text: '🎉 Woof!' }]
        );

        // 可选：添加后清空当前狗
        setCurrentDog(null);
    };

    // 🗑️ 删除一条历史记录
    const handleDeleteHistoryDog = dogId => {
        setDogHistory(prevHistory =>
            prevHistory.filter(dog => dog.id !== dogId)
        );
    };

    // 🧹 清空历史记录
    const handleClearHistory = () => {
        if (dogHistory.length === 0) return;

        Alert.alert(
            'Clear Recent Dogs',
            'Are you sure you want to remove all recent dogs?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => setDogHistory([]),
                },
            ]
        );
    };

    // 📱 Load initial dog on component mount
    useEffect(() => {
        handleFetchRandomDog();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 24 }}
        >
            <Text style={styles.title}>🐕 Random Dog API</Text>
            <Text style={styles.subtitle}>Powered by random.dog</Text>

            {/* API Status */}
            <View style={styles.apiStatus}>
                <Text style={styles.apiStatusText}>
                    🌐 API Status: {error ? '❌ Error' : '✅ Connected'}
                </Text>
                <Text style={styles.statsText}>
                    📊 Dogs fetched this session: {totalFetched}
                </Text>
            </View>

            {/* Current Dog Display */}
            <View style={styles.dogContainer}>
                <Text style={styles.dogLabel}>Random Dog:</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>
                            Fetching random dog...
                        </Text>
                    </View>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : currentDog ? (
                    <View style={styles.dogContent}>
                        {currentDog.isVideo ? (
                            <View style={styles.videoPlaceholder}>
                                <Text style={styles.videoText}>
                                    🎬 Video File (
                                    {currentDog.fileExtension.toUpperCase()})
                                </Text>
                                <Text style={styles.videoSubtext}>
                                    Video files can't be displayed in React
                                    Native
                                </Text>
                                <Text
                                    style={styles.videoUrl}
                                    numberOfLines={2}
                                >
                                    {currentDog.url}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: currentDog.url }}
                                    style={styles.dogImage}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        <Text style={styles.dogInfo}>
                            🕒 Fetched: {currentDog.timestamp} | Type:{' '}
                            {currentDog.isVideo ? 'Video' : 'Image'}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.noDogText}>No dog loaded</Text>
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.fetchButton}
                    onPress={handleFetchRandomDog}
                    disabled={loading}
                >
                    <Text style={styles.fetchButtonText}>
                        {loading ? '⏳ Fetching...' : '🐕 Get Random Dog'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.addButton,
                        (!currentDog || loading) && styles.addButtonDisabled,
                    ]}
                    onPress={addDogAsTask}
                    disabled={!currentDog || loading}
                >
                    <Text style={styles.addButtonText}>
                        ➕ Add Dog as Task
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Dog History */}
            {dogHistory.length > 0 && (
                <View style={styles.historyContainer}>
                    <View style={styles.historyHeaderRow}>
                        <Text style={styles.historyTitle}>
                            🐕 Recent Dogs:
                        </Text>

                        <TouchableOpacity
                            style={styles.clearHistoryButton}
                            onPress={handleClearHistory}
                        >
                            <Text style={styles.clearHistoryText}>Clear</Text>
                        </TouchableOpacity>
                    </View>

                    {dogHistory.map((dog, index) => (
                        <View key={dog.id} style={styles.historyItem}>
                            <Text style={styles.historyInfo}>
                                {index + 1}. {dog.timestamp} -{' '}
                                {dog.isVideo ? '🎬 Video' : '🖼️ Image'} (
                                {dog.fileExtension})
                            </Text>

                            {!dog.isVideo && (
                                <Image
                                    source={{ uri: dog.url }}
                                    style={styles.historyImage}
                                    resizeMode="cover"
                                />
                            )}

                            <TouchableOpacity
                                style={styles.historyDeleteButton}
                                onPress={() =>
                                    handleDeleteHistoryDog(dog.id)
                                }
                            >
                                <Text style={styles.historyDeleteText}>
                                    🗑️
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {/* API Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>ℹ️ API Information:</Text>
                <Text style={styles.infoText}>
                    • Endpoint: https://random.dog/woof.json
                </Text>
                <Text style={styles.infoText}>
                    • Authentication: None required
                </Text>
                <Text style={styles.infoText}>
                    • Data: Random dog images/videos
                </Text>
                <Text style={styles.infoText}>
                    • Source: public-apis/public-apis
                </Text>
                <Text style={styles.infoText}>
                    • Rate limit: Reasonable use
                </Text>
                <Text style={styles.infoText}>
                    • Response format: JSON
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        margin: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        paddingTop: 20,
        paddingBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        paddingBottom: 20,
    },
    apiStatus: {
        backgroundColor: '#f0f8ff',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
    },
    apiStatusText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    statsText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 5,
    },
    dogContainer: {
        backgroundColor: '#fff9e6',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FFA500',
        minHeight: 200,
    },
    dogLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
    },
    dogContent: {
        flex: 1,
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 10,
    },
    dogImage: {
        width: '100%',
        height: '100%',
    },
    videoPlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#e8e8e8',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        padding: 15,
    },
    videoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    videoSubtext: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    videoUrl: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
    },
    dogInfo: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
    },
    noDogText: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    fetchButton: {
        backgroundColor: '#FF6B35',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    fetchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    addButton: {
        backgroundColor: '#34C759',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#cccccc',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    historyContainer: {
        margin: 20,
        marginTop: 0,
    },
    historyHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    clearHistoryButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#ffecec',
    },
    clearHistoryText: {
        fontSize: 12,
        color: '#d32f2f',
        fontWeight: '600',
    },
    historyItem: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyInfo: {
        fontSize: 12,
        color: '#555',
        flex: 1,
        marginRight: 10,
    },
    historyImage: {
        width: 40,
        height: 40,
        borderRadius: 4,
    },
    historyDeleteButton: {
        marginLeft: 8,
        padding: 6,
        borderRadius: 999,
        backgroundColor: '#ffecec',
    },
    historyDeleteText: {
        fontSize: 14,
        color: '#d32f2f',
    },
    infoContainer: {
        backgroundColor: '#f5f5f5',
        margin: 20,
        marginTop: 0,
        padding: 15,
        borderRadius: 10,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 3,
    },
});

export default DogAPI;

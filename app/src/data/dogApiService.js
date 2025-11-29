export const fetchRandomDogFromAPI = async () => {
    console.log('🐕 [dogApiService] Calling https://random.dog/woof.json ...');

    const response = await fetch('https://random.dog/woof.json', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'User-Agent':
                'Lab Assignment 4 - React Native Todo App (student@sait.ca)',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [dogApiService] Raw API data:', data);

    const fileUrl = data.url;
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'webm', 'gif'].includes(fileExtension);

    return {
        url: fileUrl,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        isVideo,
        fileExtension,
    };
};

module.exports = {
    dependencies: {
        'react-native-vector-icons': {
            platforms: {
                ios: null, // 禁用iOS自动链接，手动配置
            },
        },
    },
    assets: [
        './src/assets/fonts/',
        './node_modules/react-native-vector-icons/Fonts/', // 添加图标字体
    ],
};

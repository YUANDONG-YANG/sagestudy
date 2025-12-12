# API 集成文档

## 概述

应用已集成模拟 API 服务层，提供真实的交互式响应体验，包括网络延迟、加载状态、错误处理和用户反馈。

## 核心功能

### 1. API 客户端 (`apiClient.js`)
- **网络延迟模拟**: 200-800ms 随机延迟，模拟真实网络环境
- **错误处理**: 5% 的错误率模拟（仅开发模式）
- **重试机制**: 自动重试失败请求（最多3次）
- **响应格式**: 统一的 APIResponse 格式

### 2. Toast 通知系统
- **成功提示**: 绿色背景，带成功图标
- **错误提示**: 红色背景，带错误图标
- **警告提示**: 橙色背景，带警告图标
- **信息提示**: 蓝色背景，带信息图标
- **自动消失**: 3秒后自动隐藏（可自定义）

### 3. 加载状态
- **LoadingOverlay**: 全屏加载遮罩
- **按钮加载状态**: 操作按钮显示加载指示器
- **页面加载状态**: 页面级加载状态管理

## API 服务

### 认证 API (`authApi.js`)
- `register(fullName, email, password)` - 用户注册
- `login(email, password)` - 用户登录
- `logout()` - 用户登出
- `changePassword(email, oldPassword, newPassword)` - 修改密码

### 词汇 API (`vocabularyApi.js`)
- `getAllWords()` - 获取所有词汇
- `getWordById(wordId)` - 获取单个词汇
- `addWord(wordData)` - 添加词汇
- `updateWord(updatedWord)` - 更新词汇
- `deleteWord(wordId)` - 删除词汇
- `updateProgress(wordId, confidence, notes)` - 更新学习进度
- `searchWords(query)` - 搜索词汇
- `getStudyStats()` - 获取学习统计
- `getStudyHistory()` - 获取学习历史
- `updateStudyHistory(minutesStudied, wordsLearned)` - 更新学习历史
- `getRecentWords(limit)` - 获取最近学习的词汇

## 使用示例

### 在组件中使用 Toast

```javascript
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function MyComponent() {
    const { showSuccess, showError, showWarning, showInfo } = useContext(ToastContext);

    const handleAction = async () => {
        try {
            // 执行操作
            showSuccess('操作成功！');
        } catch (error) {
            showError('操作失败，请重试');
        }
    };
}
```

### 在组件中使用加载状态

```javascript
import LoadingOverlay from '../components/LoadingOverlay';

function MyComponent() {
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        setLoading(true);
        try {
            // 执行API调用
            await someAPICall();
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <LoadingOverlay visible={loading} message="正在加载..." />
            {/* 其他内容 */}
        </View>
    );
}
```

### 使用 API 服务

```javascript
import VocabularyAPI from '../services/api/vocabularyApi';

// 获取所有词汇
const words = await VocabularyAPI.getAllWords();

// 更新进度
await VocabularyAPI.updateProgress(wordId, confidence, notes);

// 搜索词汇
const results = await VocabularyAPI.searchWords('apple');
```

## 已更新的页面

1. **LoginScreen** - 使用 Toast 和 LoadingOverlay
2. **RegisterScreen** - 使用 Toast 和 LoadingOverlay
3. **LearnScreen** - 使用 API 和 Toast 反馈
4. **ProgressScreen** - 使用 API 获取数据

## 配置

API 配置在 `apiClient.js` 中：

```javascript
const API_CONFIG = {
    BASE_URL: "https://api.sagestudy.com/v1",
    TIMEOUT: 10000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000,
    MIN_DELAY: 200,
    MAX_DELAY: 800,
};
```

## 未来扩展

当连接到真实后端 API 时，只需：
1. 在 `apiClient.js` 中启用真实的 fetch 调用
2. 更新 `BASE_URL` 为真实 API 地址
3. 处理真实的响应格式

所有现有的 API 服务都会自动适配。



# API Integration Documentation

## Overview

The application has integrated a mock API service layer that provides realistic interactive responses, including network delays, loading states, error handling, and user feedback.

## Core Features

### 1. API Client (`apiClient.js`)
- **Network Delay Simulation**: Random delay of 200-800ms to simulate real network environment
- **Error Handling**: 5% error rate simulation (development mode only)
- **Retry Mechanism**: Automatic retry for failed requests (max 3 times)
- **Response Format**: Unified APIResponse format

### 2. Toast Notification System
- **Success Toast**: Green background with success icon
- **Error Toast**: Red background with error icon
- **Warning Toast**: Orange background with warning icon
- **Info Toast**: Blue background with info icon
- **Auto-dismiss**: Automatically hides after 3 seconds (customizable)

### 3. Loading States
- **LoadingOverlay**: Full-screen loading overlay
- **Button Loading State**: Operation buttons display loading indicator
- **Page Loading State**: Page-level loading state management

## API Services

### Authentication API (`authApi.js`)
- `register(fullName, email, password)` - User registration
- `login(email, password)` - User login
- `logout()` - User logout
- `changePassword(email, oldPassword, newPassword)` - Change password

### Vocabulary API (`vocabularyApi.js`)
- `getAllWords()` - Get all vocabulary words
- `getWordById(wordId)` - Get single vocabulary word
- `addWord(wordData)` - Add vocabulary word
- `updateWord(updatedWord)` - Update vocabulary word
- `deleteWord(wordId)` - Delete vocabulary word
- `updateProgress(wordId, confidence, notes)` - Update learning progress
- `searchWords(query)` - Search vocabulary words
- `getStudyStats()` - Get learning statistics
- `getStudyHistory()` - Get learning history
- `updateStudyHistory(minutesStudied, wordsLearned)` - Update learning history
- `getRecentWords(limit)` - Get recently learned words

## Usage Examples

### Using Toast in Components

```javascript
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function MyComponent() {
    const { showSuccess, showError, showWarning, showInfo } = useContext(ToastContext);

    const handleAction = async () => {
        try {
            // Perform action
            showSuccess('Operation successful!');
        } catch (error) {
            showError('Operation failed, please try again');
        }
    };
}
```

### Using Loading States in Components

```javascript
import LoadingOverlay from '../components/LoadingOverlay';

function MyComponent() {
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        setLoading(true);
        try {
            // Perform API call
            await someAPICall();
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <LoadingOverlay visible={loading} message="Loading..." />
            {/* Other content */}
        </View>
    );
}
```

### Using API Services

```javascript
import VocabularyAPI from '../services/api/vocabularyApi';

// Get all words
const words = await VocabularyAPI.getAllWords();

// Update progress
await VocabularyAPI.updateProgress(wordId, confidence, notes);

// Search words
const results = await VocabularyAPI.searchWords('apple');
```

## Updated Pages

1. **LoginScreen** - Uses Toast and LoadingOverlay
2. **RegisterScreen** - Uses Toast and LoadingOverlay
3. **LearnScreen** - Uses API and Toast feedback
4. **ProgressScreen** - Uses API to fetch data

## Configuration

API configuration in `apiClient.js`:

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

## Future Extensions

When connecting to a real backend API, simply:
1. Enable real fetch calls in `apiClient.js`
2. Update `BASE_URL` to real API address
3. Handle real response formats

All existing API services will automatically adapt.

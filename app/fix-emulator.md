# Fix Emulator Offline Issue

## Quick Solution Steps

### 1. Check Emulator Status
```powershell
adb devices
```

### 2. If it shows offline, try the following methods:

#### Method A: Restart ADB
```powershell
adb kill-server
adb start-server
adb devices
```

#### Method B: Restart Emulator
1. Close current emulator window
2. Restart emulator in Android Studio
3. Wait for emulator to fully start (see lock screen)
4. Check again: `adb devices`

#### Method C: Reconnect
```powershell
adb disconnect emulator-5554
adb reconnect
adb devices
```

### 3. If still unable to connect, clean build:
```powershell
cd android
.\gradlew clean
cd ..
```

### 4. Run the app again:
```powershell
npm run android
```

## Common Causes
- Emulator not fully started
- ADB service exception
- Emulator process stuck
- Firewall or security software blocking

## Preventive Measures
- Ensure emulator is fully started before running commands
- Regularly restart ADB service
- Avoid running multiple ADB instances simultaneously

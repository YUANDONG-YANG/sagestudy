# 修复模拟器离线问题

## 快速解决步骤

### 1. 检查模拟器状态
```powershell
adb devices
```

### 2. 如果显示 offline，尝试以下方法：

#### 方法 A：重启 ADB
```powershell
adb kill-server
adb start-server
adb devices
```

#### 方法 B：重启模拟器
1. 关闭当前模拟器窗口
2. 在 Android Studio 中重新启动模拟器
3. 等待模拟器完全启动（看到锁屏）
4. 再次检查：`adb devices`

#### 方法 C：重新连接
```powershell
adb disconnect emulator-5554
adb reconnect
adb devices
```

### 3. 如果仍无法连接，清理构建：
```powershell
cd android
.\gradlew clean
cd ..
```

### 4. 重新运行应用：
```powershell
npm run android
```

## 常见原因
- 模拟器未完全启动
- ADB 服务异常
- 模拟器进程卡住
- 防火墙或安全软件拦截

## 预防措施
- 确保模拟器完全启动后再运行命令
- 定期重启 ADB 服务
- 避免同时运行多个 ADB 实例



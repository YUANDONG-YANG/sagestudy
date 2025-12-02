import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {launchImageLibrary} from "react-native-image-picker";
import {PermissionsAndroid, Platform} from "react-native";

export default function EditProfileScreen() {
    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState(null);

    // ⭐ 加载现有资料
    useEffect(() => {
        const loadProfile = async () => {
            const saved = await AsyncStorage.getItem("userProfile");
            if (saved) {
                const data = JSON.parse(saved);
                setName(data.name || "");
                setEmail(data.email || "");
                setPhone(data.phone || "");
                setAvatar(data.avatar || null);
            }
        };
        loadProfile();
    }, []);

    const chooseAvatar = async () => {
        // ⭐ 安卓需要申请权限
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Permission Required",
                    message: "This app needs access to your photos to set your avatar.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Permission denied");
                return;
            }
        }

        // ⭐ 打开相册
        launchImageLibrary(
            {
                mediaType: "photo",
                quality: 0.8,
                selectionLimit: 1,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                    return;
                }
                if (response.errorCode) {
                    console.log("ImagePicker Error: ", response.errorMessage);
                    return;
                }
                const uri = response.assets?.[0]?.uri;
                if (uri) setAvatar(uri);
            }
        );
    };

    // ⭐ 保存资料
    const onSave = async () => {
        const profileData = {name, email, phone, avatar};

        await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));

        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            {/* ---- 头像上传 ---- */}
            <TouchableOpacity onPress={chooseAvatar} style={styles.avatarBox}>
                <Image
                    source={
                        avatar
                            ? {uri: avatar}
                            : {uri: "https://i.pravatar.cc/150?img=3"}
                    }
                    style={styles.avatar}
                />
                <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            {/* ---- 输入框 ---- */}
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {padding: 20},
    title: {fontSize: 26, fontWeight: "bold", marginBottom: 30},

    avatarBox: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: "#6A4BBC",
    },
    changePhotoText: {
        marginTop: 10,
        color: "#6A4BBC",
        fontWeight: "600",
    },

    label: {fontSize: 16, marginBottom: 6, color: "#555"},
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    saveBtn: {
        backgroundColor: "#6A4BBC",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 20,
    },
    saveText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
});

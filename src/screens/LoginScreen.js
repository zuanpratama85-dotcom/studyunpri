import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import COLORS from '../constants/colors';
import { saveUser } from '../services/storage';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!nama.trim()) {
      newErrors.nama = 'Nama tidak boleh kosong';
    } else if (nama.trim().length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter';
    }

    if (!isLogin && !nim.trim()) {
      newErrors.nim = 'NIM tidak boleh kosong';
    } else if (!isLogin && nim.trim().length < 6) {
      newErrors.nim = 'NIM minimal 6 karakter';
    }

    if (!password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const userData = {
        nama: nama.trim(),
        nim: isLogin ? '243303621805' : nim.trim(),
        password: password,
        createdAt: new Date().toISOString(),
      };

      await saveUser(userData);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>StudyUnpri</Text>
          <Text style={styles.tagline}>Platform Belajar Mahasiswa UNPRI</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>{isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru'}</Text>
          <Text style={styles.formSubtitle}>
            {isLogin ? 'Masukkan data untuk melanjutkan' : 'Lengkapi data untuk mendaftar'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={[styles.input, errors.nama && styles.inputError]}
              placeholder="Contoh: Zuan Pratama"
              placeholderTextColor={COLORS.textMuted}
              value={nama}
              onChangeText={(text) => {
                setNama(text);
                if (errors.nama) setErrors({ ...errors, nama: null });
              }}
            />
            {errors.nama ? <Text style={styles.errorText}>{errors.nama}</Text> : null}
          </View>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NIM</Text>
              <TextInput
                style={[styles.input, errors.nim && styles.inputError]}
                placeholder="Contoh: 243303621805"
                placeholderTextColor={COLORS.textMuted}
                value={nim}
                onChangeText={(text) => {
                  setNim(text);
                  if (errors.nim) setErrors({ ...errors, nim: null });
                }}
                keyboardType="numeric"
              />
              {errors.nim ? <Text style={styles.errorText}>{errors.nim}</Text> : null}
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Minimal 6 karakter"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{isLogin ? 'Masuk' : 'Daftar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <Text style={styles.switchTextBold}>{isLogin ? 'Daftar' : 'Masuk'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  button: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  switchBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  switchTextBold: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
});

export default LoginScreen;

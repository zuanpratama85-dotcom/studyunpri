import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../constants/colors';
import MATKUL_DATA from '../constants/data';
import { getUser, getProgress, getTugas, saveTugas, clearAll } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [tugasPhotos, setTugasPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const userData = await getUser();
      const progressData = await getProgress();
      const tugasData = await getTugas();
      setUser(userData);
      setProgress(progressData);
      setTugasPhotos(tugasData);
    } catch (error) {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalProgress = () => {
    let totalMateri = 0;
    let completedMateri = 0;
    MATKUL_DATA.forEach((matkul) => {
      totalMateri += matkul.materi.length;
      const matkulProgress = progress[matkul.id] || {};
      completedMateri += matkul.materi.filter((m) => matkulProgress[m.id]).length;
    });
    return totalMateri > 0 ? Math.round((completedMateri / totalMateri) * 100) : 0;
  };

  const handleUploadTugas = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi membutuhkan akses ke galeri untuk upload foto tugas. Silakan aktifkan di pengaturan.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        date: new Date().toLocaleDateString('id-ID'),
        label: `Tugas ${tugasPhotos.length + 1}`,
      };
      const updated = [...tugasPhotos, newPhoto];
      setTugasPhotos(updated);
      await saveTugas(updated);
      Alert.alert('Berhasil', 'Foto tugas berhasil diupload!');
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi membutuhkan akses kamera untuk foto tugas. Silakan aktifkan di pengaturan.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        date: new Date().toLocaleDateString('id-ID'),
        label: `Tugas ${tugasPhotos.length + 1}`,
      };
      const updated = [...tugasPhotos, newPhoto];
      setTugasPhotos(updated);
      await saveTugas(updated);
      Alert.alert('Berhasil', 'Foto tugas berhasil diambil!');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nama ? user.nama.charAt(0).toUpperCase() : 'M'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.nama || 'Mahasiswa'}</Text>
        <Text style={styles.nim}>{user?.nim || '-'}</Text>
        <Text style={styles.info}>Sistem Informasi - Universitas Prima Indonesia</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Mata Kuliah</Text>
          <Text style={styles.statValue}>{MATKUL_DATA.length} matkul</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Progress Belajar</Text>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{getTotalProgress()}%</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tugas Diupload</Text>
          <Text style={styles.statValue}>{tugasPhotos.length} foto</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Foto Tugas</Text>
        <Text style={styles.sectionSub}>Ambil dari galeri atau kamera</Text>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadTugas} activeOpacity={0.8}>
            <Text style={styles.uploadIcon}>[ G ]</Text>
            <Text style={styles.uploadBtnText}>Galeri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtnAlt} onPress={handleTakePhoto} activeOpacity={0.8}>
            <Text style={styles.uploadIcon}>[ K ]</Text>
            <Text style={styles.uploadBtnTextAlt}>Kamera</Text>
          </TouchableOpacity>
        </View>

        {tugasPhotos.length > 0 && (
          <View style={styles.photoGrid}>
            {tugasPhotos.map((photo) => (
              <View key={photo.id} style={styles.photoItem}>
                <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                <View style={styles.photoInfo}>
                  <Text style={styles.photoLabel}>{photo.label}</Text>
                  <Text style={styles.photoDate}>{photo.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Keluar dari Akun</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nim: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  info: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
    marginBottom: 14,
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  uploadBtnAlt: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
  uploadIcon: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadBtnTextAlt: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 10,
  },
  photoItem: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  photoImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  photoInfo: {
    padding: 10,
  },
  photoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  photoDate: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProfileScreen;

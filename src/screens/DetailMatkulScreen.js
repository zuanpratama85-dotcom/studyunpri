import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import COLORS from '../constants/colors';
import { getProgress, saveProgress } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';

const DetailMatkulScreen = ({ route }) => {
  const { matkul } = route.params;
  const [materiProgress, setMateriProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const allProgress = await getProgress();
      const current = allProgress[matkul.id] || {};
      setMateriProgress(current);
    } catch (error) {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMateri = async (materiId) => {
    try {
      const updated = { ...materiProgress, [materiId]: !materiProgress[materiId] };
      setMateriProgress(updated);

      const allProgress = await getProgress();
      allProgress[matkul.id] = updated;
      await saveProgress(allProgress);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan progress');
    }
  };

  const getCompletedCount = () => {
    return matkul.materi.filter((m) => materiProgress[m.id]).length;
  };

  const getProgressPercent = () => {
    return Math.round((getCompletedCount() / matkul.materi.length) * 100);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.kodeBadge}>
            <Text style={styles.kodeText}>{matkul.kode}</Text>
          </View>
          <View style={styles.sksBadge}>
            <Text style={styles.sksText}>{matkul.sks} SKS</Text>
          </View>
        </View>
        <Text style={styles.nama}>{matkul.nama}</Text>
        <Text style={styles.dosen}>{matkul.dosen}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.deskripsi}>{matkul.deskripsi}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jadwal Kuliah</Text>
        <View style={styles.jadwalCard}>
          <View style={styles.jadwalDot} />
          <View>
            <Text style={styles.jadwalText}>{matkul.jadwal}</Text>
            <Text style={styles.ruangText}>{matkul.ruang}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.materiHeader}>
          <Text style={styles.sectionTitle}>Materi Pembelajaran</Text>
          <Text style={styles.progressText}>
            {getCompletedCount()}/{matkul.materi.length}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgressPercent()}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{getProgressPercent()}%</Text>
        </View>

        {matkul.materi.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.materiItem, materiProgress[item.id] && styles.materiItemDone]}
            onPress={() => toggleMateri(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, materiProgress[item.id] && styles.checkboxChecked]}>
              {materiProgress[item.id] && <Text style={styles.checkmark}>v</Text>}
            </View>
            <View style={styles.materiContent}>
              <Text style={styles.materiNumber}>Pertemuan {index + 1}</Text>
              <Text style={[styles.materiText, materiProgress[item.id] && styles.materiCompleted]}>
                {item.judul}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    backgroundColor: COLORS.primary,
    padding: 24,
    margin: 16,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  kodeBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  kodeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sksBadge: {
    backgroundColor: COLORS.accent + '30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sksText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  nama: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dosen: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  deskripsi: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  jadwalCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  jadwalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
    marginRight: 14,
  },
  jadwalText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  ruangText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 3,
  },
  materiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
    width: 35,
  },
  materiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  materiItemDone: {
    backgroundColor: COLORS.success + '08',
    borderWidth: 1,
    borderColor: COLORS.success + '20',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  materiContent: {
    flex: 1,
  },
  materiNumber: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  materiText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  materiCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
});

export default DetailMatkulScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';
import MATKUL_DATA from '../constants/data';
import { getUser, getProgress } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProgress();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const userData = await getUser();
      const progressData = await getProgress();
      setUser(userData);
      setProgress(progressData);
    } catch (error) {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const progressData = await getProgress();
      setProgress(progressData);
    } catch (error) {
      // silent
    }
  };

  const getMatkulProgress = (matkulId) => {
    const matkulProgress = progress[matkulId];
    if (!matkulProgress) return 0;
    const matkul = MATKUL_DATA.find((m) => m.id === matkulId);
    if (!matkul) return 0;
    const completed = matkul.materi.filter((m) => matkulProgress[m.id]).length;
    return Math.round((completed / matkul.materi.length) * 100);
  };

  const getTotalProgress = () => {
    let totalMateri = 0;
    let completedMateri = 0;
    MATKUL_DATA.forEach((matkul) => {
      totalMateri += matkul.materi.length;
      const matkulProgress = progress[matkul.id];
      if (matkulProgress) {
        completedMateri += matkul.materi.filter((m) => matkulProgress[m.id]).length;
      }
    });
    return totalMateri > 0 ? Math.round((completedMateri / totalMateri) * 100) : 0;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderMatkulItem = ({ item }) => {
    const prog = getMatkulProgress(item.id);
    return (
      <TouchableOpacity
        style={styles.matkulCard}
        onPress={() => navigation.navigate('DetailMatkul', { matkul: item })}
        activeOpacity={0.7}
      >
        <View style={styles.matkulLeft}>
          <View style={[styles.matkulIcon, { backgroundColor: prog > 0 ? COLORS.success + '20' : COLORS.secondary + '15' }]}>
            <Text style={[styles.matkulIconText, { color: prog > 0 ? COLORS.success : COLORS.secondary }]}>
              {item.kode.slice(0, 2)}
            </Text>
          </View>
          <View style={styles.matkulInfo}>
            <Text style={styles.matkulName} numberOfLines={1}>{item.nama}</Text>
            <Text style={styles.matkulMeta}>{item.dosen} | {item.sks} SKS</Text>
          </View>
        </View>
        <View style={styles.matkulRight}>
          <Text style={[styles.matkulPercent, prog > 0 && styles.matkulPercentActive]}>
            {prog}%
          </Text>
          <View style={styles.miniBar}>
            <View style={[styles.miniFill, { width: `${prog}%` }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MATKUL_DATA}
        renderItem={renderMatkulItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.welcomeCard}>
              <Text style={styles.greeting}>Halo,</Text>
              <Text style={styles.userName}>{user?.nama || 'Mahasiswa'}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{MATKUL_DATA.length}</Text>
                  <Text style={styles.statLabel}>Mata Kuliah</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{getTotalProgress()}%</Text>
                  <Text style={styles.statLabel}>Progress</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {MATKUL_DATA.reduce((sum, m) => sum + m.sks, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total SKS</Text>
                </View>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Mata Kuliah Aktif</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  welcomeCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  matkulCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  matkulLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  matkulIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matkulIconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  matkulInfo: {
    flex: 1,
  },
  matkulName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  matkulMeta: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 3,
  },
  matkulRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  matkulPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  matkulPercentActive: {
    color: COLORS.success,
  },
  miniBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
});

export default HomeScreen;

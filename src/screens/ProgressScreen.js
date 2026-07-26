import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import COLORS from '../constants/colors';
import MATKUL_DATA from '../constants/data';
import { getProgress } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProgressScreen = ({ navigation }) => {
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProgress();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProgress = async () => {
    try {
      const data = await getProgress();
      setProgress(data);
    } catch (error) {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const getMatkulStats = (matkul) => {
    const matkulProgress = progress[matkul.id] || {};
    const total = matkul.materi.length;
    const completed = matkul.materi.filter((m) => matkulProgress[m.id]).length;
    const percent = Math.round((completed / total) * 100);
    return { total, completed, percent };
  };

  const getTotalStats = () => {
    let totalMateri = 0;
    let completedMateri = 0;
    MATKUL_DATA.forEach((matkul) => {
      totalMateri += matkul.materi.length;
      const matkulProgress = progress[matkul.id] || {};
      completedMateri += matkul.materi.filter((m) => matkulProgress[m.id]).length;
    });
    const percent = totalMateri > 0 ? Math.round((completedMateri / totalMateri) * 100) : 0;
    return { totalMateri, completedMateri, percent };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalStats = getTotalStats();

  const renderProgressItem = ({ item }) => {
    const stats = getMatkulStats(item);
    return (
      <View style={styles.progressCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <Text style={styles.matkulName} numberOfLines={1}>{item.nama}</Text>
            <Text style={styles.statsText}>
              {stats.completed}/{stats.total} materi selesai
            </Text>
          </View>
          <View style={[styles.percentBadge, stats.percent === 100 && styles.percentBadgeComplete]}>
            <Text style={[styles.percentText, stats.percent === 100 && styles.percentTextComplete]}>
              {stats.percent}%
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${stats.percent}%` },
              stats.percent === 100 && styles.progressComplete,
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MATKUL_DATA}
        renderItem={renderProgressItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Progress Keseluruhan</Text>
            <Text style={styles.summaryPercent}>{totalStats.percent}%</Text>
            <View style={styles.summaryBar}>
              <View style={[styles.summaryFill, { width: `${totalStats.percent}%` }]} />
            </View>
            <Text style={styles.summaryDetail}>
              {totalStats.completedMateri} dari {totalStats.totalMateri} materi selesai
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState message="Belum ada progress" />}
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
  summaryCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  summaryPercent: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  summaryBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  summaryFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 5,
  },
  summaryDetail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 12,
  },
  progressCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  matkulName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 3,
  },
  percentBadge: {
    backgroundColor: COLORS.secondary + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  percentBadgeComplete: {
    backgroundColor: COLORS.success + '15',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  percentTextComplete: {
    color: COLORS.success,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  progressComplete: {
    backgroundColor: COLORS.success,
  },
});

export default ProgressScreen;

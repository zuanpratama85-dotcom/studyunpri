import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import COLORS from '../constants/colors';
import MATKUL_DATA from '../constants/data';
import { getProgress } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';

const MatkulScreen = ({ navigation }) => {
  const [matkulList, setMatkulList] = useState([]);
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
      const progressData = await getProgress();
      setProgress(progressData);
      setMatkulList(MATKUL_DATA);
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderItem = ({ item }) => {
    const prog = getMatkulProgress(item.id);
    return (
      <ItemCard
        title={item.nama}
        subtitle={`${item.kode} | ${item.sks} SKS | Semester ${item.semester}`}
        rightText={prog > 0 ? `${prog}%` : 'Mulai'}
        onPress={() => navigation.navigate('DetailMatkul', { matkul: item })}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Daftar Mata Kuliah</Text>
        <Text style={styles.subheader}>{matkulList.length} mata kuliah tersedia</Text>
      </View>

      <FlatList
        data={matkulList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState message="Belum ada mata kuliah tersedia" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  subheader: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default MatkulScreen;

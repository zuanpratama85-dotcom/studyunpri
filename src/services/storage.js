import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@studyunpri_user',
  PROGRESS: '@studyunpri_progress',
  TUGAS: '@studyunpri_tugas',
};

export const saveUser = async (userData) => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(userData));
};

export const getUser = async () => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const removeUser = async () => {
  await AsyncStorage.removeItem(KEYS.USER);
};

export const saveProgress = async (progressData) => {
  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progressData));
};

export const getProgress = async () => {
  const data = await AsyncStorage.getItem(KEYS.PROGRESS);
  return data ? JSON.parse(data) : {};
};

export const saveTugas = async (tugasData) => {
  await AsyncStorage.setItem(KEYS.TUGAS, JSON.stringify(tugasData));
};

export const getTugas = async () => {
  const data = await AsyncStorage.getItem(KEYS.TUGAS);
  return data ? JSON.parse(data) : [];
};

export const clearAll = async () => {
  await AsyncStorage.multiRemove([KEYS.USER, KEYS.PROGRESS, KEYS.TUGAS]);
};

export default { saveUser, getUser, removeUser, saveProgress, getProgress, saveTugas, getTugas, clearAll };

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const EmptyState = ({ message = 'Tidak ada data', icon = '[ ]' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
    color: COLORS.textLight,
  },
  text: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default EmptyState;

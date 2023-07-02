import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Info = () => {
  const imageInfo = [
    {
      name: 'BmwWelt',
      info: 'Information about BmwWelt...',
    },
    {
      name: 'EnglischerGarten',
      info: 'Information about EnglischerGarten...',
    },
    {
      name: 'Frauenkirche',
      info: 'Information about Frauenkirche...',
    },
    {
      name: 'Marienplatz',
      info: 'Information about Marienplatz...',
    },
    {
      name: 'Nymphenburg',
      info: 'Information about Nymphenburg...',
    },
    {
      name: 'Residenz',
      info: 'Information about Residenz...',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Information</Text>
      {imageInfo.map((info, index) => (
        <View key={index} style={styles.infoContainer}>
          <Text style={styles.infoName}>{info.name}</Text>
          <Text style={styles.infoText}>{info.info}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
  },
});

export default Info;

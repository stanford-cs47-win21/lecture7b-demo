import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { material } from 'react-native-typography';
import { Metrics, Colors } from '../Themes';
import { Entypo } from '@expo/vector-icons';
import FeedItem from '../Components/FeedItem'

export default function BookmarkViewerScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <ScrollView>
        <FeedItem content={route.params.content} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.snow,
  },
});
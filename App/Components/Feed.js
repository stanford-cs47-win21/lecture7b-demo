import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { getPopularPhotos } from '../API/Unsplash.js';
import { material } from 'react-native-typography';
import { Metrics } from '../Themes';
import FeedItem from '../Components/FeedItem';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment'

export default function Feed({content, onProfileRequested}) {
  const [loading, setLoading] = useState(false)
  const [feedEntries, setFeedEntries] = useState([])

  useEffect(()=> {
    if (content) {
      setFeedEntries(content);
    } else {
      getFeedData();
    }
  }, [content])

  let getFeedData = () => {
    setLoading(true);
    getPopularPhotos(json => { //this code will be fetching images from the Unsplash API
      setFeedEntries(json);
      setLoading(false);
    });
  }

  let onProfilePressed = (username) => {
    onProfileRequested(username)
  }

  let _keyExtractor = (item, index) => item.id;

  let renderItem = ({item}) => {
    return (
      <FeedItem
        content = {item}
        onProfilePressed = {() => onProfilePressed(item.user.username)}
      />
    );
  }

  let getTabContent = (props) => {
    if (loading) {
      return (
        <ActivityIndicator />
      );
    } else {

      return (
        <FlatList
          data = {feedEntries}
          renderItem={renderItem}
          keyExtractor={_keyExtractor}     
        />
      );
    }

  }

  return (
    <View style={styles.container}>
      {getTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  }
});
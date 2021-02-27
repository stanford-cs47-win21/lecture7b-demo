import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { material } from 'react-native-typography';
import { Metrics } from '../Themes';
import styles from './Styles/BookmarkScreen.styles';
import firestore from '../../firebase';
import firebase from 'firebase';

export default function BookmarkScreen({navigation}) {
  const [bookmarks, setBookmarks] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [unsubscribe, setUnsubscribe] = useState(null)

  useEffect(() => {
    const user = firebase.auth().currentUser;
    let bookmarksRef = firestore.collection('users/' + user.uid + '/bookmarks');
    // We want our list of bookmarks to update in realtime (so the user doesn't have to
    // refresh the page to see any changes). This basically waits for a change in the 
    // bookmarks collection and then tells the program to retrieve all of the bookmarks
    // again (it basically calls your code for getBookmarks).
    reloadBookmarks();

    let unsubscribe = bookmarksRef.onSnapshot(() => {
      reloadBookmarks();
    });
    return () => {
      unsubscribe()
    }
  }, [])
  // STEP 4: Read all of the user's bookmarks from the database
  // ---------------------------------------------------------------------------------------
  // Make sure you understand what path you need to pass in to get the correct reference 
  // for your BOOKMARKS COLLECTION.
  //
  // To check if it's working, bookmark a post and check the bookmark tab. That post should be
  // listed in that tab. Un-bookmark that post and check the bookmark tab again. Your list should
  // be updated to reflect this change.
  const getBookmarks = async () => {
    try {
      const user = firebase.auth().currentUser;
      let bookmarks = [];

      // Add your code here

      return (bookmarks ? bookmarks : []);
    } catch (error) {
      console.log(error);
    }
    return ([]);
  }

  const bookmarkPressed = (item) => {
    const { navigate } = navigation;
    navigate('BookmarkViewer', { content: item });
  }

  const reloadBookmarks = async () => {
    setIsRefreshing(true);
    const bookmarks = await getBookmarks();
    setBookmarks(bookmarks);
    setIsRefreshing(false);
  }

  const _keyExtractor = (item, index) => item.id;

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => bookmarkPressed(item)} key={item.id}>
      <View style={styles.bookmarkContainer}>
        <Image style={styles.thumbImage} source={{uri: item.urls.thumb}}/>
        <View style={styles.textContainer}>
          <Text style={material.body1}>{item.description || "No Description"}</Text>
          <Text style={material.caption}>By {item.user.name}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  }

  let emptyList = null;
  if (!bookmarks[0]) {
    emptyList = (<Text style={{marginTop: Metrics.navBarHeight}}>No bookmarks exist yet!</Text>);
  }

  return (
    <View style={styles.container}>

      {emptyList}

      <FlatList
        data={bookmarks}
        keyExtractor={_keyExtractor}
        renderItem={renderItem}
        onRefresh={reloadBookmarks}
        refreshing={isRefreshing}
      />

    </View>
  );
}

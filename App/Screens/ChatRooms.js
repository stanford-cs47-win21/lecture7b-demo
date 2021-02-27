import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, StatusBar } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack'
import { material } from 'react-native-typography';
import { Metrics, Colors } from '../Themes';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';
import firestore from '../../firebase';

export default function ChatRooms({navigation}) {
  const KEYBOARD_VERTICAL_OFFSET = useHeaderHeight() + StatusBar.currentHeight;
  const [text, setText] = useState('')
  const [rooms, setRooms] = useState([])

  useEffect(()=> {
    //Once the component loads, we want to listen to any new rooms
    const collRef = firestore.collection('rooms')
    let unsubscribe = collRef.onSnapshot((docs) => {
      let tempRooms = []
      docs.forEach((doc) => {
        let temp = doc.data()
        temp['key'] = doc.id
        tempRooms.push(temp)
      });
      setRooms(tempRooms)
    });

    return () => {
      //on unmount, unsubscribe
      unsubscribe()
    }
  }, [])

  const add = () => {
    //When a new room is added, we add a doc with the room name to the rooms collection
    const collRef = firestore.collection('rooms')
    collRef.add({
      roomName: text,
      count: 0
    })
    setText('')
  }

  const _renderItem = ({item}) => {
    //Should navigate to the room conversation
    return (
      <TouchableOpacity onPress={() => {navigation.navigate('RoomMessagesScreen', { key: item.key })}}>
        <View style={[styles.addChatContainer,{borderTopWidth: 0, borderBottomWidth: 1}]}>
          <Text style={material.subheading}> {item.roomName} </Text>
          <Text style={material.subheading}> Messages: {item.count} </Text>
        </View>
      </TouchableOpacity>
    )
  }
  
  return (
    <KeyboardAvoidingView
         style={{ flex: 1 }}
         keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
         behavior="padding">
      <FlatList
        data={rooms}
        renderItem={_renderItem}
        style={styles.container}
        keyExtractor={(item, index) => item.key}/>
      <View style={styles.addChatContainer}>
        <TextInput
          style={styles.newRoom}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder="Create a new chat room..."/>
        <Button
          title="Add"
          onPress={add}/>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    borderTopWidth: Metrics.horizontalLineHeight,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical
  },
  newRoom: {
    borderBottomWidth: Metrics.horizontalLineHeight,
    flex: 1,
    borderBottomColor: Colors.border,
    marginRight: Metrics.marginHorizontal
  },
  listItem: {

  }
});

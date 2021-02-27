import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react';
import { Images, Colors, Metrics } from '../Themes'
import { StyleSheet, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import ChatRoomsScreen from '../Screens/ChatRooms';
import RoomMessagesScreen from '../Screens/RoomMessages';

const ChatRoomsStack = createStackNavigator();
function ChatRoomsNav () {
  return (
    <ChatRoomsStack.Navigator headerMode="float">
      <ChatRoomsStack.Screen name = "ChatRoomsScreen" component = {ChatRoomsScreen}/>
      <ChatRoomsStack.Screen name = "RoomMessagesScreen" component = {RoomMessagesScreen}/>
    </ChatRoomsStack.Navigator>
  );
}


const TabNav = createBottomTabNavigator();
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <TabNav.Navigator
        initialRouteName='ChatRooms'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            // You can return any component that you like here!
            return <Entypo name={'home'} size={Metrics.icons.medium} color={color} />;
          },
        })}
        
        tabBarOptions={{
          activeTintColor: Colors.black,
          showLabel: true,
        }}>
        <TabNav.Screen name="ChatRooms" component={ChatRoomsNav} />
      </TabNav.Navigator>
    </NavigationContainer>
  );
}
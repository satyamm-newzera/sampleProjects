import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import DemoScreen from './components/DemoScreen';
import HomeScreen from './components/HomeScreen';
import MainScreen from './components/MainScreen';
import StoryScreen from './components/StoryScreen';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useQuery,
	gql, HttpLink, from
} from "@apollo/client";


const client = new ApolloClient({
	uri: "http://192.168.244.127:4000/",
	cache: new InMemoryCache()
});

export default function App()
{
	clearAll = async () => {
		try {
		  await AsyncStorage.clear()
		  console.log("Cleared async storage");
		} catch(e) {
		  console.log("Error occured while clearing");
		}
	}
	clearAll();

	return (
		<ApolloProvider client={client}>
			<DemoScreen />
		</ApolloProvider>
	);
}

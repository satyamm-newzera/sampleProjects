import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View,Text, TextInput, Button } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewStoryScreen({ navigation }) {

    const [storyUri, setStoryUri] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [storyComment, setStoryComment] = useState('');

    const getData = async() => {
        try {
            const storyUri = await AsyncStorage.getItem('storyUri');
            const storyTitle = await AsyncStorage.getItem('storyTitle');
            const storyComment = await AsyncStorage.getItem('storyComment');
            setStoryUri(storyUri);
            setStoryTitle(storyTitle);
            setStoryComment(storyComment);
        } catch(err) {
            console.log(err);
        }
    }

    const [count, setCount] = useState(0.0);
    
    useEffect(() => {
        const progressBarTimer = setInterval(() => setCount(count => count+0.02), 100)
        const timer = setTimeout(() => navigation.goBack(), 5000);
        return function cleanup() {
            console.log('Unmounted');
            clearInterval(progressBarTimer);
            clearTimeout(timer);
        };
    }, []);

    getData();
    return (
        <View style={styles.storyContainer}>
            {storyUri !== "" && <ProgressBar style = {{marginTop: 40, alignSelf:'center', }} progress={count} color="#f0f2f5" />}
            <View style = {{alignSelf: 'center'}}>
                {storyUri !== "" && <Image resizeMode='cover' source={{uri: storyUri}} style={{ width: 300, height: 200, borderRadius: 10, alignSelf: 'center', marginTop: 60}}/>}
                {storyTitle !== "" && <Text style={{fontSize: 20, marginTop: 10, fontFamily: 'CenturyGothic', color: 'white'}}> {storyTitle} </Text>}
                {storyComment !== "" && <Text style={{fontSize: 40, fontWeight: 'bold', marginTop: 40, fontFamily: 'CenturyGothic', color: 'white'}}> {storyComment} </Text>}
            </View> 
        </View>
    )
}

const styles = StyleSheet.create({

    storyContainer: {
        backgroundColor: '#122d4a',
		flex: 1,
        flexDirection: 'column'
    },
})

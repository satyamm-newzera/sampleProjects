import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View,Text, TextInput, Button } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


function AddStoryScreen({ route, navigation }) {
    
    const { newStoryUri } = route.params;

    // This is to set the input on screen
    const [storyTitleInput, setStoryTitleInput] = useState('');
    const [storyCommentInput, setStoryCommentInput] = useState('');

    const uploadStoryHandler = async(storyUri, storyTitleInput, storyCommentInput) => {
        try {
            await AsyncStorage.multiSet([['storyUri', storyUri], ['isStorySet', JSON.stringify(true)], ['storyTitle', storyTitleInput], ['storyComment', storyCommentInput]])
            .then(() => {
                console.log('Added Story');
                navigation.navigate('ProfileScreen', { hasStory: true });
            })
        } catch (err) {
            console.log('Error occured');
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            <Image resizeMode='cover' source={{ uri: newStoryUri}} style={{ width: 300, height: 200, borderRadius: 10, alignSelf: 'center', marginTop: 60 }} />

            <View style={{ backgroundColor: 'white', width: 300, marginTop: 50, borderRadius: 10, alignSelf: 'center' }}>
                <TextInput
                    style={styles.storyTitleInput}
                    multiline
                    numberOfLines={2}
                    placeholder='Your News Title'
                    placeholderTextColor="black"
                    onChangeText={(storyTitleInput) =>
                        setStoryTitleInput(storyTitleInput)
                    }
                />
            </View>

            <View style={{ backgroundColor: 'white', width: 300, marginTop: 50, borderRadius: 10, alignSelf: 'center' }}>
                <TextInput
                    style={styles.commentInput}
                    multiline
                    numberOfLines={10}
                    placeholder='Any Comments..'
                    placeholderTextColor="black"
                    onChangeText={(storyCommentInput) =>
                        setStoryCommentInput(storyCommentInput)
                    }
                />
            </View>

            <View style={{ marginTop: 40, width: 200, alignSelf: 'center' }}>
                <Button title="Upload Story" onPress={() => uploadStoryHandler(newStoryUri, storyTitleInput, storyCommentInput)} />
            </View>

            <View style={{ marginTop: 40, width: 200, alignSelf: 'center' }}>
                <Button title="Cancel" color="#ab280e" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
}

export default AddStoryScreen;

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#122d4a',
        flex: 1,
        flexDirection: 'column',
    },

    storyTitleInput: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'CenturyGothic',
        height: 65
    },

    commentInput: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'CenturyGothic',
        height: 90,
    },

    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#1450b8',
        alignItems: 'center',
        marginVertical: 7
    },

    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    }
})

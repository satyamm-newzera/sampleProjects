import React, { useRef, useState, useEffect } from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity,} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Svg, {Defs, Image as SvgImage, ClipPath, Polygon, Circle, Path, SvgUri} from 'react-native-svg';
import ActionButton from 'react-native-action-button-warnings-fixed';
import BottomSheet from 'react-native-simple-bottom-sheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery, gql, useMutation } from '@apollo/client';
import AddStoryScreen from './AddStoryScreen';
import ViewStoryScreen from './ViewStoryScreen';


const USER_QUERY = gql`
    query getUserInfo($id: Int) {
        getUserById(id: $id) {
            name 
            designation
            website
            profileUri
        }
    }
`

const USER_MUTATION = gql`
    mutation changeProfile($id: Int, $uri: String) {
        changeProfilePic(id: $id, uri: $uri) {
            name
            designation
            website 
            profileUri
        }
    }
`

function ProfileScreen({navigation, route}) {
    const id = 1;
    const {loading, error, data} = useQuery(
        USER_QUERY, {
            variables: {
                id: id
            }
        }
    )


    const [changePic, {loading: mutation_loading, error: mutation_error,data: mutation_data}] = useMutation(
        USER_MUTATION
    )
    
	const panelRef = useRef(null);
	const [imageUri, setImageUri] = useState(require('../assets/defaultAvatar.png'));
    const [hasProfilePhoto, setHasProfilePhoto] = useState(false);
    const [hasStory, setHasStory] = useState(false);
	const [hasSeenStory, setHasSeenStory] = useState(false);
    
    useEffect(() => {
        if (mutation_data !== undefined) {
            console.log(data);
            
            console.log("Inside useEffect");
            if (mutation_data.changeProfilePic.profileUri !== "") {
                setImageUri(mutation_data.changeProfilePic.profileUri);
                setHasProfilePhoto(true); 
            } else {
                setImageUri(require('../assets/defaultAvatar.png'));
                setHasProfilePhoto(false); 
            }
        }
    }, [mutation_data])

    if (route.params !== undefined && !hasStory) {
        setHasStory(true);
    }

    const takePhotoFromCamera = () => {

		const options = {
			storageOptions: {
				path: 'images',
				mediaType: 'photo'
			},
			includeBase64: true
		};

		launchCamera(options, response => {

			if (response.didCancel) {
				console.log('User cancelled the image picker');
			} 
			else if (response.error) {
				console.log("ImagePicker Error: ", response.error);
			} 
			else {
				const newUri = response.assets[0].uri;
                changePic({variables: {id: id, uri: newUri}});
			}
		});
	}

    const selectPhotoFromGallery = () => {
		const options = {
			storageOptions: {
				path: 'images',
				mediaType: 'photo'
			},
			includeBase64: true
		};

		launchImageLibrary(options, response => {

			if (response.didCancel) {
				console.log('User cancelled the image picker');
			} 
			else if (response.error) {
				console.log("ImagePicker Error: ", response.error);
			} 
			else {
				const newUri = response.assets[0].uri;
                panelRef.current.togglePanel();
                changePic({variables: {id: id, uri: newUri}});
			}
		});
	}

    const removeProfilePhoto = () => {
        changePic({variables: {id: id, uri: ''}});
		console.log("Profile Photo Removed");
	}

    const selectStoryFromGallery = () => {
		const options = {
			storageOptions: {
				path: 'images',
				mediaType: 'photo'
			},
			includeBase64: true
		};

		launchImageLibrary(options, response => {

			if (response.didCancel) {
				console.log('User cancelled the story image picker');
			} 
			else if (response.error) {
				console.log("StoryImagePicker Error: ", response.error);
			} 
			else {
				const newStoryUri = response.assets[0].uri;
                navigation.navigate('AddStoryScreen', { newStoryUri: newStoryUri})
			}
		});
	}

	const pressHandlerForStory = () => {
		if (hasStory) {
			setHasSeenStory(true);
			navigation.navigate('ViewStoryScreen');
		}
	}

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'black'}}> Loading... </Text>
            </View>
        )
    }
    
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'black'}}> Error </Text>
            </View>
        )
    }
    
	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<AntIcon.Button name="left" color="#fdbb21" size={40} backgroundColor="white"/>
				<EntypoIcon.Button name="menu" color="#fdbb21" size={40} backgroundColor="white"/>
			</View>

			<View style={styles.imageContainer}>
				<View style={{position: 'relative'}}>
					<TouchableOpacity  onLongPress={() => panelRef.current.togglePanel()} onPress={() => pressHandlerForStory(navigation)}>
						<Svg height="220" width="220">
							<Defs>
								<ClipPath id = "clip">
									<Path 
										d="M141,15 L79,15 L29,51 L10,110 L29,169 L79,205 L141,205 L191,169 L210,110 L191,51 L141,15"
										fill="none"
										stroke="red"
									/>
								</ClipPath>
							</Defs>

							<View>
                                {hasStory && !hasSeenStory && <Path
                                    d = "M142,10 L78,10 L25,48 L5,110 L25,172 L78,210 L142,210 L195,172 L215,110 L195,48 L142,10"
                                    fill="none"
                                    stroke="#fdbb21"
                                    strokeWidth="4" 
                                />}

								{hasStory && hasSeenStory && <Path
                                    d = "M142,10 L78,10 L25,48 L5,110 L25,172 L78,210 L142,210 L195,172 L215,110 L195,48 L142,10"
                                    fill="none"
                                    stroke="grey"
                                    strokeWidth="4" 
                                />}	

								<SvgImage
									clipPath="url(#clip)"
									preserveAspectRatio="xMidYMid slice"
									height="100%"
									width="100%"
									href={imageUri}
								/>

                                {hasStory && !hasSeenStory && <Circle cx="195" cy="172" r="7" fill="#fdbb21" stroke="white" strokeWidth={3}/>}
                                {hasStory && !hasSeenStory && <Circle cx="170" cy="172" r="7" fill="#fdbb21" stroke="white" strokeWidth={3}/>}
                                {hasStory && !hasSeenStory && <Circle cx="145" cy="172" r="7" fill="#fdbb21" stroke="white" strokeWidth={3}/>}

							</View>
						</Svg>
					</TouchableOpacity>

					{!hasStory && <ActionButton buttonTextStyle={{fontSize: 25, alignSelf: 'center'}} activeOpacity={0.2}
						position="left" offsetX={174} offsetY={150} buttonColor="#fdbb21" size={25}
						onPress={() => {
                            console.log('pressed');
							selectStoryFromGallery(navigation);
						}}
					/>}
				</View>
			</View>

			<View style={styles.introContainer}>
				<Text style={styles.name}> {data ? data.getUserById.name : ''} </Text>
				<Text style={styles.designation}> {data ? data.getUserById.designation : ''} </Text>
				<Text style={styles.designation}> {data ? data.getUserById.website : ''}  </Text>
			</View>

			<View style={styles.footerContainer}>
				<View style={styles.leftFooterLine} />
				<View>
					<Svg height="50" width="50">
						<Polygon
							points="33,1 17,1 5,10 0,25 5,40 17,49 33,49 45,40 50,25 45,10"
							stroke="#fdbb21"
							strokeWidth="2"
						/>
					</Svg>
				</View>
				<View style={styles.rightFooterLine} />
			</View>

			<View style = {styles.shapeContainer}>
				<View style = {styles.square} />
				<View style = {styles.triangle} />
			</View>

			<BottomSheet isOpen={false} sliderMinHeight={0}  ref= {ref => panelRef.current = ref}>
				<View>
					<View style={{alignItems: 'center'}}>
						<Text style = {{ fontSize: 27, height: 35}}> Upload Photo </Text>
						<Text style = {{ fontSize: 14, height: 30, color: 'gray'}}> Choose Your Profile Picture </Text> 
					</View>
					
					<TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
						<Text style = {styles.panelButtonTitle}> Take Photo </Text>
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.panelButton} onPress={selectPhotoFromGallery}>
						<Text style = {styles.panelButtonTitle}> Choose from Gallery </Text> 
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.panelButton} onPress={removeProfilePhoto}>
						<Text style = {styles.panelButtonTitle}> Remove Profile Photo </Text> 
					</TouchableOpacity>

					<TouchableOpacity style={styles.panelButton} onPress={() => panelRef.current.togglePanel()}>
						<Text style = {styles.panelButtonTitle}> Cancel </Text>
					</TouchableOpacity>
					
				</View>
			</BottomSheet>
		</View> 
	);
}

const Stack = createNativeStackNavigator();

export default function MainScreen() {

	return (
		<NavigationContainer>
            <Stack.Navigator initialRouteName="ProfileScreen">
                <Stack.Screen options={{headerShown: false}} name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen options={{headerShown: false}} name="AddStoryScreen" component={AddStoryScreen} />
				<Stack.Screen options={{headerShown: false}} name="ViewStoryScreen" component={ViewStoryScreen} />
            </Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},

	headerContainer: {
		marginTop: '5%',
		height: '10%',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	imageContainer: {
		height: '40%',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},
	introContainer: {
		height: '30%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},

	name: {
		color: '#898989',
		fontSize: 30,
		fontFamily: 'CenturyGothic',
		marginBottom: 8,
	},

	designation: {
		color: '#898989', 
		fontSize: 20, 
		fontFamily: 'CenturyGothic',
	},

	footerContainer: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center'
	},

	leftFooterLine: {
		flex:1, 
		height: 1, 
		marginLeft: "10%", 
		backgroundColor: "#fdbb21"
	},

	rightFooterLine: {
		flex:1, 
		height: 1, 
		marginRight: "10%", 
		backgroundColor: "#fdbb21"
	},

	shapeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},

	square: {
		width: 40,
		height: 40,
		backgroundColor: '#fdbb21',
	},

	triangle : {
		width: 0,
		height: 0,
		backgroundColor: "transparent",
		borderStyle: "solid",
		borderLeftWidth: 20,
		borderRightWidth: 20,
		borderBottomWidth: 40,
		borderLeftColor: "transparent",
		borderRightColor: "transparent",
		borderBottomColor: "#fdbb21",
	},

	panelButton : {
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
});

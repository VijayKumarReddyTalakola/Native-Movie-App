import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MovieList from '../components/MovieList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cast from '../components/Cast';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { ChevronLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';

const ios = Platform.OS == "ios";
const verticalMargin = ios ? "" : "my-4";

export default function FavouritesScreen() {
    const navigation = useNavigation();
    const [favouriteCast,setFavouriteCast] = useState([])
    const [favouriteMovies,setFavouriteMovies] = useState([])

    useEffect(() => {
        checkFavourites()
    }, [])
    
    const checkFavourites = async () => {
      const favouriteMovies = await AsyncStorage.getItem("favouriteMovies");
      setFavouriteMovies(JSON.parse(favouriteMovies));

      const favouriteCast = await AsyncStorage.getItem("favouriteCast");
      setFavouriteCast(JSON.parse(favouriteCast));
    };

  return (
    <View className="flex-1 bg-neutral-900">
      <SafeAreaView className={ ios ? "-mb-2" : 'my-4'}>
        <View className={"z-10 flex-row justify-between items-center mx-4 bg-neutral-900"+ verticalMargin}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl pl-1">
            <ChevronLeftIcon size={28} color={"white"} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("search")}>
            <MagnifyingGlassIcon size={30} strokeWidth={2} color={"white"} />
          </TouchableOpacity>
        </View>
        <View className='w-full mt-5 mb-12'>
          <Text className='text-center text-white font-semibold text-4xl'>All Your Favourites</Text>
        </View>
        <View className ='w-full borer-2 flex flex-col text-white'>
          <MovieList title={"Your Favorite Movies"} data={favouriteMovies} isFavList={true} />
          <Cast navigation={navigation} cast={favouriteCast} title={'Your Favourite Cast'} hideCharacterName={true} isFavList={true}/>
        </View>
      </SafeAreaView>
    </View>
  );
}
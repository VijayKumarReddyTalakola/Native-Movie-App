import { Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeartIcon } from "react-native-heroicons/solid";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation,useRoute } from "@react-navigation/native";
import { styles } from "../theme";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image342 } from "../api/moviedb";
import { addToFavourites, checkFavouriteStatus } from "../utils/favourites";
import { StatusBar } from "expo-status-bar";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";
const verticalMargin = ios ? "" : "my-7";

export default function PersonScreen() {

  const {params:item} = useRoute()
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [person, setPerson]= useState({});
  const [isFavouriteCast, setIsFavouriteCast] = useState(false);
  const [personMovies, setPersonMovies] = useState([]);

  useEffect(()=>{
    setLoading(true)
    getPersonDetails(item.id)
    getPersonMovies(item.id)
    checkCastStatus(item); 
  },[item])
  
  const checkCastStatus = async (item) => {
    const isFavorite = await checkFavouriteStatus(item, "favouriteCast");
    setIsFavouriteCast(isFavorite);
  };

  const addCastToFavourites = async (item) =>{
    const isFavorite = await addToFavourites(item,'favouriteCast',isFavouriteCast)
    setIsFavouriteCast(isFavorite);
  }

  const getPersonDetails = async (id) =>{
    const data = await fetchPersonDetails(id)
    if(data) setPerson(data)
    setLoading(false)
  }

  const getPersonMovies = async (id) =>{
    const data = await fetchPersonMovies(id)
    if(data && data.cast) setPersonMovies(data.cast)
  }

  return (
    <ScrollView className="flex-1 bg-neutral-900 pt-4">
      <SafeAreaView className={ " z-10 flex-row justify-between items-center mx-4" + verticalMargin }>
      <StatusBar style="light"/>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl pl-1">
          <ChevronLeftIcon size={28} color={"white"} strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>addCastToFavourites(item)}>
          <HeartIcon size={35} color={isFavouriteCast ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <View>
          <View
            className="flex-row justify-center"
            style={{
              shadowColor: "gray",
              shadowRadius: 40,
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 1,
            }}
          >
            <View className="items-center rounded-full overflow-hidden w-72 h-72 border-2 border-neutral-500">
              <Image source={{uri: image342(person?.profile_path) || fallbackPersonImage}} style={{ width: width * 0.74, height: height * 0.43 }}/>
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {person?.name}
            </Text>
            <Text className="text-base text-neutral-500 text-center">
              {person?.place_of_birth}
            </Text>
          </View>
          <View className="mx-3 mt-6 p-4 flex-row justify-between items-center bg-neutral-700 rounded-full">
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Gender</Text>
              <Text className="text-neutral-300 text-sm">{person?.gender == 1 ? 'Female' : 'Male'}</Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Birthday</Text>
              <Text className="text-neutral-300 text-sm">{person?.birthday}</Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Known for</Text>
              <Text className="text-neutral-300 text-sm">{person?.known_for_department}</Text>
            </View>
            <View className="px-2 items-center">
              <Text className="text-white font-semibold">Popularity</Text>
              <Text className="text-neutral-300 text-sm">{person?.popularity?.toFixed(2)} %</Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Biography</Text>
            <Text className="text-neutral-400 tracking-wide">
              {person?.biography || 'NA'}
            </Text>
          </View>
          <MovieList title="Movies" data={personMovies} />
        </View>
      )}
    </ScrollView>
  );
}
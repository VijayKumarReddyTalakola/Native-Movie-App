import { View, Text, ScrollView, TouchableOpacity, Platform, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { styles, theme } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/Cast";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from "../api/moviedb";
import { StatusBar } from "expo-status-bar";
import { addToFavourites, checkFavouriteStatus } from "../utils/favourites";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";
const topMargin = ios ? "" : "mt-7";

export default function MovieScreen() {

  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavouriteMovie, setIsFavouriteMovie] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
    checkMovieStatus(item);
  }, [item]);

  const checkMovieStatus = async (item) =>{
    const isFavorite = await checkFavouriteStatus(item,'favouriteMovies')
    setIsFavouriteMovie(isFavorite)
  }

  const addMovieToFavourites = async (item) =>{
    const isFavorite = await addToFavourites(item,'favouriteMovies',isFavouriteMovie)
    setIsFavouriteMovie(isFavorite);
  }

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    // console.log(`Movie details:`,data)
    if (data) setMovie(data);
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) setCast(data.cast);
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data?.results?.length>0) setSimilarMovies(data.results);
  };

  return (
    <ScrollView contentContainerStyle={{ marginTop:4 }} className="flex-1 bg-neutral-800">
      <View className="w-full">
        <SafeAreaView className={ "absolute z-20 w-full flex-1 flex-row justify-between items-center px-4 pt-10" + topMargin } >
          <StatusBar style="auto" />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl pl-1">
            <ChevronLeftIcon size={28} color={"gray"} strokeWidth={2.5} className='border-2 border-neutral-600' />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>addMovieToFavourites(item)}>
            <HeartIcon size={35} color={isFavouriteMovie ? theme.background : "gray"} className='border-2 border-neutral-600'/>
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image source={{ uri: image500(movie.poster_path) || fallbackMoviePoster, }} style={{ width: width, height: height * 0.55 }}/>
            <LinearGradient
              colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
              style={{ width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>
      <View style={{ marginTop: -(height * 0.1) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {movie?.title}
        </Text>
        {movie?.id ? (
          <Text className="text-neutral-400  font-semibold text-base text-center">
            {movie?.status} . {movie?.release_date?.split("-")[0]} . {movie?.runtime} min
          </Text>
          ) : null
        }
        <View className="flex-row justify-center mx-4 space-x-2">
          { movie?.genres?.map((genre,index)=>{
            let showDot = index+1 != movie.genres.length
            return (
              <Text key={index} className="text-neutral-400  font-semibold text-base text-center">
                {genre.name} { showDot ? ".": null}
              </Text>
            )
          })}
        </View>
        <Text className="text-neutral-400 mx-4 tracking-wider">
          {movie?.overview}
        </Text>
      </View>
      { cast.length>0 && <Cast navigation={navigation} cast={cast} title={'Top Cast'} /> }
      { similarMovies.length>0 && <MovieList  title={"Similar Movies"} data={similarMovies}/> }
    </ScrollView>
  );
}
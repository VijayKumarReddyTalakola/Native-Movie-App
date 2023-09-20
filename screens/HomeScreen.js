import { View, Text, Platform, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovies from "../components/TrendingMovies";
import MovieList from "../components/MovieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from "../api/moviedb";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ios = Platform.OS == "ios";

export default function HomeScreen() {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    getTrendingMovies();
    getUpcomimgMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    // try{
    //   await AsyncStorage.removeItem("favouriteMovies");
    //   console.log(`Successfully removed fav movies`);
    // } catch{ err => console.log(err)}
    const data = await fetchTrendingMovies();
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };

  const getUpcomimgMovies = async () => {
    // try{
    //   await AsyncStorage.removeItem("favouriteCast");
    //   console.log(`Successfully removed fav cast`);
    // } catch{ err => console.log(err)}    
    const data = await fetchUpcomingMovies();
    if (data && data.results) setUpcoming(data.results);
  };

  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    if (data && data.results) setTopRated(data.results);
  };

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? "-mb-2" : "my-4"}>
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity onPress={()=>navigation.navigate('favourite')}>
            <Bars3CenterLeftIcon size={30} strokeWidth={2} color={"white"} />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("search")}>
            <MagnifyingGlassIcon size={30} strokeWidth={2} color={"white"} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
          {trending.length > 0 && <TrendingMovies data={trending} />}
          <MovieList title={"Upcoming"} data={upcoming} />
          <MovieList title={"Top Rated"} data={topRated} />
        </ScrollView>
      )}
    </View>
  );
}

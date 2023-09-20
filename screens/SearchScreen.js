import { View, Text, Dimensions, Platform, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
import { debounce } from "lodash";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";
const verticalMargin = ios ? "" : "my-5";

export default function SearchScreen() {

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async (value) =>{
    if(value && value.length>2) {
      setLoading(true)
      try {
        const data = await searchMovies({
          query : value,
          include_adult : 'false',
          language : 'en-US',
          page : '1'
        })
        if(data && data.results) setResults(data.results)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }else{
      setLoading(false)
      setResults([]);
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch,500),[])

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View style={{marginVertical: verticalMargin}}>
        <View className={"mx-4 my-3 flex-row justify-between items-center border border-neutral-500 rounded-full"}>
          <TextInput autoFocus onChangeText={handleTextDebounce} placeholder="Search Movie" placeholderTextColor={"lightgray"} className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"/>
          <TouchableOpacity onPress={() => navigation.goBack()} className="rounded-full p-3 m-1 bg-neutral-500">
            <XMarkIcon size={25} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }} className="space-y-3">
          <Text className="text-white font-semibold ml-1">
            Results ({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => navigation.push("movie", item)}>
                  <View className="space-y-2 mb-4">
                    <Image source={{uri: image185(item.poster_path) || fallbackMoviePoster}} style={{ width: width * 0.44, height: height * 0.3 }}/>
                    <Text className="text-neutral-300 ml-1">
                      {item?.title.length > 22 ? item?.title.slice(0, 22) + "..." : item?.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row justify-center">
          <Image source={require("../assets/images/movieTime.png")} className="h-96 w-96"/>
        </View>
      )}
    </SafeAreaView>
  );
}
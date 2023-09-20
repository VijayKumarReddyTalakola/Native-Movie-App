import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, Image } from "react-native";
import React from "react";
import { styles } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185 } from "../api/moviedb";
import Loading from "./Loading";

var { width, height } = Dimensions.get("window");

export default function MovieList({ title, data,isFavList }) {
  const navigation = useNavigation();

  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-xl">{title}</Text>
      </View>
      { 
        data?.length>0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
          { data?.map((item, index) => {
              return (
                <TouchableWithoutFeedback key={index} onPress={() => navigation.push("movie", item)}>
                  <View className="space-y-1 mr-4">
                    <Image source={{uri: image185(item.poster_path) || fallbackMoviePoster}} className="rounded-3xl" style={{ width: width * 0.33, height: height * 0.22 }}/>
                    <Text className="text-neutral-300 ml-1">
                      {item?.title.length > 14 ? item?.title.slice(0, 14) + "..." : item?.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>      
              );
            }) 
          }
        </ScrollView>
        ) : ( isFavList ? (
          <View className='mx-auto flex-col justify-center items-center p-2' style={{width:width*0.9,height:height*0.2}} >
            <Text className='text-white font-bold text-xl text-center my-3'>You don't have any favourite movies</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('home')} className='bg-yellow-500 w-fit mx-auto px-5 py-3 my-5 rounded-lg'>
              <Text className='text-white font-semibold text-lg'>Explore</Text>
            </TouchableOpacity>
          </View>
          ) : <Loading/> )
      }
    </View>
  )
}
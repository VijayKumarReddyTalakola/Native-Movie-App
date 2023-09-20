import { View, Text, ScrollView, TouchableOpacity,Image, Dimensions } from "react-native";
import React from "react";
import { fallbackPersonImage, image185 } from "../api/moviedb";
import Loading from "./Loading";

var { width, height } = Dimensions.get("window");

export default function Cast({title, cast, navigation,hideCharacterName,isFavList}) {

  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">{title}</Text>
      {
        cast?.length>0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
          { cast?.map((person, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => navigation.navigate("person", person)} className="mr-4 items-center">
                <View className="overflow-hidden rounded-full h-20 w-20 items-center border border-neutral-500">
                  <Image className="rounded-2xl h-24 w-20 object-cover" source={{uri:image185(person?.profile_path) || fallbackPersonImage}}/>
                </View>
                { !hideCharacterName && (
                  <Text className="text-white text-xs mt-1">
                    { person?.character.length > 10 ? person?.character.slice(0, 10) + "..." : person?.character}
                  </Text>
                )}
                <Text className="text-neutral-400 text-xs mt-1">
                  { person?.original_name.length > 10 ? person?.original_name.slice(0, 10) + "..." : person?.original_name}
                </Text>
              </TouchableOpacity>
            );
          })
          }
        </ScrollView>
        ) : ( isFavList ? (
          <View className=' mx-auto flex-col justify-center items-center p-2' style={{width:width*0.9,height:height*0.2}}>
            <Text className='text-white font-bold text-xl text-center my-3'>You don't have any favourite cast</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('home')} className='bg-yellow-500 w-fit mx-auto px-5 py-3 my-5 rounded-lg'>
              <Text className='text-white font-semibold text-lg'>Explore</Text>
            </TouchableOpacity>
          </View>
          ) : <Loading/> )
      }
    </View>
  );
}
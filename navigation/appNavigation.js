import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import FavouritesScreen from "../screens/FavouritesScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" options={{ headerShown: false }} component={HomeScreen}/>
        <Stack.Screen name="movie" options={{ headerShown: false }} component={MovieScreen}/>
        <Stack.Screen name="person" options={{ headerShown: false }} component={PersonScreen}/>
        <Stack.Screen name="search" options={{ headerShown: false }} component={SearchScreen}/>
        <Stack.Screen name="favourite" options={{ headerShown: false }} component={FavouritesScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkFavouriteStatus = async (item, key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      const parsedValue = JSON.parse(value);
      return parsedValue.some((fav) => fav.id === item.id);
    }
  } catch (error) {
    console.error(error);
  }
};

export const addToFavourites = async (item, key, isFavourite) => {
  try {
    const value = await AsyncStorage.getItem(key);
    const updatedValue = value ? JSON.parse(value) : [];

    if (isFavourite) {
      const newValue = updatedValue.filter((fav) => fav.id !== item.id);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
      return false;
    } else {
      updatedValue.push(item);
      await AsyncStorage.setItem(key, JSON.stringify(updatedValue));
      return true;
    }
  } catch (error) {
    console.error(error);
  }
};

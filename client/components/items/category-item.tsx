import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Category from "@common/interfaces/category";

export default function CategoryItem({ category }: { category: Category }) {
  const router = useRouter();

  const handlePress = () => {
    const sanitizedCategory = category.name.toLowerCase().replace(/[\[\]]/g, '').trim();
    router.navigate({
      pathname: `/(app)/inventory/user` as any,

    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image 
        source={typeof category.icon === 'string' ? { uri: category.icon } : category.icon}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    margin: 8,
    width: 150,
    height: 200,
  },
  icon: {
    height: 100,
    width: 100,
    borderRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  }
});
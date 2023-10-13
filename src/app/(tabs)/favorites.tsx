import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import TrackListItem from "../../components/TrackListItem";
const query = gql`
  query MyQuery($userid: String!) {
    favoritesByUserid(userid: $userid) {
      id
      trackid
      userid
      track {
        id
        name
        preview_url
        artists {
          id
          name
        }
        album {
          id
          name
          images {
            url
            height
            width
          }
        }
      }
    }
  }
`;
const FavoritesScreen = () => {
  const { data, loading, error } = useQuery(query, {
    variables: { userid: "can" },
  });

  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch recommendations. {error.message}</Text>;
  }
  console.log(data?.favoritesByUserid);
  const tracks = data?.favoritesByUserid || [];
  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item.track} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FavoritesScreen;

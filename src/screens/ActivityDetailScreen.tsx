import { FunctionComponent } from "react";
import { Text, View } from "react-native"
import { ActivityType } from "../types/Activity";
import { useRoute } from "@react-navigation/native";

interface Props {
  activity: ActivityType
}

const ActivityDetailScreen: FunctionComponent<Props> = () => {
  const route = useRoute();
  const { activity } = route.params as unknown as Props;

  return (
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
      <Text>{JSON.stringify(activity)}</Text>
    </View>
  )
}

export default ActivityDetailScreen;
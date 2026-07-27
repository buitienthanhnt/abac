import { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";

// create a storage instance
const storage = createAsyncStorage("appDB");

const DashboardScreen = () => {

  const [listActivity, setListActivity] = useState<any[]>([]);
  const [label, setLabel] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  const getCurrentActivity = useCallback(async () => {
    const currentActivity = await storage.getItem('activity');
    return JSON.parse(currentActivity || '[]');
  }, []);

  const asyncCurrentActivity = useCallback(async () => {
    setListActivity(await getCurrentActivity());
  }, [getCurrentActivity]);

  const addActivity = useCallback(async (activity) => {
    const currentActivity = await storage.getItem('activity');
    const localActivity = JSON.parse(currentActivity || '[]');
    storage.setItem('activity', JSON.stringify([...localActivity, activity]));
    asyncCurrentActivity();
  }, [asyncCurrentActivity])

  const removeActivity = useCallback(async (index: number) => {
    const curentActivity = await getCurrentActivity();
    const localActivity = [...curentActivity];
    localActivity.splice(index, 1);
    storage.setItem('activity', JSON.stringify(localActivity));
  }, [getCurrentActivity]);

  useEffect(() => {
    asyncCurrentActivity();
  }, [asyncCurrentActivity])

  return (
    <View style={{ flex: 1, padding: 4 }}>
      {!!listActivity && <View>
        <Text>Danh sách hoạt động: {listActivity.length}</Text>
        {listActivity.map((item, index) => (
          <Text key={index}>{item.label} - {item.price}</Text>
        ))}
      </View>}
      <View style={{ rowGap: 10 }}>
        <TextInput onChangeText={(text) => setLabel(text)} style={{
          height: 40,
          borderWidth: 1,
          borderRadius: 8,
          padding: 4,
        }} placeholder="label" value={label} />

        <TextInput onChangeText={(text) => setPrice(text)} placeholder="price" value={price} style={{
          height: 40,
          borderWidth: 1,
          borderRadius: 8,
          padding: 4,
        }} keyboardType="numeric" />
        <Button onPress={() => addActivity({ label, price })}>
          <Text>Lưu</Text>
        </Button>
      </View>

    </View>
  );
}

export default DashboardScreen;
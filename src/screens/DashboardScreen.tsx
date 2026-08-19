import { useCallback, useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import { ActivityType } from "../types/Activity";
import { DATABASE_ENUM } from "../enum/database";
import { ActivityEnum } from "../enum/activity";
import { useNavigation } from '@react-navigation/native';

// create a storage instance
const storage = createAsyncStorage(DATABASE_ENUM.LOCAL_STORAGE);

const nowPrice = {
  sellPrice: 99,
  buyPrice: 78,
};

const DashboardScreen = () => {

  const [listActivity, setListActivity] = useState<ActivityType[]>([]);
  const [label, setLabel] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  const getCurrentActivity = useCallback(async () => {
    const currentActivity = await storage.getItem(ActivityEnum.ACTIVITY_BUY_ACTION);
    return JSON.parse(currentActivity || '[]');
  }, []);

  const asyncCurrentActivity = useCallback(async () => {
    setListActivity(await getCurrentActivity());
  }, [getCurrentActivity]);

  /**
   * Add activity to storage
   */
  const addActivity = useCallback(async (activity) => {
    if (!activity.price) {
      return;
    }
    const currentActivity = await storage.getItem(ActivityEnum.ACTIVITY_BUY_ACTION);
    const localActivity = JSON.parse(currentActivity || '[]');
    await storage.setItem(ActivityEnum.ACTIVITY_BUY_ACTION, JSON.stringify([...localActivity,
    {
      ...activity,
      id: Date.now().toString(),
      qty: 1,
      type: 'sliver',
      unit: 'C',
    }
    ]));
    asyncCurrentActivity();
  }, [asyncCurrentActivity])

  const removeActivity = useCallback(async (index: number) => {
    const curentActivity = await getCurrentActivity();
    const localActivity = [...curentActivity];
    localActivity.splice(index, 1);
    await storage.setItem(ActivityEnum.ACTIVITY_BUY_ACTION, JSON.stringify(localActivity));
    asyncCurrentActivity();
  }, [getCurrentActivity, asyncCurrentActivity]);

  useEffect(() => {
    asyncCurrentActivity();
  }, [asyncCurrentActivity])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1, padding: 4 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ rowGap: 10 }}>
          <TextInput onChangeText={(text) => setLabel(text)} style={{
            height: 40,
            borderWidth: 1,
            borderRadius: 8,
            padding: 4,
          }} placeholder="Tiêu đề" value={label} />

          <TextInput onChangeText={(text) => setPrice(text)} placeholder="Giá mua" value={price} style={{
            height: 40,
            borderWidth: 1,
            borderRadius: 8,
            padding: 4,
          }} keyboardType="numeric" />
          <Button onPress={() => addActivity({ label, price })}>
            <Text>Lưu</Text>
          </Button>
        </View>
        {!!listActivity && <View style={{ rowGap: 10, marginTop: 10 }}>
          <Text>Danh sách hoạt động: {listActivity.length}</Text>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5, padding: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>Giá bán ra: {nowPrice.sellPrice}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>Giá mua vào: {nowPrice.buyPrice}</Text>
          </View>
          {listActivity.map((item, index) => (
            <CaculateItem key={index} index={index} item={item} removeActivity={removeActivity} />
          ))}
          <TotalPrice items={listActivity} />
          <Text>{ }</Text>
        </View>}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

interface ItemProps {
  item: ActivityType,
  removeActivity: (index: number) => void,
  index: number,
}
const CaculateItem = ({ item, removeActivity, index }: ItemProps) => {
  const caculatePrice = item.price - nowPrice.sellPrice;
  const navigation = useNavigation();

  const openDetail = useCallback(() => {
    navigation.navigate('ActivityDetailPage', {
      activity: item
    });
  }, [navigation, item])

  return (
    <TouchableOpacity style={style.activityItem} onPress={openDetail}>
      <Text style={style.itemLabel}>{item.label}</Text>
      <View>
        <Text style={style.itemPrice}>{item.price} * {item.qty}</Text>
        <Text style={caculatePriceStyle(caculatePrice)}>{caculatePrice > 0 ? '+' : ''} {caculatePrice}</Text>
      </View>
      <TouchableOpacity onPress={() => removeActivity(index)}>
        <Ionicons name="close" size={36} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const TotalPrice = ({ items }: { items: ActivityType[], }) => {
  const total = items.reduce((totalx, item) => totalx + Number(item.price) - nowPrice.sellPrice, 0);
  return (
    <View>
      <Text style={{
        fontSize: 22,
        fontWeight: 'semibold',
        color: total > 0 ? 'green' : 'red',

      }}>Giá trị tích lũy: {total}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  activityItem: {
    rowGap: 4,
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
    backgroundColor: '#87aef8ff',
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 20,
    fontWeight: 'semibold',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'yellow',
  },
  itemCaculatePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

const caculatePriceStyle = (value: number): StyleProp<TextStyle> => ({
  fontSize: 16,
  fontWeight: 'bold',
  color: value > 0 ? 'green' : 'red',
});

export default DashboardScreen;
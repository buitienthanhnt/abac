import { FunctionComponent, useCallback, useState } from "react";
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import { ActivityType } from "../types/Activity";
import { useRoute } from "@react-navigation/native";
import { Button } from "@react-navigation/elements";

interface Props {
  activity: ActivityType
}

const ActivityDetailScreen: FunctionComponent<Props> = () => {
  const route = useRoute();
  const { activity } = route.params as unknown as Props;
  const [qty, setQty] = useState<number>(activity?.qty || 0);
  const [sellPrice, setSellPrice] = useState<number>(activity?.price || 0);

  const onSellValue = useCallback(() => {
    const newActivity = {
      qty, sellPrice, id: activity.id, type: 'sell', label: activity.label
    }
    console.log(newActivity);

  }, [sellPrice, qty, activity?.id, activity?.label]);

  return (
    <View style={styles.containerStyle}>
      <Text>{activity.label} - {activity.price} - {activity.qty || 0}</Text>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.sellFormStyle}>
            <Text>ban</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="qty"
              keyboardType="number-pad"
              value={qty.toString()}
              onChangeText={(value) => setQty(Number(value))}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder="gia ban ra"
              keyboardType="number-pad"
              value={sellPrice.toString()}
              onChangeText={(value) => setSellPrice(Number(value))}
            />
            <Button onPress={onSellValue}>Ban</Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1, display: 'flex', padding: 4
  },
  sellFormStyle: {
    rowGap: 8,
    // flex: 1,
    // backgroundColor: '#87aef8ff',
    padding: 8,
    paddingVertical: 16,
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    fontWeight: 'semibold',
  }
});

export default ActivityDetailScreen;
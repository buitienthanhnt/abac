import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useLocalStorage from "../hook/useLocalStorage";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// image bank avatar:  https://qr.sepay.vn/assets/img/banklogo/VCB.png?v=20260603220157
const HomeScreen = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const [value, saveData, getData] = useLocalStorage('bankConfig', true);
  const [amount, setAmount] = useState<number>(0);
  const [des, setDes] = useState('Đồng ý thanh toán');
  const onRemveItem = useCallback((acc: string) => {
    if (!value || value.length === 0) {
      return;
    }
    const result = value?.filter((item: any) => item.acc !== acc);
    saveData(result);
  }, [saveData, value])

  const OnAddQr = useCallback(() => {
    navigation.navigate('BankConfigPage' as never)
  }, [navigation])

  useEffect(() => {
    navigation?.setOptions({
      headerRight: () => (
        <Pressable onPress={OnAddQr}>
          <Ionicons name="add-circle" size={36} color="black"></Ionicons>
        </Pressable>
      ),
    });
  }, [OnAddQr, navigation])

  useFocusEffect(() => {
    getData();
  })

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputStyle} placeholder="Số tiền chuyển khoản" onChangeText={(val) => setAmount(Number(val))} value={amount.toString()} keyboardType="number-pad" />
        <TextInput style={styles.inputStyle} placeholder="Nội dung thanh toán" onChangeText={(val) => setDes(val)} value={des} />
      </View>
      <View style={{
        flex: 1,
      }}>
        <FlatList contentContainerStyle={{
          rowGap: 8,
          paddingBottom: tabBarHeight,
        }}
          columnWrapperStyle={{
            gap: 8
          }}
          data={value}
          keyExtractor={(item) => item.acc}
          numColumns={2}
          renderItem={({ item, index }) => <QrItem
            key={index.toString()}
            amount={amount}
            des={des}
            value={item}
            onRemove={onRemveItem}
          />}
          line
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8e7ccfff',
    padding: 5,
    paddingBottom: 0,
    gap: 10
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    fontWeight: 'semibold',
  },
  copyIcon: {
    position: 'absolute',
    top: 10,
    width: 'auto',
  },
  inputContainer: {
    width: '100%',
    gap: 20,
  }
})

const QrItem = ({ value, amount, des, onRemove }: { value: { acc: string, bank: string } | null, amount: number, des: string, onRemove?: (acc: string) => void }) => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const onOpenDetail = useCallback(() => {
    navigation.navigate('BankQrPage', {
      value: value, amount: amount, des: des
    })
  }, [amount, des, navigation, value])

  const onCopyImage = useCallback(async () => {
    Clipboard.setString(`https://vietqr.app/img?acc=${value?.acc}&bank=${value?.bank || ''}&amount=${amount}&des=${des.replace(' ', '+')}&template=compact&showinfo=true`);
  }, [amount, value?.bank, des, value?.acc])

  if (!value) {
    return null;
  }

  return (
    <View style={{
      flex: 1,
      height: width,
      // borderRadius: 10
    }}>
      <Pressable onPress={onOpenDetail} style={{
        flex: 1
      }}>
        <Image style={{
          backgroundColor: 'white',
          resizeMode: 'contain',
          flex: 1,
          height: width,
          borderRadius: 10
        }}
          source={{
            uri: `https://vietqr.app/img?acc=${value?.acc}&bank=${value?.bank || ''}&amount=${amount}&des=${des.replace(' ', '+')}&template=compact&showinfo=true`
          }} >
        </Image>
      </Pressable>
      <TouchableOpacity style={[styles.copyIcon, { right: 10 }]} onPress={onCopyImage}>
        <Ionicons name="copy" size={36} color="#2f2f3dff" />
      </TouchableOpacity>
      <Pressable style={[styles.copyIcon, { left: 10 }]} onPress={() => onRemove?.(value.acc)}>
        <Ionicons name="trash" size={36} color="#2f2f3dff" />
      </Pressable>
    </View>
  )
}


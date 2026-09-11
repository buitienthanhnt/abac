import Clipboard from "@react-native-clipboard/clipboard";
import { useCallback, useState } from "react";
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

const BankQrScreen = ({ route }) => {
  const value = route?.params?.value;
  const [amount, setAmount] = useState<number>(route?.params?.amount || 0);
  const [des, setDes] = useState(route?.params?.des || '');

  const onCopyImage = useCallback(async () => {
    Clipboard.setString(`https://vietqr.app/img?acc=${value?.acc}&bank=${value?.bank || ''}&amount=${amount}&des=${des.replace(' ', '+')}&template=compact&showinfo=true`);
    Alert.alert('Sao chép thành công!');
  }, [amount, value?.bank, des, value?.acc])

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputStyle} placeholder="Số tiền chuyển khoản" onChangeText={(val) => setAmount(Number(val))} value={amount?.toString()} keyboardType="number-pad" />
        <TextInput style={styles.inputStyle} placeholder="Nội dung thanh toán" onChangeText={(val) => setDes(val)} value={des} />
      </View>
      <View style={{
        flex: 1,
      }}>
        <Image style={{
          backgroundColor: 'white',
          resizeMode: 'contain',
          flex: 1,
          borderRadius: 10
        }}
          source={{
            uri: `https://vietqr.app/img?acc=${value?.acc}&bank=${value?.bank || ''}&amount=${amount}&des=${des.replace(' ', '+')}&template=compact&showinfo=true`
          }} >
        </Image>
        <TouchableOpacity style={[styles.copyIcon, { right: 10 }]} onPress={onCopyImage}>
          <Ionicons name="copy" size={36} color="#2f2f3dff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default BankQrScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ca6d6ff',
    padding: 5,
    // paddingTop: 10,
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
    gap: 20
  }
})
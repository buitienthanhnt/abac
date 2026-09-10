import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import useLocalStorage from "../hook/useLocalStorage";
import { useCallback, useEffect, useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';

const bankConfig = 'bankConfig';
const banks = [
  { label: 'Vietcombank', value: 'Vietcombank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/VCB.png', }, },
  { label: 'VietinBank', value: 'VietinBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/ICB.png' } },
  { label: 'MBBank', value: 'MBBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/MB.png' } },
  { label: 'ACB', value: 'ACB', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/ACB.png' } },
  { label: 'VPBank', value: 'VPBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/VPB.png' } },
  { label: 'TPBank', value: 'TPBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/TPB.png' } },
  { label: 'MSB', value: 'MSB', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/MSB.png' } },
  { label: 'NamABank', value: 'NamABank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/NAB.png' } },
  { label: 'LPBank', value: 'LPBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/LPB.png' } },
  { label: 'BVBank', value: 'BVBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/VCCB.png' } },
  { label: 'BIDV', value: 'BIDV', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/BIDV.png' } },
  { label: 'Sacombank', value: 'Sacombank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/STB.png' } },
  { label: 'VIB', value: 'VIB', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/VIB.png' } },
  { label: 'HDBank', value: 'HDBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/HDB.png' } },
  { label: 'SeABank', value: 'SeABank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/SEAB.png' } },
  { label: 'GPBank', value: 'GPBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/GPB.png' } },
  { label: 'PVcomBank', value: 'PVcomBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/PVCB.png' } },
  { label: 'PVcomBankPay', value: 'PVcomBankPay', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/PVCB.png' } },
  { label: 'ShinhanBank', value: 'ShinhanBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/SHBVN.png' } },
  { label: 'SCB', value: 'SCB', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/SCB.png' } },
  { label: 'Agribank', value: 'Agribank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/VBA.png' } },
  { label: 'Techcombank', value: 'Techcombank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/TCB.png' } },
  { label: 'SaigonBank', value: 'SaigonBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/SGICB.png' } },
  { label: 'BacABank', value: 'BacABank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/BAB.png' } },
  { label: 'ABBANK', value: 'ABBANK', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/ABB.png' } },
  { label: 'VietABank', value: 'VietABank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/VAB.png' } },
  { label: 'Eximbank', value: 'Eximbank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/EIB.png' } },
  { label: 'VietBank', value: 'VietBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/VIETBANK.png' } },
  { label: 'BaoVietBank', value: 'BaoVietBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/BVB.png' } },
  { label: 'SHB', value: 'SHB', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/SHB.png' } },
  { label: 'KienLongBank', value: 'KienLongBank', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/KLB.png' } },
  { label: 'HSBC', value: 'HSBC', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/HSBC.png' } },
  { label: 'COOPBANK', value: 'COOPBANK', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/COOPBANK.png' } },
  { label: 'MoMo', value: 'MoMo', image: { uri: 'https://qr.sepay.vn/assets/img/banklogo/MOMO.png' } },
]

const BankConfigScreen = () => {
  const [value, saveData] = useLocalStorage(bankConfig, true);

  const [bank, setBank] = useState(value?.bank || '');
  const [isFocus, setIsFocus] = useState(false);
  const [acc, setAcc] = useState(value?.acc || '');
  const [accName, setAccName] = useState(value?.accName || '');

  const onSaveConfig = useCallback(() => {
    if (!bank || !acc) {
      return Alert.alert('Vui lòng nhập đầy đủ thông tin ngân hàng và số tài khoản');
    }
    saveData([...(value || []), { bank, acc, accName }]);
    Alert.alert('Lưu thành công!')

  }, [acc, accName, bank, saveData, value])

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        <Image style={styles.iconStyle} source={item.image} />
      </View>
    );
  };

  useEffect(() => {
    if (value) {
      setBank(value.bank);
      setAcc(value.acc);
      setAccName(value.accName);
    }
  }, [value])

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={banks}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Chọn ngân hàng' : '...'}
        searchPlaceholder="Tìm kiếm..."
        value={bank}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setBank(item.value);
          setIsFocus(false);
        }}
        renderItem={renderItem}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Số tài khoản"
        value={acc}
        onChangeText={setAcc}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Chủ tài khoản"
        value={accName}
        onChangeText={setAccName}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={onSaveConfig}>
        <Text style={styles.saveLabel}>Lưu</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BankConfigScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ca6d6ff',
    padding: 10,
    paddingTop: 32,
    gap: 10
  },
  inputStyle: {
    borderWidth: 0.5,
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
  },
  saveBtn: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  imageStyle: {
    width: 24,
    height: 24,
  },
  item: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
})
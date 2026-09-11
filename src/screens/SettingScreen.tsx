import { Button } from '@react-navigation/elements';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { DATABASE_ENUM } from '../enum/database';

const appUrl = 'https://play.google.com/store/apps/details?id=com.abac';
const storage = createAsyncStorage(DATABASE_ENUM.LOCAL_STORAGE);

export const SettingScreen: FunctionComponent<any> = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const [num, setNum] = useState<number>(0);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const checkLogin = useCallback(async () => {
    const _isLogin = await storage.getItem('isLogin');
    setIsLogin(_isLogin === 'true');
  }, [])

  const onLogin = useCallback(async () => {
    if (num === 8) {
      await storage.setItem('isLogin', 'true');
      await checkLogin();
      return;
    }
    setNum(num + 1);
  }, [checkLogin, num]);

  const handlePress = useCallback(async (url: string) => {
    const activeUrl = await Linking.canOpenURL(url);
    if (activeUrl) {
      Linking.openURL(url);
    }
  }, [])

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <View style={{ flex: 1, padding: 4, paddingBottom: tabBarHeight, rowGap: 5, justifyContent: 'space-between' }}>
      {/* <Button variant="filled" onPress={() => {
        navigation.navigate('DashboardPage');
      }}>Active history</Button> */}

      <View style={styles.contentView}>
        <TouchableOpacity style={styles.navigateBtn} onPress={() => {
          navigation.navigate('StockPage');
        }}>
          <Text style={styles.navigateBtnLabel}>Dss kho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigateBtn} onPress={() => {
          navigation.navigate('LodePage');
        }}>
          <Text style={styles.navigateBtnLabel}>Xổ số miền bắc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigateBtn} onLongPress={onLogin}>
          <Text style={styles.authLabel}>{isLogin ? 'Xin chào' : 'Đăng nhập'}</Text>
        </TouchableOpacity>
      </View>
      <Button variant="filled" onPress={() => handlePress(appUrl)}>Cập nhật</Button>
    </View>
  )
}

export default SettingScreen;

const styles = StyleSheet.create({
  contentView: {
    gap: 5
  },
  pagerView: {
    flex: 1,
    // backgroundColor: '#3288c2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageItemStyle: {
    // alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    backgroundColor: '#37c232ff',
  },
  navigateBtn: {
    backgroundColor: '#8a6eccff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // borderColor: '#c28832ff',
    // borderWidth: 1,
  },
  navigateBtnLabel: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18
  },
  authLabel: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18
  },
});
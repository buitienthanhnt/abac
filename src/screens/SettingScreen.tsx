import { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export const SettingScreen: FunctionComponent<any> = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#7ca6d6ff' }} >
      {/* <View style={{ height: insets.top, backgroundColor: 'rgba(20, 20, 218, 0.33)'}}></View> */}
      {/* <PagerView style={styles.pagerView} initialPage={0}>
        <View key="1" style={styles.pageItemStyle}>
          <Text>First page</Text>
        </View>
        <View key="2" style={styles.pageItemStyle}>
          <Text>Second page</Text>
        </View>
      </PagerView> */}
    </SafeAreaProvider>
  )
}

export default SettingScreen;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: '#3288c2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageItemStyle: {
    // alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    backgroundColor: '#37c232ff',
  },
});
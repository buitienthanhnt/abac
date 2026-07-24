import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabView, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const routes = [
  { key: 'first', title: 'First' },
  { key: 'second', title: 'Second' },
];

export const SettingScreen: FunctionComponent<any> = () => {
  const insets = useSafeAreaInsets();
   const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );

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
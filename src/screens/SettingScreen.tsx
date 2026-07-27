import { Button } from '@react-navigation/elements';
import React, { FunctionComponent, useCallback } from 'react';
import { Linking, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap } from 'react-native-tab-view';

const appUrl = 'https://play.google.com/store/apps/details?id=com.abac';

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

type OpenURLButtonProps = {
  url: string;
  children: string;
};

export const SettingScreen: FunctionComponent<any> = () => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  // return (
  //   <TabView
  //     navigationState={{ index, routes }}
  //     renderScene={renderScene}
  //     onIndexChange={setIndex}
  //     initialLayout={{ width: layout.width }}
  //   />
  // );

  const handlePress = useCallback(async (url: string) => {
    const activeUrl = await Linking.canOpenURL(url);
    if (activeUrl) {
      Linking.openURL(url);
    }
  }, [])

  return (
    <View style={{ flex: 1, padding: 4, rowGap: 5 }}>
      <Button variant="filled" onPress={() => handlePress(appUrl)}>Cập nhật</Button>
      <Button variant="filled" onPress={() => {
        navigation.navigate('DashboardPage');
      }}>Active history</Button>
    </View>
  )
}

export default SettingScreen;

const styles = StyleSheet.create({
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
});
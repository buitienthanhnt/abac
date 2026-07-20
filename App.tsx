/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SliverChartScreen from './src/screens/SliverChartScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const queryClient = new QueryClient();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function AppContent() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SliverChartScreen />
    </ScrollView>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    App: AppContent,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Navigation />
        {/*<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />*/}
        {/*<AppContent />*/}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4, //50
  },
});

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SliverChartScreen from './src/screens/SliverChartScreen';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

const queryClient = new QueryClient();

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('App')}>
        Go to Sliver chart
      </Button>
    </View>
  );
}

function AppContent() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Button onPress={() => navigation.navigate('Home')}>
        Go to Home
      </Button>
      <SliverChartScreen />
    </ScrollView>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'App',
  screens: {
    Home:{
      screen: HomeScreen,
      options: {
        title: 'Trang chủ'
      }
    },
    App: {
      screen: AppContent,
      options: {
        title: 'Biến động giá bạc'
      }
    },
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

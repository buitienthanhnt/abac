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
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
// Sử dụng bộ icon Ionicons làm ví dụ
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingScreen from './src/screens/SettingScreen';

const queryClient = new QueryClient();

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7ca6d6ff' }}>
      {/* <Button onPress={() => navigation.navigate('App')}>
        Go to Sliver chart
      </Button> */}
    </View>
  );
}

function AppContent() {
  const navigation = useNavigation();

  return (<SliverChartScreen />);
}

// const RootStack = createNativeStackNavigator({
//   initialRouteName: 'App',
//   screens: {
//     Home: {
//       screen: HomeScreen,
//       options: {
//         title: 'Trang chủ'
//       }
//     },
//     App: {
//       screen: AppContent,
//       options: {
//         title: 'Biến động giá bạc'
//       }
//     },
//   },
// });

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
      options: {
        title: 'Trang chủ',
        headerTransparent: true,
      }
    }),
    App: createBottomTabScreen({
      screen: AppContent,
      options: {
        // headerTransparent: true,
        headerStyle: {
          backgroundColor: 'transparent', // Làm trong suốt nền header
        },
        headerShadowVisible: false, // Xóa bỏ đường viền/đổ bóng phía dưới header (v6/v7)
        // headerTintColor: '#fff',     // Đổi màu chữ và nút Back sang màu trắng để nổi bật trên nền tối
      }
    }),
    Setting: createBottomTabScreen({
      screen: SettingScreen,
      options: {
        title: 'Cài đặt',
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerShadowVisible: false, // Xóa bỏ đường viền/đổ bóng phía dưới header (v6/v7)
        // headerTransparent: true  // Làm trong suốt nền header, cũng như chuyển về là absolute
      }
    }),
  },
  screenOptions: ({ route }) => {
    return {
      tabBarStyle: {
        position: 'absolute',     // Bắt buộc: Đẩy nội dung màn hình tràn xuống dưới tab bar
        backgroundColor: 'transparent', // Làm trong suốt nền tab bar
        borderTopWidth: 0,        // Xóa đường viền phía trên (iOS)
        elevation: 0,             // Xóa bóng đổ/độ nổi (Android)
      },

      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'App') {
          iconName = focused ? 'star' : 'star';
        } else {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        // Trả về component icon tương ứng
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1E90FF',   // Màu icon khi đang chọn
      tabBarInactiveTintColor: 'black',    // Màu icon khi không chọn
    }
  }
});

// const Navigation = createStaticNavigation(RootStack);
const Navigation = createStaticNavigation(MyTabs);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      {/* <SafeAreaProvider> */}
      <Navigation />
      {/*<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />*/}
      {/*<AppContent />*/}
      {/* </SafeAreaProvider> */}
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

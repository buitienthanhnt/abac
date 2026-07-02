/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { LineChart, LineChartBicolor } from 'react-native-gifted-charts';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container}>
      <AnimatedArea />
      <MultiLines></MultiLines>
      <LineColor />
      <LineArea />
      {/* <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});

export default App;

const AnimatedArea = () => {
  const lineData = [
    { value: 0 },
    { value: 20 },
    { value: 18 },
    { value: 40 },
    { value: 36 },
    { value: 60 },
    { value: 54 },
    { value: 85 },
  ];
  return (
    <View style={{ borderWidth: 1 }}>
      <LineChart
        areaChart
        stepChart
        hideDataPoints
        isAnimated
        animationDuration={1200}
        startFillColor="#0BA5A4"
        startOpacity={1}
        endOpacity={0.3}
        initialSpacing={0}
        data={lineData}
        spacing={30}
        thickness={5}
        hideRules
        hideYAxisText
        yAxisColor="#0BA5A4"
        showVerticalLines
        verticalLinesColor="rgba(14,164,164,0.5)"
        xAxisColor="#0BA5A4"
        color="#0BA5A4"
      />
    </View>
  );
};

const MultiLines = () => {
  const lineData = [
    { value: 0, dataPointText: '0' },
    { value: 10, dataPointText: '10' },
    { value: 8, dataPointText: '8' },
    { value: 58, dataPointText: '58' },
    { value: 56, dataPointText: '56' },
    { value: 78, dataPointText: '78' },
    { value: 74, dataPointText: '74' },
    { value: 98, dataPointText: '98' },
  ];

  const lineData2 = [
    { value: 0, dataPointText: '0' },
    { value: 20, dataPointText: '20' },
    { value: 18, dataPointText: '18' },
    { value: 40, dataPointText: '40' },
    { value: 36, dataPointText: '36' },
    { value: 60, dataPointText: '60' },
    { value: 54, dataPointText: '54' },
    { value: 85, dataPointText: '85' },
  ];
  return (
    <View>
      <LineChart
        data={lineData}
        data2={lineData2}
        height={250}
        showVerticalLines
        spacing={44}
        initialSpacing={0}
        color1="skyblue"
        color2="orange"
        textColor1="green"
        dataPointsHeight={6}
        dataPointsWidth={6}
        dataPointsColor1="blue"
        dataPointsColor2="red"
        textShiftY={-2}
        textShiftX={-5}
        textFontSize={13}
      />
    </View>
  );
}

// https://gifted-charts.web.app/linechart/#differentWaysToMultiColor
const LineColor = () => {
  const data = [
    { value: 15, label: 'Mon' },
    { value: 30, label: 'Tue' },
    { value: -23, label: 'Wed' },
    { value: 40, label: 'Thu' },
    { value: -16, label: 'Fri' },
    { value: 40, label: 'Sat' },
  ];

  return (
    <LineChartBicolor
      data={data}
      areaChart
      color="green"
      colorNegative="red"
      startFillColor="green"
      startFillColorNegative="red"
    />
  )
}

const LineArea = () => {
  const ptData = [
    { value: 160, date: '1 Apr 2022' },
    { value: 180, date: '2 Apr 2022' },
    { value: 190, date: '3 Apr 2022' },
    { value: 180, date: '4 Apr 2022' },
    { value: 140, date: '5 Apr 2022' },
    { value: 145, date: '6 Apr 2022' },
    { value: 160, date: '7 Apr 2022' },
    { value: 200, date: '8 Apr 2022' },

    { value: 220, date: '9 Apr 2022' },
    {
      value: 240,
      date: '10 Apr 2022',
      label: '10 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 280, date: '11 Apr 2022' },
    { value: 260, date: '12 Apr 2022' },
    { value: 340, date: '13 Apr 2022' },
    { value: 385, date: '14 Apr 2022' },
    { value: 280, date: '15 Apr 2022' },
    { value: 390, date: '16 Apr 2022' },

    { value: 370, date: '17 Apr 2022' },
    { value: 285, date: '18 Apr 2022' },
    { value: 295, date: '19 Apr 2022' },
    {
      value: 300,
      date: '20 Apr 2022',
      label: '20 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 280, date: '21 Apr 2022' },
    { value: 295, date: '22 Apr 2022' },
    { value: 260, date: '23 Apr 2022' },
    { value: 255, date: '24 Apr 2022' },

    { value: 190, date: '25 Apr 2022' },
    { value: 220, date: '26 Apr 2022' },
    { value: 205, date: '27 Apr 2022' },
    { value: 230, date: '28 Apr 2022' },
    { value: 210, date: '29 Apr 2022' },
    {
      value: 200,
      date: '30 Apr 2022',
      label: '30 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
  ];

  return (
    <View
      style={{
        paddingVertical: 100,
        paddingLeft: 20,
        backgroundColor: '#1C1C1C',
      }}>
      <LineChart
        areaChart
        data={ptData}
        rotateLabel
        width={300}
        hideDataPoints
        spacing={10}
        color="#00ff83"
        thickness={2}
        startFillColor="rgba(20,105,81,0.3)"
        endFillColor="rgba(20,85,81,0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={6}
        maxValue={600}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        yAxisSide='right'
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: 'lightgray',
          pointerStripWidth: 2,
          pointerColor: 'lightgray',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: items => {
            return (
              <View
                style={{
                  height: 90,
                  width: 100,
                  justifyContent: 'center',
                  marginTop: -30,
                  marginLeft: -40,
                }}>
                <Text style={{ color: 'white', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                  {items[0].date}
                </Text>

                <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {'$' + items[0].value + '.0'}
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />
      </View>
  );
}

/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useState } from "react";
import SliverChart from "../components/SliverChart";
import { useSliverChartData, useSliverPercent } from "../hook/useSliverData";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, useWindowDimensions, View, ViewStyle } from "react-native";
import { formatCurrency } from "../until/formatApexChartData";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar, TabView } from 'react-native-tab-view';

const routes = [
  { key: 'onday', title: 'Hôm nay' },
  { key: 'sevendays', title: '7 ngày' },
  { key: 'thirtydays', title: '30 ngày' },
];

const SliverChartScreen = () => {
  const layout = useWindowDimensions();

  const [type, setType] = useState<'L' | 'C' | 'KG'>('L');
  const [index, setIndex] = React.useState(0);

  const { data: sevenDayData, isLoading, isError, isFetching } = useSliverChartData(7, type);
  const { data: thirtyDayData, } = useSliverChartData(30, type);
  const { data: onDayData, } = useSliverChartData(1, type);
  const { data: sliverPrercent } = useSliverPercent(1);
  const { data: sliverSevenPrercent } = useSliverPercent(7);
  const { data: sliverThirtyPrercent } = useSliverPercent(30);


  const economicData = useMemo(() => {
    if (!onDayData || !onDayData.Dates) {
      return null;
    }
    const sellPrice = Math.round(onDayData.LastSellPrices[onDayData.LastSellPrices.length - 1] / 1000);
    const buyPrice = Math.round(onDayData.LastBuyPrices[onDayData.LastBuyPrices.length - 1] / 1000);
    return {
      sellPrice,
      buyPrice,
      profit: sellPrice - buyPrice
    };
  }, [onDayData])

  return <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.viewType}>
      <TouchableOpacity style={[btnStyle(type, 'L')]} onPress={() => setType('L')}>
        <Text style={styles.btnTitle}>L</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[btnStyle(type, 'C')]} onPress={() => setType('C')}>
        <Text style={styles.btnTitle}>C</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[btnStyle(type, 'KG')]} onPress={() => setType('KG')}>
        <Text style={styles.btnTitle}>KG</Text>
      </TouchableOpacity>
    </View>
    <TabView
      navigationState={{ index, routes }}
      // Sử dụng renderTabBar để tùy chỉnh màu sắc thanh tab
      renderTabBar={props => (
        <TabBar
          {...props}
          activeColor="#FFFFFF"    // Màu chữ của Tab đang chọn
          inactiveColor="black"  // Màu chữ của Tab chưa chọn
          // 1. Thay đổi màu nền của toàn bộ thanh Tab Bar ở đây
          style={{ backgroundColor: '#6d74d4ff' }}
          // 2. (Tùy chọn) Thay đổi màu thanh indicator (thanh gạch chân bên dưới tab hiện tại)
          indicatorStyle={{ backgroundColor: 'white' }}
        />
      )}

      renderScene={
        ({ route }) => {
          switch (route.key) {
            case 'onday':
              return (<View key="1" style={styles.pageItemStyle}>
                {onDayData && <View style={styles.economicType}>
                  <Text style={[styles.economicTitlte, { color: 'red' }]}>Giá mua vào: {formatCurrency((economicData?.buyPrice || 0) * 1000, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)} </Text>
                  <Text style={[styles.economicTitlte, { color: 'green' }]}>Giá bán ra: {formatCurrency((economicData?.sellPrice || 0) * 1000, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)}</Text>
                  <Text style={styles.economicTitlte}>Chênh lệch: {formatCurrency((economicData?.profit || 0) * 1000 || 0, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)}</Text>
                </View>}
                {sliverPrercent &&
                  <Text style={percentTitleStyle(sliverPrercent)}>
                    {getStyleByRegex(sliverPrercent, 'fs-3') === '#008c72' ? '+' : '-'} {getContentByRegex(sliverPrercent, 'fs-3')}
                  </Text>
                }

                <SliverChart
                  chartData={onDayData}
                  chartTitle={`Biến động giá bạc trong ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
                />
              </View>);
            case 'sevendays':
              return <View key="2" style={styles.pageItemStyle}>
                {sliverSevenPrercent &&
                  <Text style={percentTitleStyle(sliverSevenPrercent)}>
                    {getStyleByRegex(sliverSevenPrercent, 'fs-3') === '#008c72' ? '+' : '-'} {getContentByRegex(sliverSevenPrercent, 'fs-3')}
                  </Text>
                }
                <SliverChart
                  chartData={sevenDayData}
                  chartTitle={`Biến động giá bạc trong 7 ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
                />
              </View>;
            case 'thirtydays':
              return (<View key="3" style={styles.pageItemStyle}>
                {sliverThirtyPrercent &&
                  <Text style={percentTitleStyle(sliverThirtyPrercent)}>
                    {getStyleByRegex(sliverThirtyPrercent, 'fs-3') === '#008c72' ? '+' : '-'} {getContentByRegex(sliverThirtyPrercent, 'fs-3')}
                  </Text>
                }
                <SliverChart
                  chartData={thirtyDayData}
                  chartTitle={`Biến động giá bạc trong 30 ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
                />
              </View>)
            default:
              return null;
          }
        }
      }
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  </SafeAreaView>
}

const styles = StyleSheet.create({
  viewType: {
    flexDirection: 'row',
    // flex: 1,
    // backgroundColor: 'red',
    gap: 4,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  economicType: {
    // flex: 1,
    // backgroundColor: 'red',
    gap: 4,
    paddingHorizontal: 10,
    // marginBottom: 20,
  },
  economicTitlte: {
    fontWeight: 'bold',
    fontSize: 18,
    // textAlign: 'center',
  },
  // Define button style as a function that returns an object
  btnTitle: {
    // color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  pagerView: {
    flex: 1,
    // backgroundColor: '#7ca6d6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageItemStyle: {
    // alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    // backgroundColor: '#37c232ff',
  },
});

const btnStyle = (type: string, activeType: string): StyleProp<ViewStyle> => ({
  backgroundColor: type === activeType ? '#8492e0ff' : 'white',
  borderWidth: 1,
  borderColor: '#4bbae6ff',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  flex: 1,
});

const percentTitleStyle = (htmlContent: string): StyleProp<TextStyle> => ({
  fontSize: 20,
  fontWeight: 'bold',
  paddingHorizontal: 10,
  paddingVertical: 5,
  width: '100%',
  textAlign: 'right',
  color: getStyleByRegex(htmlContent, 'fs-3'),

})

const getContentByRegex = (html: string, className: string) => {
  // Tạo pattern tìm kiếm thẻ div có class tương ứng
  const regex = new RegExp(`<span[^>]*class=["']${className}["'][^>]*>([\\s\\S]*?)<\/span>`, 'i');
  const match = html.match(regex);

  if (match && match[1]) {
    // Loại bỏ các thẻ HTML con bên trong nếu có để lấy text thuần
    return match[1].replace(/<[^>]*>/g, '').trim();
  }
  return "";
};

const getStyleByRegex = (html: string, className: string) => {
  // Regex tìm thẻ div có class chỉ định và trích xuất thuộc tính style bên trong thẻ đó
  const regex = new RegExp(`<span[^>]*class=["']${className}["'][^>]*style=["']([^"']*)["'][^>]*>`, 'i');
  const match = html.match(regex);

  // match[1] sẽ chứa nội dung nằm trong dấu nháy của style=""
  return match ? match[1].split(" ")[1] : "";
};

export default SliverChartScreen;

// https://giabac.vn/SilverInfo/FilterData lasy gia mua vao, ban ra
// https://giabac.vn/SilverInfo/GetPricePercentFromSQLPartial?days=7 lay bien dong tang giam

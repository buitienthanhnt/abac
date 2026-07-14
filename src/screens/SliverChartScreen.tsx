/* eslint-disable react-native/no-inline-styles */
import { useMemo, useState } from "react";
import SliverChart from "../components/SliverChart";
import { useSliverChartData, useSliverPercent } from "../hook/useSliverData";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { formatCurrency } from "../until/formatApexChartData";

const SliverChartScreen = () => {
  const [type, setType] = useState<'L' | 'C' | 'KG'>('L');

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

  return <View>
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

    {onDayData && <View style={styles.economicType}>
      <Text style={[styles.economicTitlte, { color: 'green' }]}>Giá bán ra: {formatCurrency((economicData?.sellPrice || 0) * 1000, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)}</Text>
      <Text style={[styles.economicTitlte, { color: 'red' }]}>Giá mua vào: {formatCurrency((economicData?.buyPrice || 0) * 1000, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)} </Text>
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
    {sliverSevenPrercent &&
      <Text style={percentTitleStyle(sliverSevenPrercent)}>
        {getStyleByRegex(sliverSevenPrercent, 'fs-3') === '#008c72' ? '+' : '-'} {getContentByRegex(sliverSevenPrercent, 'fs-3')}
      </Text>
    }
    <SliverChart
      chartData={sevenDayData}
      chartTitle={`Biến động giá bạc trong 7 ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
    />
    {sliverThirtyPrercent &&
      <Text style={percentTitleStyle(sliverThirtyPrercent)}>
        {getStyleByRegex(sliverThirtyPrercent, 'fs-3') === '#008c72' ? '+' : '-'} {getContentByRegex(sliverThirtyPrercent, 'fs-3')}
      </Text>
    }
    <SliverChart
      chartData={thirtyDayData}
      chartTitle={`Biến động giá bạc trong 30 ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
    />
  </View>
}

const styles = StyleSheet.create({
  viewType: {
    flexDirection: 'row',
    flex: 1,
    // backgroundColor: 'red',
    gap: 4,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  economicType: {
    flex: 1,
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

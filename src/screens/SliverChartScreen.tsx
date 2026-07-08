import { useMemo, useState } from "react";
import SliverChart from "../components/SliverChart";
import { useSliverChartData } from "../hook/useSliverData";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "../until/formatApexChartData";

const SliverChartScreen = () => {
  const [type, setType] = useState<'L' | 'C' | 'KG'>('L');

  const { data: sevenDayData, isLoading, isError, isFetching } = useSliverChartData(7, type);
  const { data: thirtyDayData, } = useSliverChartData(30, type);
  const { data: onDayData, } = useSliverChartData(1, type);

  const economicData = useMemo(() => {
    if (!onDayData) {
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
      <TouchableOpacity style={[styles.typeBtn, { backgroundColor: type === 'L' ? '#8492e0ff' : 'white' }]} onPress={() => setType('L')}>
        <Text style={styles.btnTitle}>L</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.typeBtn, { backgroundColor: type === 'C' ? '#995aebff' : 'white' }]} onPress={() => setType('C')}>
        <Text style={styles.btnTitle}>C</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.typeBtn, { backgroundColor: type === 'KG' ? '#7c4ee6ff' : 'white' }]} onPress={() => setType('KG')}>
        <Text style={styles.btnTitle}>KG</Text>
      </TouchableOpacity>
    </View>

    {onDayData && <View style={styles.economicType}>
      <Text style={[styles.economicTitlte, { color: 'red' }]}>Giá mua vào: {formatCurrency((economicData?.buyPrice || 0) * 1000, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)} </Text>
      <Text style={[styles.economicTitlte, { color: 'green' }]}>Giá bán ra: {formatCurrency((economicData?.sellPrice || 0) * 1000, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)}</Text>
      <Text style={styles.economicTitlte}>Chênh lệch: {formatCurrency((economicData?.profit || 0) * 1000 || 0, `vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'}`)}</Text>
    </View>}
    <SliverChart
      chartData={onDayData}
      chartTitle={`So sánh biến động giá bạc trong ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
    />
    <SliverChart
      chartData={sevenDayData}
      chartTitle={`So sánh biến động giá bạc trong 7 ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
    />
    <SliverChart
      chartData={thirtyDayData}
      chartTitle={`So sánh biến động giá bạc trong 30 ngày(nghìn vnđ/${type === 'L' ? 'Lượng' : type === 'C' ? 'Chỉ' : 'Kilogram'})`}
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
    marginBottom: 20,
  },
  economicTitlte: {
    fontWeight: 'bold',
    fontSize: 18,
    // textAlign: 'center',
  },
  typeBtn: {
    // backgroundColor: '#4bbae6ff',
    borderWidth: 1,
    borderColor: '#4bbae6ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnTitle: {
    // color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
export default SliverChartScreen;
import { Alert, FlatList, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import useLode from "../hook/useLode";
import React, { useMemo, useState } from "react";
import * as htmlparser2 from 'htmlparser2';
// import render from 'dom-serializer'; // Đi kèm với htmlparser2 để chuyển ngược dom thành string
import * as domutils from "domutils";
// @ts-ignore
import * as _ from 'lodash';
import { TabBar, TabView } from "react-native-tab-view";
import LodeChart from "../components/LodeChart";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

const routes = [
  { key: 'reduce', title: 'Thống kê' },
  { key: 'dashboard', title: 'Đề xuất nhóm' },
  { key: 'allRandom', title: 'Gộp đề xuất' },
];

const onCopy = (items: ItemLode[]) => {
  const value = items.map(item => item.key < 10 ? `0${item.key}` : item.key.toString()).join(' ');
  Clipboard.setString(value);
  Alert.alert('Copied', value);
}

interface ItemLode {
  key: number;
  count: number;
}

const LodeScreen = () => {
  const [refresh, setRefresh] = useState(0);
  const [index, setIndex] = React.useState(0);
  const layout = useWindowDimensions();
  const { data: htmlString, } = useLode();

  const parseHtmlValue = useMemo(() => {
    if (!htmlString) {
      return [];
    }
    // Bước 1: Phá vỡ chuỗi HTML thành cấu trúc cây DOM
    const dom = htmlparser2.parseDocument(htmlString);

    // Bước 2: Tìm các node bằng tên class mong muốn
    const alertNodes = domutils.getElementsByClassName("div-statistic", dom);

    // In ra nội dung text của các node tìm được
    let dbItems: string[] = [];
    alertNodes.forEach(node => {
      const listDb = domutils.getElementsByClassName("color-reb", node);
      listDb.forEach(item => {
        if (!isNaN(domutils.textContent(item) as unknown as number)) {
          dbItems.push(domutils.textContent(item));
        }

      })
      // console.log(domutils.textContent(node)); // "Cảnh báo 1", "Cảnh báo 2"
    });
    const groupDb: { [key: string]: number } = _.countBy(dbItems, (item: string) => item);
    /**
     * ép kiểu sang số
     */
    const listKeys = Object.keys(groupDb).map(item => parseInt(item));
    const number_99 = Array.from({ length: 100 }, (_a, index) => index);
    const missing = _.difference(number_99, listKeys);
    const formatGroup: ItemLode[] = [];
    for (let index = 0; index < missing.length; index++) {
      formatGroup.push({
        key: parseInt(missing[index]),
        count: 0
      })
    }
    for (const [key, value] of Object.entries(groupDb)) {
      formatGroup.push({
        key: parseInt(key),
        count: value as number
      })
    }
    return _.sortBy(formatGroup, 'count');
  }, [htmlString]);

  const dbData = useMemo(() => {
    if (!parseHtmlValue.length) {
      return;
    }
    const r = refresh;
    const sortedData = parseHtmlValue;
    const min365 = sortedData.slice(0, 30);
    const populator365 = sortedData.slice(30, 70);
    const max365 = sortedData.slice(70, 100);

    const randomMin = _.sortBy(_.sampleSize(min365, 20), 'key');
    const randomPopulator = _.sortBy(_.sampleSize(populator365, 30), 'key');
    const randomMax = _.sortBy(_.sampleSize(max365, 20), 'key');
    const allRandom = _.sortBy([...randomMin, ...randomPopulator, ...randomMax], 'key');
    return {
      randomMin,
      randomPopulator,
      randomMax,
      allRandom,
      allReduce: sortedData,
    };
  }, [parseHtmlValue, refresh])

  return (
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
            case 'dashboard':
              return (<View style={{ padding: 4, gap: 10, }}>
                {dbData?.randomMin && <GroupView items={dbData.randomMin} type="min" title={'Nhóm xuất hiện ít:'} />}
                {dbData?.randomPopulator && <GroupView items={dbData.randomPopulator} type="populator" title={'Nhóm xuất hiện trung bình:'} />}
                {dbData?.randomMax && <GroupView items={dbData.randomMax} type="max" title={'Nhóm xuất hiện nhiều:'} />}
                <TouchableOpacity onLongPress={() => setRefresh(r => r + 1)} style={{ padding: 10, paddingHorizontal: 20, alignItems: 'center', backgroundColor: '#adb1dfff', borderRadius: 8 }}>
                  <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
              </View>);
            case 'allRandom':
              return (
                <View style={{ padding: 4, gap: 10, }}>
                  {dbData?.allRandom && <AllRandom items={dbData.allRandom} type="all" />}
                </View>
              )
            case 'reduce':
              if (!dbData?.allReduce) {
                return null;
              }
              return (
                <ReduceAll items={dbData?.allReduce} />
              );
            default:
              return null;
          }
        }
      }
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  )
}

const GroupView = ({ items, type, title }: { items: { key: number, count: number }[], type?: 'min' | 'populator' | 'max' | 'all', title?: string }) => {

  return (
    <>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
        <TouchableOpacity onLongPress={() => onCopy(items)}>
          <Ionicons name="copy" size={32} color="#2f2f3dff" />
        </TouchableOpacity>
      </View>
      <ListItem items={items} type={type} />
    </>
  )
}

const ListItem = ({ items, type }: { items: { key: number, count: number }[], type?: 'min' | 'populator' | 'max' | 'all' }) => {

  if (!items.length) {
    return null;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.key.toString()}
      numColumns={10} // <--- Thượng phương bảo kiếm: Tự chia làm 10 cột
      columnWrapperStyle={{ gap: 4 }} // Style cho từng hàng dữ liệu
      contentContainerStyle={{ gap: 4 }}
      renderItem={({ item }) => (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
          borderRadius: 8,
          backgroundColor: type === 'all' ? 'gray' : type === 'min' ? '#eba434' : type === 'populator' ? '#9f33bd' : 'rgba(60, 173, 22, 1)'
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.key >= 10 ? item.key : `0${item.key}`}</Text>
        </View>
      )}
    />
  )
}

const AllRandom = ({ items, type }: { items: ItemLode[], type?: 'min' | 'populator' | 'max' | 'all' }) => {

  const formatData = useMemo(() => {
    const groupData: { [key: number]: ItemLode[] } = {};
    items.forEach(item => {
      const advan = Math.floor(item.key / 10);
      if (groupData[advan]) {
        groupData[advan].push(item);
      } else {
        groupData[advan] = [item];
      }
    });
    return groupData;
  }, [items])

  if (!items.length) {
    return null;
  }

  return (
    <View style={{ gap: 4 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        <TouchableOpacity onLongPress={() => onCopy(items)}>
          <Ionicons name="copy" size={32} color="#2f2f3dff" />
        </TouchableOpacity>
      </View>
      {Object.keys(formatData).map((key, index) => {
        return (
          <ListItem key={index} items={formatData[key as unknown as number]} type={type} />)
      })}
    </View>
  )

}

const ReduceAll = ({ items }: { items: ItemLode[] }) => {

  const formatData = useMemo(() => {
    const chartSeria: {
      name: string;
      data: { x: string; y: number }[];
      group: string;
    }[] = [];
    const sortedData = _.sortBy(items, 'key');

    const chunkData = _.chunk(sortedData, 10);
    for (const [index, chunk] of chunkData.entries()) {
      const data = chunk.map((item) => ({
        x: item.key.toString(),
        y: item.count,
      }));
      chartSeria.push({ name: index.toString(), data, group: "apexcharts-axis-0" });
    }
    return chartSeria;
  }, [items])

  if (!items) {
    return null;
  }

  return (
    <View style={{ gap: 4, flex: 1 }}>
      <LodeChart chartData={formatData} chartTitle="Tần suất xuất hiện của các con số trong 365 ngày gần nhất" />
    </View>
  )
}
export default LodeScreen;
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import StockItem from "../components/stock/StockItem";
import { getDatabase, ref, get } from '@react-native-firebase/database';
import { BlockType } from "../types/Block";
//list icons:  https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';

const StockScreen: FunctionComponent<any> = () => {
  const [blockList, setBlockList] = useState<BlockType[]>([]);
  const { width, height } = useWindowDimensions();
  const [screen, setScreen] = useState(null);
  const [forcus, setForcus] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const initBlockList = useCallback(() => {
    const db = getDatabase();
    get(ref(db, '/blockList')).then(snapshot => {
      setBlockList(snapshot.val());
    });
  }, [])

  const initScreen = useCallback(() => {
    const db = getDatabase();
    get(ref(db, '/screen')).then(snapshot => {
      setScreen(snapshot.val());
    });
  }, [])

  const searchResult = useMemo(() => {
    if (search?.length < 3 || blockList.length === 0) {
      return [];
    }

    const result = blockList.filter(block =>
      block.items?.some(item => item.item_model.toLowerCase().includes(search?.toLowerCase()))
    );
    return result.map(block => {
      return block.key;
    });
  }, [search, blockList])

  const forcusBlock = blockList.length ? blockList.find(item => item.key === forcus) : null;

  useEffect(() => {
    initBlockList();
    initScreen();
  }, [initBlockList, initScreen])

  useEffect(() => {
    // Khóa màn hình ngang khi mở ứng dụng/màn hình này
    Orientation.lockToLandscapeRight();

    // Lắng nghe sự kiện nếu người dùng xoay thiết bị (khi không khóa)
    const onOrientationChange = (orientation) => {
      console.log("Hướng màn hình hiện tại:", orientation);
    };
    Orientation.addOrientationListener(onOrientationChange);

    return () => {
      // Hủy lắng nghe và mở khóa khi rời màn hình
      Orientation.removeOrientationListener(onOrientationChange);
      Orientation.unlockAllOrientations();
    };
  }, []);

  if (blockList.length === 0) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{
        width: width,
        height: height,
        backgroundColor: '#302d2dff',
      }}>
        {forcusBlock && <View style={{
          position: 'absolute',
          display: 'flex',
          top: 10,
          left: 10,
          zIndex: 999,
        }}>
          <TouchableOpacity onPress={() => setForcus('')} style={{
            // alignItems: 'flex-end',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 6,
          }}>
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#9a39c7ff',
            }}>Vị trí đang chọn: {forcusBlock.name}</Text>
            <Ionicons name="close-circle" size={24} color="white" />
          </TouchableOpacity>
          {forcusBlock.items?.map((item, index) => {
            return <View key={index}
              style={{
                marginBottom: 2,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 4,
                paddingHorizontal: 4,
                paddingVertical: 2,
                display: 'flex',
                flexDirection: 'row',
                gap: 5,
                alignItems: 'baseline'
              }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16,
              }}>{item.item_model}</Text>
              {item.item_desc && <Text style={{ color: '#17d641ff', fontSize: 12, fontWeight: 'semibold' }} >{`(${item.item_desc})`}</Text>}
            </View>
          })}
        </View>
        }
        {blockList.length > 0 && blockList.map((item, index) => {
          return <StockItem
            key={index}
            block={item}
            onFocus={setForcus}
            initScreen={screen}
            selected={search.length < 3 ? 0 : searchResult.includes(item.key) ? 1 : 2} />
        })}
        <View style={{
          position: 'absolute',
          bottom: 40,
          right: 30,
          width: 170,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}>
          {(search.length > 2) && <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={24} color="white" />
          </TouchableOpacity>
          }
          <TextInput
            value={search}
            onChangeText={(value) => setSearch(value)}
            placeholder="tìm kiếm"
            placeholderTextColor={'white'}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              color: '#fff',
              fontWeight: 'semibold',
              fontSize: 16,
              width: 132,
              borderColor: '#fff',
            }}
          >
          </TextInput>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default StockScreen;
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
// import { blockList, screen } from '../data/stockData';
import StockItem from "../components/stock/StockItem";
import { getDatabase, ref, get } from '@react-native-firebase/database';
import { BlockType } from "../types/Block";

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
      block.items.some(item => item.item_model.toLowerCase().includes(search?.toLowerCase()))
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
          top: 20,
          left: 10,
          zIndex: 999,
        }}>
          <TouchableOpacity onPress={() => setForcus('')} title="Xóa" style={{
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#fff',
            width: '100%'
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'red',
              flex: 1,
            }}>Xóa</Text>
          </TouchableOpacity>
          {forcusBlock.items.map((item, index) => {
            return <Text key={index} style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
            }}>{item.item_model}</Text>
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
          top: 20,
          right: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}>
          {(search.length > 2) && <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'red',
            }}>Xóa</Text>
          </TouchableOpacity>
          }
          <TextInput value={search} onChangeText={(value) => setSearch(value)} style={{
            borderWidth: 1,
            borderRadius: 8,
            color: '#fff',
            fontWeight: 'semibold',
            fontSize: 16,
            width: 126,
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
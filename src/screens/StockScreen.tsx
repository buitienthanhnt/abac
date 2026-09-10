import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import StockItem from "../components/stock/StockItem";
import { getDatabase, ref, get, set } from '@react-native-firebase/database';
import { BlockType, ItemType } from "../types/Block";
//list icons:  https://oblador.github.io/react-native-vector-icons/    Tìm: Ionicons
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';
import ItemForm from "../components/stock/ItemForm";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { DATABASE_ENUM } from '../enum/database';
import { useNavigation } from "@react-navigation/native";
import {
  GestureDetector,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import TextRecognition from 'react-native-text-recognition';
import { launchImageLibrary } from "react-native-image-picker";

// const appUrl = 'https://play.google.com/store/apps/details?id=com.abac';
const storage = createAsyncStorage(DATABASE_ENUM.LOCAL_STORAGE);
const db = getDatabase();
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const StockScreen: FunctionComponent<any> = () => {
  const navigation = useNavigation();
  const [blockList, setBlockList] = useState<BlockType[]>([]);
  const { width, height } = useWindowDimensions();
  const [screen, setScreen] = useState(null);
  const [forcus, setForcus] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isShowBtn, setIsShowBtn] = useState<boolean>(false);

  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

  const gesture = usePanGesture({
    onBegin: () => {
      isPressed.value = true;
    },
    onUpdate: (e) => {
      offset.value = {
        x: offset.value.x + e.changeX,
        y: offset.value.y + e.changeY,
      };
    },
    onFinalize: () => {
      isPressed.value = false;
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
    };
  }, []);

  const checkLogin = useCallback(async () => {
    const _isLogin = await storage.getItem('isLogin');
    setIsLogin(_isLogin === 'true');
  }, [])

  const initBlockList = useCallback(() => {
    get(ref(db, '/blockList')).then(snapshot => {
      setBlockList(snapshot.val());
    });
  }, [])

  const onAddItem = useCallback((block: BlockType, data: any) => {
    const index = blockList.findIndex(item => item?.key === block.key);
    const newItem = {
      block_id: block.id,
      item_model: data.model,
      item_type: 'text',
      item_desc: data.item_desc
    };
    set(ref(db, '/blockList/' + index + '/items'), [
      ...(block?.items || []), newItem
    ]).then(() => {
      initBlockList();
    });

  }, [blockList, initBlockList]);

  const onSelectImage = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    });
    if (result?.assets) {
      const textResult = await TextRecognition.recognize(result.assets[0].uri || '');
      setSearch(textResult.filter(text => !text.includes(' ') && text.length > 2 && !text.includes('.') && !text.includes('ô') && !text.includes('á') && !text.includes('ê') && !text.includes('đ') && !text.includes(',')).join(' '));
    }
  }, [])

  const initScreen = useCallback(() => {

    get(ref(db, '/screen')).then(snapshot => {
      setScreen(snapshot.val());
    });
  }, [])

  const searchResult = useMemo(() => {
    if (search?.length < 3 || blockList.length === 0) {
      return [];
    }

    const searchArr = search.split(' ');
    const result = blockList.filter(block =>
      block?.items?.some(item => !!item && searchArr.filter((word) => word.length > 2).some(search => item.item_model.toLowerCase().includes(search?.toLowerCase()) || search?.toLowerCase().includes(item.item_model.toLowerCase())))
    );
    return result.map(block => {
      return block.key;
    });
  }, [search, blockList])

  const forcusBlock = blockList.length ? blockList.find(item => item?.key === forcus) : null;

  useEffect(() => {
    checkLogin();
    initBlockList();
    initScreen();
  }, [checkLogin, initBlockList, initScreen])

  useLayoutEffect(() => {
    // Tìm Stack cha (chính là Tab Navigator) và ẩn style đi
    if (!navigation) {
      return;
    }
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    // Khi rời khỏi màn hình này, hiển thị lại Tab bar bằng cách khôi phục 'flex'
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'flex' }
    });
  }, [navigation]);

  useEffect(() => {
    // return;
    // Khóa màn hình ngang khi mở ứng dụng/màn hình này
    Orientation.lockToLandscapeRight();

    // Lắng nghe sự kiện nếu người dùng xoay thiết bị (khi không khóa)
    const onOrientationChange = (orientation: any) => {
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
    return (
      <View style={styles.nonContainer} />
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ width: width, height: height, backgroundColor: '#413b4dff', }}>
        {forcusBlock && <View style={styles.animatedBtn}>
          <TouchableOpacity onPress={() => setForcus('')} style={styles.clearForcus}>
            <Text style={styles.blockFocusTitle}>Vị trí đang chọn: {forcusBlock.name}</Text>
            <Ionicons name="close-circle" size={24} color="white" />
          </TouchableOpacity>
          {sortValueTop(forcusBlock?.items || [], search)?.map((item, index) => {
            if (!item) {
              return null;
            }
            return <View key={index}
              style={styles.itemContainer}>
              <Text style={styles.itemModel}>{item.item_model}</Text>
              {item.item_desc && <Text style={styles.itemDesc} >{`(${item.item_desc})`}</Text>}
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
            isFocus={forcus === item?.key}
            selected={search.length < 3 ? 0 : searchResult.includes(item?.key) ? 1 : 2} />
        })}
        <Animated.View style={[styles.funContainer, animatedStyles]} >
          {isShowBtn && <AnimatedTouchableOpacity
            entering={FadeIn.duration(600)}
            exiting={FadeOut.duration(300)}
            onPress={() => navigation.goBack()}
            style={styles.animatedTouchable}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </AnimatedTouchableOpacity>}
          {isShowBtn && <AnimatedTouchableOpacity
            onPress={onSelectImage}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(600)}
            style={styles.animatedTouchable}>
            <Ionicons name="images" size={24} color="white" />
          </AnimatedTouchableOpacity>}
          <TextInput
            value={search}
            onChangeText={(value) => setSearch(value)}
            placeholder="tìm kiếm"
            placeholderTextColor={'white'}
            style={styles.textSearch}
          />
          {(search.length > 2) && <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={24} color="white" />
          </TouchableOpacity>
          }
          <GestureDetector gesture={gesture}>
            <TouchableOpacity style={styles.fingerBtn} onPress={() => {
              setIsShowBtn(!isShowBtn)
            }}>
              <Ionicons name="finger-print-sharp" size={24} color="white" />
            </TouchableOpacity>
          </GestureDetector>
        </Animated.View>
        {forcusBlock && isLogin && <View style={styles.blockForm}>
          <ItemForm block={forcusBlock} onAddItem={onAddItem} />
        </View>}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default StockScreen;

const sortValueTop = (items: ItemType[], keyword: string) => {

  return [...(items || [])].sort((a, b) => {
    const cleanA = a.item_model.toLowerCase();
    const cleanB = b.item_model.toLowerCase();
    const keys: string[] = keyword.toLowerCase().split(' ').filter(key => key.length > 2);

    // Kiểm tra xem chuỗi có bắt đầu bằng từ khóa hay không (true/false)
    const startsA = keys.some(key => cleanA.includes(key));
    const startsB = keys.some(key => cleanB.includes(key));

    if (startsA && !startsB) return -1; // a lên đầu
    if (!startsA && startsB) return 1;  // b lên đầu

    // Nếu cả hai cùng bắt đầu hoặc cùng không bắt đầu, xếp theo bảng chữ cái mặc định
    return cleanA.localeCompare(cleanB);
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedBtn: {
    position: 'absolute',
    display: 'flex',
    top: 10,
    left: 10,
    zIndex: 999,
  },
  animatedTouchable: {
    borderWidth: 1,
    borderRadius: '100%',
    borderColor: 'white',
    padding: 4,
  },
  textSearch: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#fff',
    color: '#fff',
    fontWeight: 'semibold',
    fontSize: 14,
    width: 132,
  },
  blockForm: {
    position: 'absolute', top: 10, right: 60
  },
  fingerBtn: {
    borderWidth: 1,
    borderRadius: '100%',
    borderColor: 'white',
    padding: 4,
  },
  blockFocusTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9a39c7ff',
  },
  itemModel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  itemContainer: {
    marginBottom: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'baseline',
  },
  funContainer: {
    position: 'absolute',
    bottom: 40,
    right: 80,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearForcus: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
  },
  itemDesc: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  nonContainer: {
    flex: 1,
    backgroundColor: '#5a5454ff'
  },
});
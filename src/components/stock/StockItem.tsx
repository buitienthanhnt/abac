import { TouchableOpacity, useWindowDimensions, } from 'react-native';
import { BlockType, } from '../../types/Block';
import { useCallback } from 'react';

type Props = {
  block: BlockType;
  selected: 0 | 1 | 2;
  isFocus: boolean;
  onFocus: (key: string) => void;
  initScreen: { width: number, height: number } | null;

}
const StockItem = ({ block, selected, onFocus, initScreen, isFocus = false }: Props) => {
  const { width, height } = useWindowDimensions();

  const handleFocus = useCallback(() => {
    if (block.type === 'area') {
      return;
    }
    onFocus(block.key)
  }, [])

  if (!initScreen || !block) {
    return null;
  }

  const xScale = width / initScreen.width;
  const yScale = height / initScreen.height;

  return (
    <TouchableOpacity style={{
      position: 'absolute',
      left: block.x * xScale,
      top: block.y * yScale,
      width: block.width * xScale,
      height: block.height * yScale,
      backgroundColor: isFocus ? '#fff' : block.type === 'block' ? (selected === 1 ? '#76d5a9' : selected === 2 ? '#b6a5b5ff' : block?.style?.color) : undefined,
      // borderWidth: block.type === 'area' ? 1 : 0,
    }}
      onLongPress={handleFocus}
    >
    </TouchableOpacity>
  )
}

export default StockItem;
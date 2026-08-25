import { FunctionComponent, useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BlockType } from "../../types/Block";

interface Props {
  block: BlockType;
  onAddItem: (block: BlockType, data?: any) => void,
}

const ItemForm: FunctionComponent<Props> = ({ block, onAddItem }) => {
  const [model, setModel] = useState<string>('');
  const [item_desc, setItemDesc] = useState<string>('');

  /**
   * add item to block
   */
  const addItem = useCallback(() => {
    onAddItem(block, {
      model: model,
      item_desc: item_desc
    });
  }, [block, onAddItem, model, item_desc])

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="model"
        placeholderTextColor={'white'}
        style={styles.textInputStyle}
        value={model}
        onChangeText={(value) => setModel(value)}
      />
      <TextInput
        placeholder="mô tả"
        placeholderTextColor={'white'}
        style={styles.textInputStyle}
        value={item_desc}
        onChangeText={(value) => setItemDesc(value)}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={addItem}>
        <Text style={styles.title}>Thêm</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ItemForm;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#4bbae6ff',
    padding: 4,
    gap: 4
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'white',
    padding: 8,
    fontSize: 16,
    fontWeight: 'semibold',
    width: 150,
    color: 'white',
  },
  submitBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#9658e9ff',
    alignItems: 'center',
  },
});
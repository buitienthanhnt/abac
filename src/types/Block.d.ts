export interface ItemType {
  id: number,
  block_id: number,
  item_model: string,
  item_type: text,
  item_desc?: string,
}

export interface BlockType {
  id: number;
  name: string;
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: {
    color: string;
    zIndex: number;
  };
  type: 'block' | 'area';
  items: ItemType[] | null;
};
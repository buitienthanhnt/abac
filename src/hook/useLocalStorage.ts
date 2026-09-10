import React, { useCallback } from "react";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { DATABASE_ENUM } from "../enum/database";

const storage = createAsyncStorage(DATABASE_ENUM.LOCAL_STORAGE);

const useLocalStorage = (key: string, isJson: boolean) => {
  const [value, setValue] = React.useState<string | null | Record<string, unknown>[]>(null);

  /**
   * Lấy dữ liệu từ local storage
   */
  const getData = useCallback(async () => {
    const result = await storage.getItem(key);
    if (isJson && result) {
      setValue(JSON.parse(result));
    } else {
      setValue(result);
    }
  }, [key, isJson]);

  /**
   * Lưu dữ liệu vào local storage
   */
  const saveData = useCallback(async (newValue: string | Record<string, unknown>[]) => {
    if (isJson) {
      await storage.setItem(key, JSON.stringify(newValue));
    } else {
      await storage.setItem(key, newValue as string);
    }
  }, [isJson, key])

  /**
   * khởi tạo dữ liệu từ local storage
   * Lấy dữ liệu từ local storage khi component được mở ra
   */
  React.useEffect(() => {
    getData();
  }, [getData]);

  return [value, saveData, getData] as const;
}

export default useLocalStorage;
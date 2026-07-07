import axios from "axios"
import { giabac } from "../network/url";

export const fetchSliverChartData = async (days: number, type = 'L') => {
  try {
    const response = await axios.get(`${giabac}/SilverInfo/GetGoldPriceChartFromSQLData`, {
      params: {
        type: type,
        days: days,
      }
    });
    // console.log('===>', response);
    return response.data;
  } catch (error) {
    console.error(error);
  }

}
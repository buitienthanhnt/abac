import axios from "axios";

const getLodeData = async (dates = 365) => {
  try {
    const response = await axios.get(`https://xosodaiphat.com/XSDPThongKeAjax/AjaxTKGiaiDB`, {
      params: {
        rollingNo: dates,
        lotteryId: 0,
      }
    });
    // console.log('===>', response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getLodeData }
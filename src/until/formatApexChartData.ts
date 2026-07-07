export const formatApexChartData = (data: { Type: string, Dates: string[], LastBuyPrices: number[], LastSellPrices: number[] }) => {
  const { Type, Dates, LastBuyPrices, LastSellPrices } = data;
  // let
  // return Dates.map((date, index) => [new Date(date + 'z').getTime(), LastBuyPrices[index]/1000]);
  const sellData = Dates.map((date, index) => [new Date(date).getTime(), LastSellPrices[index] / 1000]);
  const buyData = Dates.map((date, index) => [new Date(date).getTime(), LastBuyPrices[index] / 1000]);

  return [
    {
      name: 'Giá Bán ra',
      data: sellData
    },
    {
      name: 'Giá Mua vào',
      data: buyData
    },
  ];
}
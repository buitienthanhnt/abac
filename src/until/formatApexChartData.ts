export const formatApexChartData = (data: { Type: string, Dates: string[], LastBuyPrices: number[], LastSellPrices: number[] }) => {
  const { Type, Dates, LastBuyPrices, LastSellPrices } = data;
  if (!Dates) {
    return [
      {
        name: 'Giá Bán ra',
        data: []
      },
      {
        name: 'Giá Mua vào',
        data: []
      },
    ];
  }
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

export const formatCurrency = (price: number, currency?: string): string => {
  const giaTri = Math.abs(price);
  const ty = Math.floor(giaTri / 1000000000);
  let sodu = giaTri - ty * 1000000000;
  const trieu = Math.floor(sodu / 1000000);
  sodu = sodu - trieu * 1000000;
  const nghin = Math.floor(sodu / 1000);
  sodu = sodu - nghin * 1000;
  // return (ty ? ty + ' tỷ ' : '') + (trieu ? trieu + ' triệu ' : '') + (nghin ? nghin + ' nghìn' : '') + (sodu || '') + 'vnđ' ;
  return `${ty ? ty + ' tỷ ' : ''}${trieu ? trieu + ' triệu ' : ''}${nghin ? nghin + ' nghìn ' : ''
    }${sodu ? sodu + ' ' : ''}${currency || ' vnđ'}`;
}
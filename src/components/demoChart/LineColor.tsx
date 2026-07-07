import { LineChartBicolor } from "react-native-gifted-charts";

// https://gifted-charts.web.app/linechart/#differentWaysToMultiColor
const LineColor = () => {
  const data = [
    { value: 15, label: 'Mon' },
    { value: 30, label: 'Tue' },
    { value: -23, label: 'Wed' },
    { value: 40, label: 'Thu' },
    { value: -16, label: 'Fri' },
    { value: 40, label: 'Sat' },
  ];

  return (
    <LineChartBicolor
      data={data}
      areaChart
      color="green"
      colorNegative="red"
      startFillColor="green"
      startFillColorNegative="red"
    />
  )
}

export default LineColor;
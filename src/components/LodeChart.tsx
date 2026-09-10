import React, { useRef, } from 'react';
import { StyleSheet, View, } from 'react-native';
import { WebView } from 'react-native-webview';

const getApexChartHtml = (chartOptions: any, title = '') => {

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- Tải ApexCharts qua CDN -->
   <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  </head>
  <body style="margin: 0px; padding: 0px;">
    <div id="chart" style="margin: 0px; padding: 0px;"></div>
    <script>

    var options = {
          series: ${JSON.stringify(chartOptions)},
          chart: {
            type: 'heatmap', // Chuyển thành dạng bản đồ nhiệt
            height: 420,
            width:  '100%',
            toolbar: { tools: {
            pan: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            download: false,
            } } // Ẩn thanh công cụ để giao diện gọn hơn trên mobile
          },
          plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 4,
          useFillColorAsStroke: false,
          colorScale: {
            // Continuous gradient legend replaces the default categorical legend.
            // The arrow tracks the hovered cell's value along the spectrum and
            // automatically reorients based on legend.position.
            gradientLegend: {
              enabled: true,
              width: '80%',
              thickness: 14,
              showHoverValue: true,
            },
          },
        },
      },
          colors: ['#090E3E'], // Màu sắc riêng biệt cho từng đường
          stroke: {
            width: 1, // Độ dày của đường vẽ
            curve: 'smooth' // Làm mượt đường nối giữa các điểm (hoặc dùng 'straight')
          },
          legend: {
            position: 'right',
          },
          dataLabels: {
            enabled: false
          },
          title: {
            text: '${title}',
            align: 'left'
          },
          tooltip: {
            enabled: true,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              return '<div className="arrow_box">' +
                '<span style="font-weight: bold; font-size: 14px; padding: 8px">' + seriesIndex + '' + dataPointIndex + ': ' + series[seriesIndex][dataPointIndex] + '</span>' +
              '</div>'
            }
          },
        }

    var chart = new window.ApexCharts(document.querySelector('#chart'), options)
    chart.render()
  </script>
  </body>
</html>
`
};

export default function LodeChart({ chartData, chartTitle }: { chartData: any, chartTitle: string }) {
  const webViewRef = useRef(null);

  if (!chartData) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Khu vực chứa Biểu đồ */}
      <View style={styles.chartContainer}>
        {chartData && <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: getApexChartHtml(chartData, chartTitle) }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        // 1. Bơm toàn bộ mã nguồn file apexcharts.min.js vào WebView trước
        // injectedJavaScriptBeforeContentLoaded={`${apexChartsSource}; void(0);`}
        // 2. Chạy đoạn script vẽ biểu đồ sau khi cấu trúc trang hoàn tất
        // injectedJavaScript={chartConfigScript}
        // onMessage={(event) => { }} // 👈 Bắt buộc phải có dòng này để kích hoạt injection
        />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  minPriceContent: {
    fontWeight: 'bold',
    fontSize: 18,
    // color: 'red'
  },
  maxPriceContent: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'green',
  },
  chartContainer: {
    height: 480, // Định hình chiều cao cố định cho vùng chứa biểu đồ
    // backgroundColor: '#41c228ff',
  },
  button: {
    // backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

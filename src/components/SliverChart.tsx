import React, { useRef, } from 'react';
import { StyleSheet, View, } from 'react-native';
import { WebView } from 'react-native-webview';
import { formatApexChartData } from '../until/formatApexChartData';

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
  <body style="margin: 0px; padding: 0px">
    <div id="chart"></div>
    <script>

    var options = {
          chart: {
            type: 'area', // Chuyển thành dạng đường thay vì area đổ màu
            height: 420,
            width:  '100%',
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true, // Trục Y tự động chỉnh tỷ lệ khớp với cả 2 đường khi zoom
              zoomedArea: {
                fill: {
                  color: '#90CAF9',
                  opacity: 0.4
                }
              }
            },
            toolbar: { tools: {
            pan: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            download: false,
            } } // Ẩn thanh công cụ để giao diện gọn hơn trên mobile
          },
          series: ${JSON.stringify(chartOptions)},
          colors: ['#69cc4e', '#FF4560'], // Màu sắc riêng biệt cho từng đường
          stroke: {
            width: 2, // Độ dày của đường vẽ
            curve: 'smooth' // Làm mượt đường nối giữa các điểm (hoặc dùng 'straight')
          },
          dataLabels: {
            enabled: false
          },
          title: {
            text: '${title}',
            align: 'left'
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 1,
              stops: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000],
            },
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // Đổ màu nền xen kẽ cho các hàng lưới
              opacity: 0.5
            },
          },
          xaxis: {
            type: 'datetime', // Bắt buộc để sử dụng tính năng Timeseries
          },
          tooltip: {
            shared: true, // Hiển thị thông số của cả 2 đường cùng lúc khi hover vào một mốc thời gian
            intersect: false,
            x: {
              format: 'dd/MM HH:mm'
            },
            y: {
              formatter: function (value) {
                var giaTri = Math.abs(value *1000);
                var ty = Math.floor(giaTri / 1000000000);
                var sodu = giaTri - ty * 1000000000;
                var trieu = Math.floor(sodu / 1000000);
                sodu = sodu - trieu * 1000000;
                var nghin = Math.floor(sodu / 1000);
                sodu = sodu - nghin * 1000;
                return (ty ? ty + ' tỷ ' : '') + (trieu ? trieu + ' triệu ' : '') + (nghin ? nghin + ' nghìn' : '') + (sodu || '') + ' vnđ' ;
              }
            }
          },
          legend: {
            position: 'bottom', // Hiển thị bảng chú thích ở phía trên biểu đồ
            horizontalAlign: 'right'
          }
        }

    var chart = new window.ApexCharts(document.querySelector('#chart'), options)
    chart.render()
  </script>
  </body>
</html>
`
};

export default function SliverChart({ chartData, chartTitle }: { chartData: any, chartTitle: string }) {

  const webViewRef = useRef(null);

  // Hàm tạo dữ liệu ngẫu nhiên để test tính năng cập nhật động
  const updateChartData = () => {
    const newData = Array.from({ length: 9 }, () => Math.floor(Math.random() * 100) + 20);

    const message = {
      type: 'UPDATE_DATA',
      data: [{ name: 'Doanh thu', data: newData }]
    };

    // Gửi dữ liệu vào trong WebView bằng injectJavaScript
    if (webViewRef.current) {
      const jsCode = `window.postMessage(JSON.stringify(${JSON.stringify(message)}), '*'); true;`;
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  if (!chartData || chartData.Dates === undefined || chartData.Dates.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Khu vực chứa Biểu đồ */}
      <View style={styles.chartContainer}>
        {chartData && <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: getApexChartHtml(formatApexChartData(chartData), chartTitle) }}
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
  chartContainer: {
    height: 480, // Định hình chiều cao cố định cho vùng chứa biểu đồ
  },
  button: {
    backgroundColor: '#007AFF',
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

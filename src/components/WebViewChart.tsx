import WebView from "react-native-webview"

export const WebViewChart = () => {
  return (
    <WebView
      originWhitelist={['*']}
      style={{ marginTop: 20, backgroundColor: 'red', height: 300 }}
      source={{ html: '<h1>Hello world 123</h1>' }}
    />
  )
}
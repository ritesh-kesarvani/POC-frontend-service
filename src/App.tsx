import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routing from "./routing/Routing";
import { ConfigProvider } from "antd";

function App() {  
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Gilroy-Regular",
            colorPrimary: "#718ceb",
            colorPrimaryHover: "#4e70ed",
            // colorBorder: "#718ceb",
          },
        }}
      >
        <Routing />
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;

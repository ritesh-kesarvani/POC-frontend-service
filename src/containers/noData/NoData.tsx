import { Typography } from "antd";
import "./NoData.css"; // Your custom CSS file
const { Title } = Typography;

const NoData = () => {
  return (
    <div className="center-screen-ant">
      <Title className="animated-text-ant">
        No Data Available {" "}
      </Title>
    </div>
  );
};

export default NoData;

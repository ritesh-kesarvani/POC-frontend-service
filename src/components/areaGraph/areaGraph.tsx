import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from "recharts";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import { useEffect, useState } from "react";

const AreaGraphChart = () => {
  const [areaGraphData, setAreaGraphData] = useState([
    { name: "05-01", employees: 10 },
  ]);

  function FetchAreaGraphData() {
    coreService
      .get("dashboard/insights" + "?callFrom=agph")
      .then((res: any) => {
        setAreaGraphData(res?.data);
      })
      .catch((err: any) => {
        toastrService.error(err?.response?.data?.error);
      });
  }
  useEffect(() => {
    FetchAreaGraphData();
  }, []);

  return (
    <AreaChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={areaGraphData}
      // margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="employees"
        stroke="#8884d8"
        fillOpacity={1}
        fill="url(#colorUv)"
        isAnimationActive={true}
      />
      <Area
        type="monotone"
        dataKey="hours_a_day"
        stroke="#82ca9d"
        fillOpacity={1}
        fill="url(#colorPv)"
        isAnimationActive={true}
      />
    </AreaChart>
  );
};

export default AreaGraphChart;

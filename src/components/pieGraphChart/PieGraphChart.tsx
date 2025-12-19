import { FunnelChart, Funnel, LabelList, Tooltip } from "recharts";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import { useEffect, useState } from "react";

const PieGraphChart = () => {
  const [piGraphData, setPieGraphData] = useState([
    { name: "05-01", employees: 10 },
  ]);

  function FetchAreaGraphData() {
    const colours = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];
    coreService
      .get("dashboard/insights" + "?callFrom=pgch")
      .then((res: any) => {
        const rangeData = res?.data.map((item: any, index: number) => ({
          key: index,
          name: item.name,
          value: item.value,
          fill: colours[index],
        }));
        setPieGraphData(rangeData);
      })
      .catch((err: any) => {
        toastrService.error(err?.response?.data?.error);
      });
  }
  useEffect(() => {
    FetchAreaGraphData();
  }, []);

  return (
    <FunnelChart
      style={{ width: "100%", maxWidth: "700px", aspectRatio: 1.618 }}
      responsive
      margin={{
        right: 30,
      }}
    >
      <Tooltip />
      <Funnel dataKey="value" data={piGraphData} isAnimationActive={true}>
        <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
      </Funnel>
    </FunnelChart>
  );
};

export default PieGraphChart;

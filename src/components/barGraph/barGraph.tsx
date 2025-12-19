import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import { useEffect, useState } from "react";

const BarGraphChart = () => {
  const [employeeProjectData, setEmployeeProjectData] = useState([
    { name: "05-01", employees: 10 },
  ]);

  function FetchBarGraphdata() {
    coreService
      .get("dashboard/insights" + "?callFrom=bgph")
      .then((res: any) => {
        var resp = res?.data;
        setEmployeeProjectData(resp);
      })
      .catch((err: any) => {
        toastrService.error(err?.response?.data?.error);
      });
  }
  useEffect(() => {
    FetchBarGraphdata();
  }, []);
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={employeeProjectData}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Bar dataKey="employees" fill="#8884d8" isAnimationActive={true} />
    </BarChart>
  );
};

export default BarGraphChart;

import React, { useEffect, useRef, useState } from "react";
import "./Insights.css";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import ApiLoader from "../../components/apiLoader/ApiLoader";
import { Tooltip } from "antd";
import BarGraphChart from "../../components/barGraph/barGraph";
import AreaGraphChart from "../../components/areaGraph/areaGraph";
import PieGraphChart from "../../components/pieGraphChart/PieGraphChart";
import NoData from "../noData/NoData";

function Insights() {
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [insightsTableData, setInsightsTableData] = useState<any>({});
  const [projectGraphVer, setProjectGraphVer] = useState([]);
  const [projectGraphHor, setProjectGraphHor] = useState([]);

  useEffect(() => {
    getAllTablesData();
  }, []);

  useEffect(() => {
    if (performanceChartRef && performanceChartRef.current) {
      const ctxPerformance = performanceChartRef.current.getContext("2d");
      if (ctxPerformance) {
        var performanceChart = new Chart(ctxPerformance, {
          type: "bar",
          plugins: [ChartDataLabels],
          data: {
            labels: projectGraphVer,
            datasets: [
              {
                label: "Billable Hours per project",
                data: projectGraphHor,
                barThickness: 30,
                backgroundColor: "#118AB2",
                borderRadius: 4,
                order: 1,
              },
            ],
          },
          options: {
            plugins: {
              datalabels: {
                anchor: "start",
                align: "top",
                offset: 0,
                formatter: (value, context) => {
                  if (context.dataset.type === "line") {
                    return "";
                  } else {
                    return value;
                  }
                },
                color: "#ffffff",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";

                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  },
                },
              },
              legend: {
                display: true,
                labels: {
                  usePointStyle: true,
                  pointStyle: "circle",
                  boxWidth: 7,
                  boxHeight: 7,
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                ticks: {
                  callback: function (value) {
                    return value;
                  },
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (performanceChart) {
        performanceChart.destroy();
      }
    };
  }, [projectGraphVer]);

  function getAllTablesData() {
    setLoading(true);
    coreService
      .get("dashboard/insights" + "?callFrom=d")
      .then((res: any) => {
        setInsightsTableData(res?.data);
        setProjectGraphVer(res?.data?.graph?.ver);
        setProjectGraphHor(res?.data?.graph?.hor);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  }

  return (
    <>
      {insightsTableData?.emp_count && insightsTableData.projects_tt ? (
        <div className="my-2 my-lg-3">
          <div className="row p-0">
            <Tooltip
              placement="bottom"
              title="This is the value of the Employee we have in the organisations."
            >
              <div className="col bg-white border-r-24 mx-10px mt-3 mt-lg-0">
                <div className="d-flex data-card">
                  <img
                    src="/assets/images/employee-svgrepo-com.svg"
                    alt="median-increase"
                  />
                  <div>
                    <h4 className="m-0 font-weight-bold">
                      {insightsTableData.emp_count}
                    </h4>
                    <span className="font-weight-normal black-60 font-size-18">
                      Total Employee
                    </span>
                  </div>
                </div>
              </div>
            </Tooltip>

            <Tooltip
              placement="bottom"
              title="This is the count of Billable Employess in the organisation."
            >
              <div className="col bg-white border-r-24 mx-10px mt-3 mt-lg-0">
                <div className="d-flex data-card">
                  <img
                    src="/assets/images/insights-card-icon2.svg"
                    alt="Budgeted-Increase"
                  />
                  <div>
                    <h4 className="m-0 font-weight-bold">
                      {insightsTableData?.allocation?.b}
                    </h4>
                    <span className="font-weight-normal black-60 font-size-18">
                      Billable Employees
                    </span>
                  </div>
                </div>
              </div>
            </Tooltip>
            <Tooltip
              placement="bottom"
              title="This is the total Billable Hours spends on a project by employees"
            >
              <div className="col bg-white border-r-24 mx-10px mt-3 mt-lg-0">
                <div className="d-flex data-card">
                  <img
                    src="/assets/images/insights-card-icon3.svg"
                    alt="Requested-Increase"
                  />
                  <div>
                    <h4 className="m-0 font-weight-bold">
                      {insightsTableData?.total_billable_hours}
                    </h4>
                    <span className="font-weight-normal black-60 font-size-18">
                      Total Billabe Hours
                    </span>
                  </div>
                </div>
              </div>
            </Tooltip>
            <Tooltip
              placement="bottom"
              title="This is the value of the Employee we have in the organisations."
            >
              <div className="col bg-white border-r-24 mx-10px mt-3 mt-lg-0">
                <div className="d-flex data-card">
                  <img
                    src="/assets/images/cooperate-svgrepo-com.svg"
                    alt="median-increase"
                  />
                  <div>
                    <h4 className="m-0 font-weight-bold">
                      {insightsTableData.projects_tt}
                    </h4>
                    <span className="font-weight-normal black-60 font-size-18">
                      Total Projects
                    </span>
                  </div>
                </div>
              </div>
            </Tooltip>
          </div>
          <div className="mt-3">
            <div className="d-lg-flex overflow-hidden text-center gap-16">
              <div className="col pe-0 mt-3 mt-lg-0">
                <div className="country-data-card ">
                  <div className="data-head">
                    <p className="m-0">Employees per Grades</p>
                  </div>
                  <div className="insight-analysis-table table-responsive">
                    <PieGraphChart />
                  </div>
                </div>
              </div>
              <div className="col pe-0 mt-3 mt-lg-0">
                <div className="country-data-card">
                  <div className="data-head">
                    <p className="p-3">Employees Per Projects</p>
                  </div>
                  <div>
                    <BarGraphChart />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 d-lg-flex overflow-hidden text-center gap-16">
              <div className="col pe-0 mt-3 mt-lg-0">
                <div className="country-data-card">
                  <div className="data-head">
                    <p className="m-0">Performance Analysis</p>
                  </div>
                  <div className="insight-analysis-table table-responsive">
                    <AreaGraphChart />
                  </div>
                </div>
              </div>
              <div className="col mt-3 mt-lg-0">
                <div className="country-data-card">
                  <div className="data-head">
                    <p className="p-3">Billable Hours per Projects</p>
                  </div>
                  <div>
                    <canvas ref={performanceChartRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoData />
      )}

      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default Insights;

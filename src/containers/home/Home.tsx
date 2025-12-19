import EmployeeTable from "../../components/employeeTable/EmployeeTable";
import "./Home.css";
import { useState } from "react";
import { useEffect } from "react";
import * as coreService from "../../services/coreService";
import ApiLoader from "../../components/apiLoader/ApiLoader";
import * as toastrService from "../../services/toastrService";

function Home() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any | null>([]);

  function getEmployees() {
    let baseURl = "employee/list";
    const apiUrl = `${baseURl}`;
    setLoading(true);
    coreService
      .get(apiUrl)
      .then((res: any) => {
        setEmployees(res?.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  }
  function removeEmployee(id?: any) {
      setLoading(true);
      coreService
        .remove("employee/" + id)
        .then((res: any) => {
          setLoading(false);
          toastrService.success(res.data.message);
          getEmployees()
        })
        .catch((err) => {
          setLoading(false);
          toastrService.error(err?.response?.data?.error);
        });
    }

  useEffect(() => {
    getEmployees();
  }, []);

  function updateTableData(){
    getEmployees()
  }
  return (
    <>
      <div className="table-top d-flex justify-content-between">
        <h1 className="m-0">All Employees</h1>
        <div className="budget">
        </div>
      </div>
      <EmployeeTable
        employData={employees}
        updateTableData={updateTableData}
        removeEmp={removeEmployee}
      />

      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default Home;

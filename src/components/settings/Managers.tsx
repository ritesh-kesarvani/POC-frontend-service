import ManagerTable from "../managerTable/ManagerTable";
import { useEffect, useState } from "react";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import ApiLoader from "../apiLoader/ApiLoader";
import { AddManager } from "../../containers/addManagers/AddManager";

function Managers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [managerData, setManagerData] = useState<any[]>([]);

  useEffect(() => {
    getManagerData();
  }, []);

  function getManagerData() {
    setLoading(true);
    coreService
      .get("manager/reporting-managers")
      .then((res) => {
        setLoading(false);
        setManagerData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  }

  function removeManager(email?: any) {
    setLoading(true);
    coreService
      .remove("manager/" + email)
      .then((res: any) => {
        setLoading(false);
        toastrService.success(res.data.message);
        getManagerData();
      })
      .catch((err) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  }
  function showModal() {
    setShowForm(!showForm);
    getManagerData();
  }
  return (
    <>
      <div className="managers">
        <button className="btn btn-primary" onClick={() => {setShowForm(!showForm)}}>
          Add Manager
        </button>
      </div>

      {showForm && <AddManager modalVisible={showModal} />}

      <ManagerTable
        managerData={managerData}
        onRemove={(email: string) => removeManager([email])}
      />

      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default Managers;

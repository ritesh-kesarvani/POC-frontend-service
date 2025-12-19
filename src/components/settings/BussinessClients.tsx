import { useEffect, useState } from "react";
import ApiLoader from "../apiLoader/ApiLoader";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import BussinessClientsTable from "../bussinessGroupTable/BussinessClientsTable";
import { AddBussinessClients } from "../../containers/addBussinessClients/AddBussinessClients";

function BussinessClients() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [bussinessGroupData, setBussinessGroupData] = useState<any[]>([]);

  useEffect(() => {
    getBussinessGroupData();
  }, []);
  function getBussinessGroupData() {
    setLoading(true);
    coreService
      .get("bussiness/cusomters")
      .then((res) => {
        setLoading(false);
        setBussinessGroupData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  }

  function removeBussiness(id?: any) {
    setLoading(true);
    coreService
      .remove("bussiness/" + id)
      .then((res: any) => {
        setLoading(false);
        toastrService.success(res.data.message);
        getBussinessGroupData();
      })
      .catch((err) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  }
  function showModal() {
    setShowForm(!showForm);
    getBussinessGroupData();
  }
  return (
    <>
      <div className="managers">
        <button className="btn btn-primary" onClick={() => {setShowForm(!showForm)}}>
          Add Bussiness Clients
        </button>
      </div>

      {showForm && <AddBussinessClients modalVisible={showModal} />}

      <BussinessClientsTable
        customersData={bussinessGroupData}
        onRemove={(id: string) => removeBussiness([id])}
      />

      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default BussinessClients;

import { useState, useEffect } from "react";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import "./AddProject.css";
import ApiLoader from "../../components/apiLoader/ApiLoader";
import { Select, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";

interface ChildProps {
  modalVisible: () => void; // Type the setter function
}

type Customer = {
  id: number;
  customer_code: string;
  customer_name: string;
};
type bussinessGroup = {
  id: number;
  name: string;
};

export const AddProject: React.FC<ChildProps> = ({ modalVisible }) => {
  const getBussinessGroupsOptions = () => {
    coreService
      .get("bussiness/groups")
      .then((res) => {
        setBussinessGroups(res.data);
      })
      .catch((err) => {
        toastrService.error(err?.response?.data?.error);
      });
  };

  useEffect(() => {
    getBussinessGroupsOptions();
  }, []);

  const statusOptions = [
    { id: 1, status: "Initial", value: "1" },
    { id: 2, status: "OnGoing", value: "2" },
    { id: 3, status: "Completed", value: "3" },
    { id: 4, status: "Escalate", value: "4" },
  ];
  const currencyOptions = [
    { id: 1, status: "INR" },
    { id: 2, status: "USD" },
    { id: 3, status: "AUD" },
    { id: 4, status: "EUR" },
    { id: 5, status: "JPY" },
    { id: 6, status: "CNY" },
    { id: 7, status: "CAD" },
    { id: 8, status: "ZAR" },
  ];

  const workingOptions = [
    { id: 1, hd: 1 },
    { id: 2, hd: 2 },
    { id: 3, hd: 3 },
    { id: 4, hd: 4 },
    { id: 5, hd: 5 },
    { id: 6, hd: 6 },
    { id: 7, hd: 7 },
    { id: 8, hd: 8 },
    { id: 9, hd: 9 },
    { id: 10, hd: 10 },
    { id: 11, hd: 11 },
    { id: 12, hd: 12 },
  ];
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [bussinessGroups, setBussinessGroups] = useState<bussinessGroup[]>([]);

  const onAddingGroup = (id: any) => {
    coreService
      .get("bussiness/cusomters/" + id)
      .then((res) => {
        setCustomerOptions(res.data);
      })
      .catch((err) => {
        toastrService.error(err?.response?.data?.error);
      });
  };

  const onSelectingCustomer = (value: any) => {
    const cm = customerOptions.find((c) => c.id === value);
    setSelectedCustomer(cm);
  };
  const [loading, setLoading] = useState<boolean>(false);

  const { control, register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: "",
      bussines_group: "",
      hd: "",
      customer_id: "",
      customer_name: "",
      status: "",
      currency: 0,
    },
  });

  const { errors } = formState;

  type Project = {
    name: any;
    bussines_group: any;
    hd: any;
    customer_id: any;
    customer_name: any;
    status: any;
    currency: any;
  };
  const onSubmit = (data: Project) => {
    setLoading(true);
    const postData = {
      name: data.name,
      bussines_group: data.bussines_group,
      hd: data.hd,
      customer_id: selectedCustomer?.id,
      status: data.status,
      currency: data.currency,
    };

    coreService
      .post("projects/add-project", postData)
      .then((res) => {
        reset();
        toastrService.success("Project added successfully!");
        setLoading(false);
        onModalClose();
      })
      .catch((err) => {
        setLoading(false);
        onModalClose();
        toastrService.error(err?.response?.data?.error);
      });
  };

  function onModalClose() {
    modalVisible();
  }
  return (
    <Modal
      centered
      footer={null}
      open={true}
      onCancel={onModalClose}
      className="import-modal"
      maskClosable={false}
    >
      <div className="page-head d-flex align-items-center gap-2 justify-content-center">
        <h3>Add Project</h3>
      </div>
      <div className="d-flex align-items-center manager-container">
        <div className="w-100 bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 col-md">
                <div className="relative py-1">
                  <label htmlFor="name">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    className="w-100 p-2 mt-1 mb-2 border form-control"
                    placeholder="Name of the project"
                  />
                  {errors.name && (
                    <span className="required-error">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-12 col-md">
                <div className="relative py-1">
                  <label htmlFor="bussines_group">
                    Bussiness Group <span className="required">*</span>
                  </label>
                  <Controller
                    name="bussines_group"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || "Select Bussiness Group"}
                        id="bussines_group"
                        className="w-100 mt-1 mb-2"
                        size="large"
                        placeholder="Select Bussiness group"
                        defaultValue=""
                        onSelect={(value) => onAddingGroup(value)}
                      >
                        {bussinessGroups.map((option) => (
                          <Select.Option key={option.id} value={option.id}>
                            {option.name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md">
                <div className="relative py-1">
                  <label htmlFor="designation">Hours a day</label>
                  <Controller
                    name="hd"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || "Select hours a day"}
                        id="hd"
                        className="w-100 mt-1 mb-2"
                        size="large"
                        placeholder="Select hd"
                        defaultValue=""
                      >
                        {workingOptions.map((option) => (
                          <Select.Option key={option.id} value={option.hd}>
                            {option.hd}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="col-6 col-md">
                <div className="relative py-1">
                  <label htmlFor="status">
                    Currency <span className="required">*</span>
                  </label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="currency"
                        value={field.value || "Select Currency"}
                        className="w-100 mt-1 mb-2"
                        size="large"
                        placeholder="Select Project Currency"
                        defaultValue={1}
                      >
                        {currencyOptions.map((option) => (
                          <Select.Option key={option.id} value={option.status}>
                            {option.status}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                    rules={{ required: "Currency is required" }}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md">
                <div className="relative py-1">
                  <label htmlFor="customer_id">
                    Customer ID <span className="required">*</span>
                  </label>
                  <input
                    readOnly={true}
                    type="text"
                    className="w-100 p-2 mt-1 mb-2 border form-control"
                    placeholder="Customer Id"
                    value={selectedCustomer?.customer_code}
                  />
                </div>
              </div>
              <div className="col-12 col-md">
                <div className="relative py-1">
                  <label htmlFor="customer_name">
                    Customer Name <span className="required">*</span>
                  </label>
                  <Controller
                    name="customer_name"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={
                          selectedCustomer?.customer_name || "Select Customer"
                        }
                        id="customer_name"
                        className="w-100 mt-1 mb-2"
                        size="large"
                        placeholder="Enter Customer Name"
                        defaultValue=""
                        onChange={onSelectingCustomer}
                        // onSelect={onSelectingCustomer}
                      >
                        {customerOptions.map((option: any, key) => (
                          <Select.Option key={key} value={option.id}>
                            {option.customer_name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md">
                <div className="relative py-1">
                  <label htmlFor="status">
                    Status <span className="required">*</span>
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="status"
                        value={field.value || "Select status"}
                        className="w-100 mt-1 mb-2"
                        size="large"
                        placeholder="Select status"
                      >
                        {statusOptions.map((option) => (
                          <Select.Option key={option.id} value={option.value}>
                            {option.status}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                    rules={{ required: "status is required" }}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-start mt-2">
              <button className="btn-primary add-employee-button" type="submit">
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading ? <ApiLoader /> : ""}
    </Modal>
  );
};

export default AddProject;

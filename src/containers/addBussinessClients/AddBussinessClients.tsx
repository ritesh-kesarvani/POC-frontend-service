import { useEffect, useState } from "react";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import "./AddBussinessClients.css";
import ApiLoader from "../../components/apiLoader/ApiLoader";
import { Modal, Select, Radio, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ChildProps {
  modalVisible: () => void; // Type the setter function
}
type BussinessGOption = {
  id: number;
  name: string;
};

export const AddBussinessClients: React.FC<ChildProps> = ({ modalVisible }) => {
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [newBussiness, setNewBussiness] = useState<boolean>(true);
  const navigate = useNavigate();
  const { control, register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: "",
      customer_code: "",
      customer_name: "",
    },
  });

  const { errors } = formState;
  const [bgOptions, setBGOptions] = useState<BussinessGOption[]>([]);

  type Project = {
    name: any;
    customer_name: any;
    customer_code: any;
  };
  const onSubmit = (data: Project) => {
    setLoading(true);

    const postData = {
      name: data.name,
      is_new_group: false,
      customer_name: data.customer_name,
      customer_code: data.customer_code,
    };
    if (newBussiness) {
      postData.is_new_group = true;
    }

    coreService
      .post("bussiness/add-client", postData)
      .then((res) => {
        reset();
        toastrService.success("Customer added successfully!");
        setLoading(false);
        modalVisible();
        navigate("/settings?tab=3");
      })
      .catch((err) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  };
  function onModalClose() {
    setOpenModal(false);
    modalVisible();
  }
  useEffect(() => {
    getBussinessGroupsOptions();
  }, []);

  const getBussinessGroupsOptions = () => {
    coreService
      .get("bussiness/groups")
      .then((res) => {
        setBGOptions(res.data);
      })
      .catch((err) => {
        toastrService.error(err?.response?.data?.error);
      });
  };

  const onChange = () => {
    setNewBussiness(!newBussiness);
  };

  return (
    <Modal
      centered
      footer={null}
      open={openModal}
      onCancel={onModalClose}
      className="import-modal"
      maskClosable={false}
    >
      <div className="">
        <div className="page-head d-flex align-items-center gap-2">
          <h3 className="m-0">Add Bussiness Groups</h3>
        </div>
        <div className="d-flex align-items-center manager-container">
          <div className="w-100 bg-white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="name">
                      Bussiness Client New? <span className="required">*</span>
                    </label>
                    <Radio.Group
                      name="radiogroup"
                      defaultValue={1}
                      // className="w-100 mt-1 mb-2"
                      // size="large"
                      buttonStyle="solid"
                      optionType="button"
                      // className="w-100 p-2 mt-1 mb-2 border form-control"
                      className="p-2"
                      onChange={onChange}
                      options={[
                        { value: 1, label: "Yes" },
                        { value: 2, label: "No" },
                      ]}
                    />
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="name">
                      Name <span className="required">*</span>
                    </label>
                    {newBussiness ? (
                      <>
                        <input
                          type="text"
                          {...register("name", {
                            required: "Bussiness Group is required",
                          })}
                          className="w-100 p-2 mt-1 mb-2 border form-control"
                          placeholder="Enter Bussiness Group"
                        />
                        {errors.name && (
                          <span className="required-error">
                            {errors.name.message}
                          </span>
                        )}
                      </>
                    ) : (
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            style={{ width: "100%" }}
                            id="name"
                            defaultValue=""
                            value={field.value || "Select Bussiness"}
                            className="w-100 mt-1 mb-2"
                            size="large"
                            placeholder="Select Bussiness"
                          >
                            {bgOptions.map((option, i) => (
                              <Select.Option key={option.id} value={option.id}>
                                {option.name}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                        rules={{ required: "Bussiness group is required" }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="customer_code">
                      Customer ID <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("customer_code", {
                        required: "Customer ID is required",
                      })}
                      className="w-100 p-2 mt-1 mb-2 border form-control"
                      placeholder="Enter Customer Id"
                    />
                    {errors.customer_code && (
                      <span className="required-error">
                        {errors.customer_code.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="customer_name">
                      Customer Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("customer_name", {
                        required: "Customer Name is required",
                      })}
                      className="w-100 p-2 mt-1 mb-2 border form-control"
                      placeholder="Enter Customer Name"
                    />
                    {errors.customer_name && (
                      <span className="required-error">
                        {errors.customer_name.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-start mt-2">
                <button
                  className="btn-primary add-employee-button"
                  type="submit"
                >
                  Add Bussiness Client
                </button>
              </div>
            </form>
          </div>
        </div>
        {loading ? <ApiLoader /> : ""}
      </div>
    </Modal>
  );
};

// export default AddManager;

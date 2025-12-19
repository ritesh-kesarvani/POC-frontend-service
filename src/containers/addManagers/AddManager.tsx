import { useState } from "react";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import "./AddManager.css";
import ApiLoader from "../../components/apiLoader/ApiLoader";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ChildProps {
  modalVisible: () => void; // Type the setter function
}

export const AddManager: React.FC<ChildProps> = ({ modalVisible }) => {
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { control, register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { errors } = formState;

  type Project = {
    name: any;
    email: any;
  };
  const onSubmit = (data: Project) => {
    setLoading(true);

    const postData = {
      name: data.name,
      email: data.email,
    };

    coreService
      .post("manager/add-manager", postData)
      .then((res) => {
        reset();
        toastrService.success("Manager added successfully!");
        setLoading(false);
        modalVisible();
        navigate("/settings?tab=2");
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
          <h3 className="m-0">Add Manager</h3>
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
                      placeholder="Name of the Manager"
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
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("email", {
                        required: "Email is required",
                      })}
                      className="w-100 p-2 mt-1 mb-2 border form-control"
                      placeholder="Enter Manager email"
                    />
                    {errors.email && (
                      <span className="required-error">
                        {errors.email.message}
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
                  Add Manager
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

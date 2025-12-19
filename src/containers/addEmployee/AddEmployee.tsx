import { useEffect, useState } from "react";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import "./AddEmployee.css";
import ApiLoader from "../../components/apiLoader/ApiLoader";
import { Select, DatePicker, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

type ReportingToOption = {
  email: any;
  id: number;
  name: string;
};
type ProjectsOption = {
  id: number;
  name: string;
};
interface ChildProps {
  modalVisible: () => void; // Type the setter function
}

export const AddEmployee: React.FC<ChildProps> = ({ modalVisible }) => {
  const compentencyOptions = [
    { id: 1, full_name: "Python", value: "Python" },
    { id: 2, full_name: "React JS", value: "ReactJS" },
    { id: 3, full_name: "Python+Reactjs", value: "python+reactjs" },
  ];

  const gradeOptions = [
    { id: 1, grade: "E1", value: "e1" },
    { id: 2, grade: "E2", value: "e2" },
    { id: 3, grade: "E3", value: "e3" },
    { id: 4, grade: "T", value: "t" },
  ];
  const percentOptions = [
    { id: 1, percent: 10 },
    { id: 2, percent: 20 },
    { id: 3, percent: 30 },
    { id: 4, percent: 40 },
    { id: 5, percent: 50 },
    { id: 6, percent: 60 },
    { id: 7, percent: 70 },
    { id: 8, percent: 80 },
    { id: 9, percent: 90 },
    { id: 10, percent: 100 },
  ];

  const allocationOptions = [
    { id: 1, name: "Billable", value: "B" },
    { id: 2, name: "Non - Billable", value: "NB" },
    { id: 3, name: "Partial Billable", value: "PB" },
    { id: 4, name: "Pool", value: "P" },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [reportingToOptions, setReportingToOptions] = useState<
    ReportingToOption[]
  >([]);
  const [projectsOptions, setProjectsOptions] = useState<ProjectsOption[]>([]);
  const navigate = useNavigate();
  const { control, register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      emp_org_id: 0,
      first_name: "",
      last_name: "",
      work_email: "",
      compentency: "",
      reporting_to: 0,
      grade: "",
      project_id: "",
      doj: "",
      allocation_type: "",
      allocation_percent: "",
      designation: "",
    },
  });

  const { errors } = formState;

  type Employee = {
    emp_org_id: any;
    first_name: any;
    last_name: any;
    work_email: any;
    compentency: any;
    reporting_to: any;
    grade: any;
    project_id: any;
    doj: any;
    allocation_type: any;
    allocation_percent: any;
    designation: any;
  };
  const onSubmit = (data: Employee) => {
    setLoading(true);

    const postData = {
      emp_org_id: data.emp_org_id,
      first_name: data.first_name,
      last_name: data.last_name,
      work_email: data.work_email,
      compentency: data.compentency,
      reporting_to: data.reporting_to,
      grade: data.grade,
      project_id: data.project_id,
      doj: data.doj.format("YYYY-MM-DD"),
      allocation_type: data.allocation_type,
      allocation_percent: data.allocation_percent,
      designation: data.designation,
    };

    coreService
      .post("employee/add-employee", postData)
      .then((res) => {
        setLoading(false);
        reset();
        toastrService.success("Employee added successfully!");
        onModalClose();
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  };

  function onModalClose() {
    modalVisible()
  }

  const getReportingToOptions = () => {
    coreService
      .get("manager/reporting-managers")
      .then((res) => {
        setReportingToOptions(res.data);
      })
      .catch((err) => {
        toastrService.error(err?.response?.data?.error);
      });
  };
  const getProjectsOptions = () => {
    coreService
      .get("projects/available-list")
      .then((res) => {
        setProjectsOptions(res.data);
      })
      .catch((err) => {
        toastrService.error(err?.response?.data?.error);
      });
  };

  useEffect(() => {
    getReportingToOptions();
    getProjectsOptions();
  }, []);
  return (
    <Modal
      centered
      footer={null}
      open={true}
      onCancel={onModalClose}
      className="import-modal"
      maskClosable={false}
    >
      <div className="">
        <div className="page-head d-flex align-items-center gap-2">
          <h3 className="m-0">Add Employee</h3>
        </div>
        <div className="d-flex align-items-center manager-container">
          <div className="w-100 bg-white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="first_name">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("first_name", {
                        required: "First Name is required",
                      })}
                      className="w-100 p-2 mt-1 mb-2 border form-control"
                      placeholder="First Name"
                    />
                    {errors.first_name && (
                      <span className="required-error">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="last_name">
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("last_name", {
                        required: "Last Name is required",
                      })}
                      className="w-100 p-2 mt-1 mb-2 border form-control"
                      placeholder="Last Name"
                    />
                    {errors.last_name && (
                      <span className="required-error">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="emp_org_id">
                      Employee Org ID <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("emp_org_id", {
                        required: "Employee org Id is required",
                      })}
                      className="w-100 p-2 mt-1 mb-2 border form-control"
                      placeholder="Org Id"
                    />
                    {errors.emp_org_id && (
                      <span className="required-error">
                        {errors.emp_org_id.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="designation">Job Title</label>
                    <Controller
                      name="designation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value || "Select designation"}
                          id="designation"
                          className="w-100 mt-1 mb-2"
                          size="large"
                          placeholder="Select designation"
                          defaultValue=""
                        >
                          <Select.Option id="1" value="ISE">
                            Intern Software Engineer
                          </Select.Option>
                          <Select.Option id="2" value="SE">
                            Software Engineer
                          </Select.Option>
                          <Select.Option id="3" value="SSE">
                            Senior Software Engineer
                          </Select.Option>
                          <Select.Option id="4" value="FSE">
                            Full Stack Engineer
                          </Select.Option>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("work_email", {
                        required: "Email is required",
                      })}
                      className="w-100 p-2 mt-1 mb-2 border form-control"
                      placeholder="Enter your email"
                    />
                    {errors.work_email && (
                      <span className="required-error">
                        {errors.work_email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="grade">
                      Grade <span className="required">*</span>
                    </label>
                    <Controller
                      name="grade"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="grade"
                          value={field.value || "Select Grade"}
                          className="w-100 mt-1 mb-2"
                          size="large"
                          placeholder="Select Grade"
                        >
                          {gradeOptions.map((option) => (
                            <Select.Option key={option.id} value={option.grade}>
                              {option.grade}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      rules={{ required: "Grade is required" }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="compentency">
                      Competency <span className="required">*</span>
                    </label>
                    <Controller
                      name="compentency"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value || "Select Competency"}
                          id="compentency"
                          className="w-100 mt-1 mb-2"
                          size="large"
                          placeholder="Select compentency"
                        >
                          {compentencyOptions.map((option) => (
                            <Select.Option
                              key={option.id}
                              value={option.full_name}
                            >
                              {option.full_name}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      rules={{ required: "Compentency is required" }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="reporting_to">
                      Reporting to <span className="required">*</span>
                    </label>
                    <Controller
                      name="reporting_to"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="reporting_to"
                          value={field.value || "Select Reporting to"}
                          className="w-100 mt-1 mb-2"
                          size="large"
                          placeholder="Select reporting to"
                        >
                          {reportingToOptions.map((option, i) => (
                            <Select.Option key={option.id} value={option.id}>
                              {option.name}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      rules={{ required: "Reporting To is required" }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="doj">
                      Date of Joining <span className="required">*</span>
                    </label>
                    <Controller
                      name="doj"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          id="doj"
                          className="w-100 mt-1 mb-2"
                          size="large"
                          format="YYYY-MM-DD"
                          placeholder="Select date"
                        />
                      )}
                      rules={{ required: "Joining date is required" }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="project">
                      Project Name <span className="required">*</span>
                    </label>
                    <Controller
                      name="project_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="project"
                          value={field.value || "Select project"}
                          className="w-100 mt-1 mb-2"
                          size="large"
                          placeholder="Select project"
                        >
                          {projectsOptions.map((option, i) => (
                            <Select.Option key={option.id} value={option.id}>
                              {option.name}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      rules={{ required: "Project is required" }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="allocation_type">
                      Allocation Type <span className="required">*</span>
                    </label>
                    <Controller
                      name="allocation_type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="allocation_type"
                          className="w-100 mt-1 mb-2"
                          size="large"
                          value={field.value || "Select Allocation Type"}
                          placeholder="Select Allocation Type"
                        >
                          {allocationOptions.map((option) => (
                            <Select.Option key={option.id} value={option.value}>
                              {option.name}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      rules={{ required: "Allocation type is required" }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="relative py-1">
                    <label htmlFor="allocation_percent">
                      Allocation Percentage <span className="required">*</span>
                    </label>
                    <Controller
                      name="allocation_percent"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="allocation_percent"
                          className="w-100 mt-1 mb-2"
                          size="large"
                          value={field.value || "Select Allocation Percentage"}
                          placeholder="Select Allocation Percent"
                        >
                          {percentOptions.map((option) => (
                            <Select.Option
                              key={option.id}
                              value={option.percent}
                            >
                              {option.percent}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      rules={{ required: "Allocation type is required" }}
                    />

                    {errors.allocation_percent && (
                      <span className="required-error">
                        {errors.allocation_percent.message}
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
        {loading ? <ApiLoader /> : ""}
      </div>
    </Modal>
  );
}

export default AddEmployee;

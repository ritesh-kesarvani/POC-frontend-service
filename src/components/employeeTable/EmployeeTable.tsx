import { Checkbox, DatePicker, Empty, Select } from "antd";
import "./EmployeeTable.css";
// import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import dayjs from "dayjs";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import AddEmployee from "../../containers/addEmployee/AddEmployee";
import ImportAndExport from "../settings/ImportAndExport";

interface DataTableProps {
  employData: any[];
  updateTableData: () => void;
  removeEmp: (data: any) => void;
}
type CheckboxValueType = string | number;

function EmployeeTable({
  employData,
  updateTableData,
  removeEmp,
}: DataTableProps) {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageData, setCurrentPageData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<{
    columnKey: string | null;
    sortOrder: "asc" | "desc";
  }>({
    columnKey: null,
    sortOrder: "asc",
  });
  const [reportingManagerData, setReportingManagerData] = useState<any[]>([]);
  const [datePickerVisibility, setDatePickerVisibility] = useState<any>({});
  const [atBottom, setAtBottom] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);

  const customScrollRef = useRef(null);
  const tableRef = useRef(null);

  const checkAll: boolean =
    currentPageData.length === checkedList.length &&
    currentPageData.length !== 0;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < currentPageData.length;

  let perPageCount: number = 10;
  let totalPages: number = Math.ceil(employData.length / perPageCount);
  let visiblePageCount: number = 3;

  let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
  let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
  let visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => i + startPage
  );
  let visibleLastPage: number = endPage;
  const containsValue: boolean = !!checkedList.length;

  useEffect(() => {
    reportingManagers();
  }, []);

  useEffect(() => {
    let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
    let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
    visibleLastPage = endPage;
    // Create an array of visible pages.
    visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => i + startPage
    );
    let tempData = [...employData];
    let startIndex = (currentPage - 1) * perPageCount;
    tempData = tempData.slice(startIndex, startIndex + perPageCount);
    setCurrentPageData(tempData);
  }, [currentPage, employData]);

  useEffect(() => {
    const customScrollBar: any = customScrollRef.current;
    const table: any = tableRef.current;
    if (customScrollBar) {
      const innerChild = customScrollBar.firstChild;
      setTimeout(() => {
        innerChild.style.width = table.scrollWidth + "px";
      }, 1000);
    }

    const handleScroll = () => {
      if (customScrollBar) {
        customScrollBar.firstChild.style.width = table.scrollWidth + "px";
      }
      const scrollBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      // Check if the table is fully visible
      if (scrollBottom < 33) {
        setAtBottom(true);
      } else if (scrollBottom > 23) {
        setAtBottom(false);
      }
    };

    // Add scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPageData]);

  function removeEmployees() {
    removeEmp(checkedList);
    setCheckedList([]);
  }
  function reportingManagers() {
    coreService
      .get("manager/reporting-managers")
      .then((res) => {
        setReportingManagerData(res.data);
      })
      .catch((err) => {
        toastrService.error(err?.response?.data?.error);
      });
  }

  const sortData = (
    data: any[],
    columnKey: string | null,
    sortOrder: "asc" | "desc"
  ) => {
    return [...data].sort((a: any, b: any) => {
      if (columnKey === null) {
        return 0;
      }
      // Current base salary sorting for home page
      if (columnKey === "allocation_percent") {
        const salaryA = a.allocation_percent || "";
        const salaryB = b.allocation_percent || "";
        return sortOrder === "asc" ? salaryA - salaryB : salaryB - salaryA;
      } else if (columnKey === "emp_org_id") {
        const salaryA = a.emp_org_id || "";
        const salaryB = b.emp_org_id || "";
        return sortOrder === "asc" ? salaryA - salaryB : salaryB - salaryA;
      }
      // Hire_Date sorting for home page
      else if (columnKey === "doj" || columnKey === "allocation_date") {
        let valueA = a[columnKey]?.toLowerCase() || "";
        let valueB = b[columnKey]?.toLowerCase() || "";
        valueA = new Date(valueA);
        valueB = new Date(valueB);
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        const valueA = a[columnKey];
        const valueB = b[columnKey];

        return sortOrder === "asc"
          ? valueA?.localeCompare(valueB)
          : valueB?.localeCompare(valueA);
      }
    });
  };

  const handleSort = (columnKey: string | null) => {
    const sortOrder =
      sorting.columnKey === columnKey
        ? sorting.sortOrder === "asc"
          ? "desc"
          : "asc"
        : "asc";
    setSorting({ columnKey, sortOrder });
    const sortedData: any = sortData(currentPageData, columnKey, sortOrder);
    setCurrentPageData(sortedData);
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      const allKeys = currentPageData.map((item) => item.id);
      setCheckedList(allKeys);
    } else {
      setCheckedList([]);
    }
  };

  const handleRowCheckboxChange = (key: any, checked: any) => {
    if (checked) {
      setCheckedList((prevKeys) => [...prevKeys, key]);
    } else {
      setCheckedList((prevKeys) => prevKeys.filter((k) => k !== key));
    }
  };

  // Modify the "gotoPage" function.
  function gotoPage(pageNo: number = 1) {
    setCurrentPage(pageNo);
  }

  function toggleDatePicker(
    employee: any,
    type: string,
    eventType: string,
    id: string
  ) {
    let datePickerVisibility = {
      employee: eventType == "focus" ? employee : {},
      isHireDateVisible: false,
      isLastSalaryChangeVisible: false,
      isEffectiveDateVisible: false,
    };

    if (eventType === "focus" && type === "hire_date") {
      datePickerVisibility.isHireDateVisible = true;
    } else if (eventType === "focus" && type === "last_salary_change") {
      datePickerVisibility.isLastSalaryChangeVisible = true;
    } else {
      datePickerVisibility.isEffectiveDateVisible = true;
    }

    setDatePickerVisibility(datePickerVisibility);
    setTimeout(() => {
      document.getElementById(id)?.click();
    }, 50);
  }

  function formateDate(date: any) {
    return date ? moment(date).format("YYYY/MM/DD") : "Select Date";
  }

  const renderSortingIcons = (columnKey: string) => {
    const iconStyle = {
      fontSize: "1.2em",
      marginRight: "4px",
      color: "#718CEB",
    };

    if (sorting.columnKey === columnKey) {
      const isAscending = sorting.sortOrder === "asc";
      const isDescending = sorting.sortOrder === "desc";

      return (
        <span>
          <span style={{ ...iconStyle, opacity: isAscending ? 1 : 0.3 }}>
            ↑
          </span>
          <span style={{ ...iconStyle, opacity: isDescending ? 1 : 0.3 }}>
            ↓
          </span>
        </span>
      );
    }
    return (
      <span>
        <span style={{ ...iconStyle, opacity: 0.3 }}>↑</span>
        <span style={{ ...iconStyle, opacity: 0.3 }}>↓</span>
      </span>
    );
  };

  function handleTableScroll(e: any) {
    const customScrollBar: any = customScrollRef.current;
    if (customScrollBar) {
      customScrollBar.scrollLeft = e.target.scrollLeft;
    }
  }

  function handleCustomScroll(e: any) {
    const table: any = tableRef.current;
    if (table) {
      table.scrollLeft = e.target.scrollLeft;
    }
  }

  function showModal() {
    setShowImport(!showImport);
    updateTableData();
  }
  function showAddEmployeeModal() {
    setShowForm(!showForm);
  }
  return (
    <>
      <div className="position-relative">
        <div className="d-flex gap-3">
          <div className="align-items-center mb-4">
            <div>
              <button
                className="btn-primary d-flex align-items-center gap-1"
                onClick={() => {
                  setShowForm(!showForm);
                }}
              >
                <img
                  src="/assets/images/white-plus-icon.svg"
                  alt="plus-white"
                />
                <span>Add Employee</span>
              </button>
            </div>
            {showForm && <AddEmployee modalVisible={showAddEmployeeModal}/>}
          </div>
          <div className="align-items-center mb-4">
            <div>
              <button
                className="btn-primary d-flex align-items-center gap-1"
                onClick={() => {
                  setShowImport(!showImport);
                }}
              >
                <img
                  src="/assets/images/white-plus-icon.svg"
                  alt="plus-white"
                />
                <span>Import Employees</span>
              </button>
            </div>

            {showImport && <ImportAndExport modalVisible={showModal} />}
          </div>
          <div className="align-items-center mb-4">
            <div>
              <button
                disabled={!containsValue}
                className="btn-primary d-flex align-items-center gap-1"
                onClick={() => {
                  removeEmployees();
                }}
              >
                <img
                  src="/assets/images/white-plus-icon.svg"
                  alt="plus-white"
                />
                <span>Remove Employees</span>
              </button>
            </div>
          </div>
        </div>
        <div
          className="data-table mb-3 position-relative z-0"
          ref={tableRef}
          onScroll={handleTableScroll}
        >
          <table className="table">
            <thead>
              <tr>
                <th scope="col" className="stickey-col checkbox">
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={handleSelectAll}
                    checked={checkAll}
                  ></Checkbox>
                </th>

                <th scope="col" className="stickey-col">
                  <div className="d-flex">
                    <span>First Name&nbsp;</span>
                    <div
                      className="sort-cursor"
                      onClick={() => handleSort("first_name")}
                    >
                      {renderSortingIcons("first_name")}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="col-min-width"
                  onClick={() => handleSort("last_name")}
                >
                  Last Name&nbsp;{renderSortingIcons("last_name")}
                </th>
                <th scope="col">
                  <div className="d-flex">
                    <span>Employee Org Id&nbsp;</span>
                    <div
                      className="sort-cursor"
                      onClick={() => handleSort("emp_org_id")}
                    >
                      {renderSortingIcons("emp_org_id")}
                    </div>
                  </div>
                </th>
                <th scope="col" onClick={() => handleSort("email")}>
                  Email {renderSortingIcons("email")}
                </th>
                <th scope="col" onClick={() => handleSort("grade")}>
                  Grade {renderSortingIcons("grade")}
                </th>
                <th scope="col" onClick={() => handleSort("designation")}>
                  <span>Job Title</span> {renderSortingIcons("designation")}
                </th>
                <th scope="col" onClick={() => handleSort("reporting_to")}>
                  Reports To {renderSortingIcons("reporting_to")}
                </th>

                <th scope="col" onClick={() => handleSort("doj")}>
                  Hire Date {renderSortingIcons("doj")}
                </th>
                <th scope="col" onClick={() => handleSort("compentency")}>
                  <span>Competancy</span> {renderSortingIcons("compentency")}
                </th>

                <th scope="col" onClick={() => handleSort("allocation_type")}>
                  <span>
                    Allocation Type {renderSortingIcons("allocation_type")}
                  </span>
                </th>
                <th scope="col" onClick={() => handleSort("allocation_date")}>
                  <span>
                    Allocation Date {renderSortingIcons("allocation_date")}
                  </span>
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("allocation_percent")}
                >
                  <span>
                    Allocation {renderSortingIcons("allocation_percent")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={
                    checkedList.includes(employee.id) ? "selected-row" : ""
                  }
                >
                  <th scope="row" className="stickey-col checkbox">
                    <Checkbox
                      value={employee.id}
                      checked={checkedList.includes(employee.id)}
                      onChange={(e) =>
                        handleRowCheckboxChange(employee.id, e.target.checked)
                      }
                    />
                  </th>
                  <td className="stickey-col">
                    <div contentEditable={true} suppressContentEditableWarning>
                      {employee?.first_name || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {employee?.last_name || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {employee?.emp_org_id || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {employee?.email || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {employee?.grade || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {employee?.designation || "-"}
                    </div>
                  </td>
                  <td>
                    <Select
                      suffixIcon=""
                      value={employee?.reporting_to}
                      className="custom-dropdown"
                    >
                      {reportingManagerData.map((manager: any, i: any) => (
                        <Select.Option key={i} value={manager.id}>
                          {manager.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </td>

                  <td>
                    {!datePickerVisibility?.isLastSalaryChangeVisible ||
                    employee?.id !== datePickerVisibility?.employee?.id ? (
                      <div
                        className="date-string"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e: any) =>
                          toggleDatePicker(
                            employee,
                            "last_salary_change",
                            "blur",
                            `last_salary_change${employee?.id}`
                          )
                        }
                        onFocus={(e: any) =>
                          toggleDatePicker(
                            employee,
                            "last_salary_change",
                            "focus",
                            `last_salary_change${employee?.id}`
                          )
                        }
                      >
                        {formateDate(employee?.doj)}
                      </div>
                    ) : (
                      <DatePicker
                        suffixIcon=""
                        id={"last_salary_change" + employee?.id}
                        allowClear={false}
                        className="custom-datepicker"
                        defaultValue={
                          employee?.date_of_joining
                            ? dayjs(employee?.date_of_joining)
                            : dayjs()
                        }
                        format="YYYY/MM/DD"
                        onBlur={(e: any) =>
                          toggleDatePicker(
                            employee,
                            "last_salary_change",
                            "blur",
                            `last_salary_change${employee?.id}`
                          )
                        }
                      />
                    )}
                  </td>
                  <td>
                    <div>{employee.compentency || "-"}</div>
                  </td>
                  <td>
                    <div>{employee.allocation_type || "-"}</div>
                  </td>
                  <td>
                    <div>{employee.allocation_date || "-"}</div>
                  </td>
                  <td>
                    <div>{employee.allocation_percent || "-"}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentPageData.length > 0 && totalPages > 1 ? (
            <div className="pagination">
              <button
                className="previous-page"
                disabled={currentPage === 1}
                onClick={() => {
                  gotoPage(currentPage - 1);
                }}
              >
                <svg
                  width="6"
                  height="12"
                  viewBox="0 0 6 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5249 8.96004L1.2649 5.70004C0.879902 5.31504 0.879902 4.68504 1.2649 4.30004L4.5249 1.04004"
                    stroke="#718CEB"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>Previous</span>
              </button>
              {visiblePages.map((page, i) => (
                <button
                  key={i}
                  className={
                    "pagenum" + (currentPage === page ? " active" : "")
                  }
                  onClick={() => {
                    gotoPage(page);
                  }}
                >
                  {page}
                </button>
              ))}
              {totalPages > visiblePageCount && visibleLastPage < totalPages ? (
                <>
                  <span className="pagedots">...</span>
                  <button
                    className="pagenum"
                    onClick={() => {
                      gotoPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </button>
                </>
              ) : (
                ""
              )}
              <button
                className="next-page"
                disabled={currentPage === totalPages}
                onClick={() => {
                  gotoPage(currentPage + 1);
                }}
              >
                <span>Next</span>
                <svg
                  width="6"
                  height="12"
                  viewBox="0 0 6 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.4751 1.53996L4.7351 4.79996C5.1201 5.18496 5.1201 5.81496 4.7351 6.19996L1.4751 9.45996"
                    stroke="#718CEB"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            ""
          )}
          {currentPageData?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            ""
          )}
        </div>
        <div
          ref={customScrollRef}
          className={`custom-scroll-bar ${atBottom ? "v-hidden" : ""}`}
          onScroll={handleCustomScroll}
        >
          <div className="custom-scroll-bar-inner">Custom scroll bar</div>
        </div>
      </div>
    </>
  );
}

export default EmployeeTable;

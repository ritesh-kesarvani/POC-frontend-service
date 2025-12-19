import { Checkbox, Empty } from "antd";
import "./ProjectTable.css";
// import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useEffect, useRef, useState } from "react";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import AddProject from "../../containers/addProject/AddProject";
import ApiLoader from "../apiLoader/ApiLoader";

type CheckboxValueType = string | number;

function ProjectTable() {
  const [loading, setLoading] = useState(false);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<{
    columnKey: string | null;
    sortOrder: "asc" | "desc";
  }>({
    columnKey: null,
    sortOrder: "asc",
  });

  const [atBottom, setAtBottom] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const customScrollRef = useRef(null);
  const tableRef = useRef(null);

  const containsValue: boolean = !!checkedList.length;

  useEffect(() => {
    getFilterList();
  }, []);

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
  }, [projectData]);

  const sortData = (
    data: any[],
    columnKey: string | null,
    sortOrder: "asc" | "desc"
  ) => {
    return [...data].sort((a: any, b: any) => {
      if (columnKey === null) {
        return 0;
      }

      if (
        columnKey === "name" ||
        columnKey === "bussiness_group" ||
        columnKey === "currency" ||
        columnKey === "department"
      ) {
        const valueA = a[columnKey]?.toLowerCase() || "";
        const valueB = b[columnKey]?.toLowerCase() || "";
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (columnKey === "hd") {
        const valueA = a[columnKey] || "";
        const valueB = b[columnKey] || "";
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
    const sortedData: any = sortData(projectData, columnKey, sortOrder);
    setProjectData(sortedData);
  };

  function getFilterList() {
    coreService
      .get("projects/available-list")
      .then((res) => {
        setProjectData(res.data);
      })
      .catch((err) => {
        toastrService.error(err?.response?.data?.error);
      });
  }

  function removePj(id?: any) {
    setLoading(true);
    coreService
      .remove("projects/" + id)
      .then((res: any) => {
        setLoading(false);
        toastrService.success(res.data.message);
        getFilterList();
      })
      .catch((err) => {
        setLoading(false);
        toastrService.error(err?.response?.data?.error);
      });
  }

  let perPageCount: number = 10;
  let totalPages: number = Math.ceil(projectData.length / perPageCount);
  let visiblePageCount: number = 3;
  const checkAll: boolean =
    projectData.length === checkedList.length && projectData.length !== 0;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < projectData.length;

  let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
  let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
  let visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => i + startPage
  );
  let visibleLastPage: number = endPage;

  useEffect(() => {
    let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
    let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
    visibleLastPage = endPage;
    // Create an array of visible pages.
    visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => i + startPage
    );
    let tempData = [...projectData];
    let startIndex = (currentPage - 1) * perPageCount;
    tempData = tempData.slice(startIndex, startIndex + perPageCount);
    setProjectData(tempData);
  }, [currentPage]);

  // Modify the "gotoPage" function.
  function gotoPage(pageNo: number = 1) {
    setCurrentPage(pageNo);
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

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      const allKeys = projectData.map((item) => item.id);
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

  function showModal() {
    setShowForm(!showForm);
    getFilterList();
  }
  function removeProjects() {
    removePj(checkedList);
    setCheckedList([]);
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
                <span>Add Project</span>
              </button>
            </div>
            {showForm && <AddProject modalVisible={showModal} />}
          </div>
          <div className="align-items-center mb-4">
            <div>
              <button
                disabled={!containsValue}
                className="btn-primary d-flex align-items-center gap-1"
                onClick={() => {
                  removeProjects();
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
                  <div>
                    <span>Name&nbsp;</span>
                    <div
                      className="sort-cursor"
                      onClick={() => handleSort("name")}
                    >
                      {renderSortingIcons("name")}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="col-min-width"
                  onClick={() => handleSort("bussiness_group")}
                >
                  Bussiness Group&nbsp;{renderSortingIcons("bussiness_group")}
                </th>
                <th scope="col" onClick={() => handleSort("hd")}>
                  Hours in a Day {renderSortingIcons("hd")}
                </th>
                <th scope="col" onClick={() => handleSort("customer_code")}>
                  Customer Code {renderSortingIcons("customer_code")}
                </th>
                <th scope="col" onClick={() => handleSort("customer_name")}>
                  Customer Name {renderSortingIcons("customer_name")}
                </th>
                <th scope="col" onClick={() => handleSort("currency")}>
                  <span>Project Currency</span> {renderSortingIcons("currency")}
                </th>
              </tr>
            </thead>
            <tbody>
              {projectData.map((project, index) => (
                <tr
                  key={project.id}
                  className={
                    checkedList.includes(project.id) ? "selected-row" : ""
                  }
                >
                  <th scope="row" className="stickey-col checkbox">
                    <Checkbox
                      checked={checkedList.includes(project.id)}
                      onChange={(e) =>
                        handleRowCheckboxChange(project.id, e.target.checked)
                      }
                    />
                  </th>
                  <td className="stickey-col">
                    <div
                      contentEditable={true}
                      suppressContentEditableWarning // Add this attribute to suppress the warning
                    >
                      {project?.name || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {project?.bussiness_group || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {project?.hd || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {project?.customer_code || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {project?.customer_name || "-"}
                    </div>
                  </td>
                  <td>
                    <div contentEditable={true} suppressContentEditableWarning>
                      {project?.currency || "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projectData.length > 0 && totalPages > 1 ? (
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
          {projectData?.length === 0 ? (
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
      {loading ? <ApiLoader /> : ""}
    </>
  );
}

export default ProjectTable;

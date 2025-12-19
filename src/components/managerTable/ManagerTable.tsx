import { Empty, Popconfirm } from "antd";
import "./ManagerTable.css";
import type { PopconfirmProps } from "antd";

// import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useEffect, useState } from "react";

interface DataTableProps {
  managerData: any[];
  onRemove: any;
}

type CheckboxValueType = string | number;

function ManagerTable({ managerData, onRemove }: DataTableProps) {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [currentPageData, setCurrentPageData] = useState<any[]>([]);

  let perPageCount: number = 10;
  let totalPages: number = Math.ceil(managerData.length / perPageCount);
  let visiblePageCount: number = 3;
  let startPage = 1;
  let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

  let visibleLastPage: number = endPage;
  useEffect(() => {
    let startPage = 1;
    let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
    visibleLastPage = endPage;

    let tempData = [...managerData];
    let startIndex = 1;
    tempData = tempData.slice(startIndex, startIndex + perPageCount);
    setCurrentPageData(tempData);
  }, [managerData]);

  useEffect(() => {
    const newList = checkedList.filter((item: any) => {
      // return item
      managerData.map((data: any) => {
        if (data.email == item) {
          return true;
        } else {
          return false;
        }
      });
    });
    setCheckedList(newList);
  }, [managerData]);

  const confirm: PopconfirmProps["onConfirm"] = (email) => {
    onRemove(email);
  };

  return (
    <>
      <div className="manager-table mb-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Work Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((employ, index) => (
              <tr
                key={index}
                className={
                  checkedList.includes(employ.id) ? "selected-row" : ""
                }
              >
                <td>{employ?.name}</td>
                <td>{employ?.email}</td>
                <td className="text-danger">
                  <Popconfirm
                    title="Delete the Manager"
                    description="Are you sure to delete this Manager?"
                    onConfirm={() => {
                      confirm(employ.email);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span className="remove-text">Remove</span>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentPageData?.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default ManagerTable;

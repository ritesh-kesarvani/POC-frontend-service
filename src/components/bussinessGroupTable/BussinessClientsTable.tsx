import { Empty, Popconfirm } from "antd";
import "./BussinessClientsTable.css";
import { useEffect, useState } from "react";
import type { PopconfirmProps } from "antd";

interface DataTableProps {
  customersData: any[];
  onRemove: any;
}
type CheckboxValueType = string | number;

function BussinessClientsTable({ customersData, onRemove }: DataTableProps) {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [currentPageData, setCurrentPageData] = useState<any[]>([]);

  let perPageCount: number = 10;
  useEffect(() => {
    let tempData = [...customersData];
    let startIndex = 0;
    tempData = tempData.slice(startIndex, startIndex + perPageCount);
    setCurrentPageData(tempData);
  }, [customersData]);

  useEffect(() => {
    const newList = checkedList.filter((item: any) => {
      // return item
      customersData.map((data: any) => {
        if (data.email == item) {
          return true;
        } else {
          return false;
        }
      });
    });
    setCheckedList(newList);
  }, [customersData]);

  const confirm: PopconfirmProps["onConfirm"] = (id) => {
      onRemove(id);
    };
  return (
    <>
      <div className="manager-table mb-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">bussiness Group</th>
              <th scope="col">Customer ID</th>
              <th scope="col">Customer Name</th>
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
                <td>{employ?.bussiness_group}</td>
                <td>{employ?.customer_code}</td>
                <td>{employ?.customer_name}</td>
                <td className="text-danger">
                  <Popconfirm
                    title="Delete the Customer"
                    description="Are you sure to delete this Customer?"
                    onConfirm={() => {
                      confirm(employ.id);
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

export default BussinessClientsTable;

import { useState } from "react";
import { Tabs } from "antd";
import "./Settings.css";
import { useSearchParams } from "react-router-dom";
import Managers from "../../components/settings/Managers";
import BussinessClients from "../../components/settings/BussinessClients";

function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState<any>(
    searchParams.get("tab") || 1
  );

  function handleTabChange(key: any) {
    setSearchParams({ tab: key });
    setCurrentTab(key);
  }
  const tabItems = [
    {
      key: "1",
      label: "Managers",
      children: <Managers />,
    },
    {
      key: "2",
      label: "Bussiness Clients",
      children: <BussinessClients />,
    },
  ];

  return (
    <div className="settings">
      <div className="d-flex align-items-center gap-10 mt-4">
        <h1 className="page-title">Settings</h1>
      </div>

      <Tabs
        defaultActiveKey={currentTab}
        onChange={handleTabChange}
        items={tabItems}
      />
    </div>
  );
}

export default Settings;

import { Modal } from "antd";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import ApiLoader from "../apiLoader/ApiLoader";

interface ChildProps {
  modalVisible: () => void; // Type the setter function
}

export const ImportAndExport: React.FC<ChildProps> = ({ modalVisible }) => {
  // function ImportAndExport() {
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [file, setFile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [importErrors, setImportErrors] = useState<
    Array<{ row: number; errors: Record<string, string[]> }>
  >([]);

  function onFileSelect(fil_d: any) {
    setFile(fil_d);
  }

  function onModalClose() {
    setOpenModal(false);
    setFile(null);
    setImportErrors([]);
  }

  function importFile() {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    coreService
      .post("employee/import-excel", formData)
      .then((res: any) => {
        setLoading(false);
        setFile(null);
        setOpenModal(false);
        toastrService.success("File imported successfully!");
        modalVisible();
      })
      .catch((err: any) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          if (err.response && err.response.data && err.response.data.errors) {
            setImportErrors(err.response.data.errors);
          }
        } else {
          toastrService.error("Failed to import file!");
        }
      });
  }
  function removeFile() {
    setFile(null);
    setImportErrors([]);
  }

  function formatBytes(bytes: any, decimals = 1) {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  return (
    <>
      {/* import modal  */}
      <Modal
        title="Import"
        okText="Import"
        centered
        open={openModal}
        onOk={importFile}
        onCancel={onModalClose}
        className="import-modal"
        maskClosable={false}
      >
        <div className="mt-2 mb-4"></div>
        {!file ? (
          <FileUploader
            handleChange={onFileSelect}
            name="file"
            hoverTitle=" "
            dropMessageStyle={{
              backgroundColor: "#718CEB",
              border: "none",
              borderRadius: "0",
            }}
            multiple={false}
            label=""
            classes="drop-area w-100"
          >
            <div className="text-center w-100 p-2 p-sm-4">
              <img
                src="/assets/images/upload-icon.svg"
                alt="upload-icon"
                className="upload-icon"
              />
              <div>
                <div className="m-2 mt-3">
                  <p className="select-info m-0">
                    Select a file or drag and drop here
                  </p>
                  <p className="data-info m-0">
                    CSV/Excel Data Import into the Database
                  </p>
                </div>
                <span className="btn-primary mt-2 c-pointer py-2 px-3">
                  Select File
                </span>
              </div>
            </div>
          </FileUploader>
        ) : (
          <div>
            <div className="upload-card d-flex justify-content-between align-items-center p-2 w-100 m-1">
              <img
                src="/assets/images/image-icon.svg"
                alt="load-icon"
                className="image-icon mx-2 mt-1"
              />
              <div className="d-flex align-items-center gap-10">
                <div className="d-flex align-items-center gap-10">
                  <p className="m-0 filename">{file?.name}</p>
                  <p className="m-0 filesize">{formatBytes(file?.size)}</p>
                </div>
                <p className="c-pointer m-0" onClick={removeFile}>
                  &#x2716;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Errors display code */}
        {importErrors.length > 0 && (
          <div className="mt-4 p-2 error-container">
            <p className="text-danger font-weight-bold h5">Errors:</p>
            <ul>
              {importErrors.map((error, index) => (
                <li key={index} className="text-danger">
                  <span className="error-row font-weight-bold text-danger">
                    Row {error.row}:
                  </span>
                  <ul className="mb-2">
                    {Object.entries(error.errors).map(
                      ([fieldName, fieldError], i) => (
                        <li className="text-danger" key={i}>
                          {fieldError}
                        </li>
                      )
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {loading ? <ApiLoader /> : ""}
    </>
  );
};

export default ImportAndExport;

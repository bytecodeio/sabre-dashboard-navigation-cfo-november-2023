import React, { Fragment, useContext, useEffect, useState } from "react";
import CSVFileValidator from "csv-file-validator";
import { CSVLink } from "react-csv";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { indexOf } from "lodash";
import {
  Container,
  Tab,
  Tabs,
  Nav,
  NavItem,
  Dropdown,
  Button,
  Input,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Select, MenuItem } from "@mui/material";
import { AppAlertContext } from "../Home";

export const GCloud = () => {
  const extensionContext = useContext(ExtensionContext);
  const setAppAlert = useContext(AppAlertContext);

  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [file, setFile] = useState();
  useEffect(() => {
    const initialize = async () => {
      let { body } = await extensionContext.extensionSDK.serverProxy(
        "https://us-central1-acoustic-atom-309118.cloudfunctions.net/cloud-storage-func/folders"
      );
      setFolders(body);
    };
    initialize();
  }, []);

  const handleFolderChange = (v) => {
    console.log(v);
    setSelectedFolder(v.target.value);
    console.log(selectedFolder, "this");
  };

  const handleFileChange = (e, keyword) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0];
      const fileName = uploadedFile.name.toLowerCase();

      if (!fileName.includes(keyword.toLowerCase())) {
        setAppAlert({
          message: `Error: File should contain this format: Filename-${keyword}.csv`,
          type: "error",
        });
      }
      setFile(uploadedFile);
    }
  };

  // const handleFileChange = (e) => {
  //   if (e.target.files) {
  //     setFile(e.target.files[0]);
  //     console.log(e.target.files[0]);
  //   }
  // };

  const submitFile = async (keyword) => {
    try {
      if (!file) {
        throw new Error(`No File Selected`);
      }

      if (!containsKeyword(file.name, keyword)) {
        throw new Error(`File should contain the keyword: ${keyword}`);
      }

      let _base64 = await getBase64(file);

      let payload = `file=${_base64}&name=${file.name}&folder="/"`;

      let res = await extensionContext.extensionSDK.serverProxy(
        "https://us-central1-acoustic-atom-309118.cloudfunctions.net/cloud-storage-func/uploadfile",
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: payload,
        }
      );

      setAppAlert({
        message: "Successfully uploaded your CSV file!",
        type: "success",
      });
    } catch (error) {
      if (error.message !== "No file selected") {
        setAppAlert({
          message: error.message || "Something went wrong.",
          type: "error",
        });
      }
    }
  };

  const containsKeyword = (fileName, keyword) => {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
    return regex.test(fileName.toLowerCase());
  };

  const getBase64 = (_file) =>
    new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(_file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });

  console.log(folders, selectedFolder, file, "elizabeth");

  return (
    <Fragment>
      <p className="mt-4 sameFont">Cloud Storage CSV Upload</p>

      <div className="d-flex flex-column files">
        {/*<Dropdown className="mt-4 mb-5">
            <Dropdown.Toggle   variant="secondary" id="dropdown-basic" onChange={handleFolderChange}>
            Cloud Storage Folders
            </Dropdown.Toggle>

            <Dropdown.Menu value={selectedFolder} onChange={handleFolderChange}>
             {folders?.map(f => {
                return (
              <Dropdown.Item value={f}>{f}</Dropdown.Item>
                  )
                })}

            </Dropdown.Menu>

          </Dropdown>*/}

        {/*<div className="col-md-2">


          <Select label={`Cloud Storage Folders`} value={selectedFolder} onChange={handleFolderChange} id="form-control">
                {folders?.map(f => {
                  return (
                    <MenuItem value={f} id="form-control2">{f}</MenuItem>
                  )
                })}
              </Select>

              </div>*/}

        <Row>
          <div className="col-md-6">
            <Row className="mb-4 mt-3">
              <div className="col-md-8">
                <Form.Label>Upload Mapping</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, "Mapping")}
                />
              </div>
              <div className="col-md-4">
                <Button
                  id="spark"
                  className="m-0"
                  onClick={() => {
                    submitFile("Mapping");
                  }}
                >
                 Upload
                </Button>
              </div>
            </Row>

            <Row className="mb-4 mt-3">
              <div className="col-md-8">
                <Form.Label>Upload Budget</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, "Budget")}
                />
              </div>
              <div className="col-md-4">
                <Button
                  id="spark"
                  className="m-0"
                  onClick={() => {
                    submitFile("Budget");
                  }}
                >
                  Upload
                </Button>
              </div>
            </Row>

            <Row className="mb-4 mt-3">
              <div className="col-md-8">
                <Form.Label>Upload Actual</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, "Actual")}
                />
              </div>
              <div className="col-md-4">
                <Button
                  id="spark"
                  className="m-0"
                  onClick={() => {
                    submitFile("Actual");
                  }}
                >
                 Upload
                </Button>
              </div>
            </Row>
          </div>
          <div className="col-md-6">
            <Row className="mb-4 mt-3">
              <div className="col-md-8">
                <Form.Label>Upload Forecast</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, "Forecast")}
                />
              </div>
              <div className="col-md-4">
                <Button
                  id="spark"
                  className="m-0"
                  onClick={() => {
                    submitFile("Forecast");
                  }}
                >
                  Upload
                </Button>
              </div>
            </Row>

            <Row className="mb-4 mt-3">
              <div className="col-md-8">
                <Form.Label>Upload Cost Optimization</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, "Cost Optimization")}
                />
              </div>
              <div className="col-md-4">
                <Button
                  id="spark"
                  className="m-0"
                  onClick={() => {
                    submitFile("Cost Optimization");
                  }}
                >
                 Upload
                </Button>
              </div>
            </Row>

            <Row className="mb-4 mt-3">
              <div className="col-md-8">
                <Form.Label>Upload Mapping Other Services</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    handleFileChange(e, "Mapping Other Services")
                  }
                />
              </div>
              <div className="col-md-4">
                <Button
                  className="m-0"
                  id="spark"
                  onClick={() => {
                    submitFile("Mapping Other Services");
                  }}
                >
                  Upload
                </Button>
              </div>
            </Row>
          </div>
        </Row>
      </div>
    </Fragment>
  );
};

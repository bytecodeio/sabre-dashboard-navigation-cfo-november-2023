import React, {Fragment, useContext, useEffect, useState } from "react";

import { ExtensionContext } from "@looker/extension-sdk-react";
import { indexOf } from "lodash";
import { Container, Tab, Tabs, Nav, NavItem, Dropdown, Button, Input, Form } from "react-bootstrap";
import {  Select, MenuItem } from "@mui/material";
export const GCloud = () => {
   const extensionContext = useContext(ExtensionContext)

   const [folders, setFolders] = useState([])
   const [selectedFolder, setSelectedFolder] = useState("")
   const [file, setFile] = useState()
   useEffect(() => {
     const initialize = async () => {
       let {body} = await extensionContext.extensionSDK.serverProxy('https://us-central1-acoustic-atom-309118.cloudfunctions.net/cloud-storage-func/folders')
       console.log("folders",body)
       setFolders(body)
     }
     initialize()
   },[])

   const handleFolderChange = (v) => {
     console.log(v)
     setSelectedFolder(v.target.value)
     console.log(selectedFolder, "this")
   }
   const handleFileChange = (e) => {
     if (e.target.files) {
       setFile(e.target.files[0])
       console.log(e.target.files[0])
     }
   }
   const submitFile = async () => {
     let _base64 = await getBase64(file)
     console.log(_base64)
     let payload = `file=${_base64}&name=${file.name}&folder=${selectedFolder}`
     console.log('payload', payload)
     let res = await extensionContext.extensionSDK.serverProxy('https://us-central1-acoustic-atom-309118.cloudfunctions.net/cloud-storage-func/uploadfile',{
       headers:{
         'Content-type':'application/x-www-form-urlencoded'
       },
       method:'POST',
       body:payload
     })
     console.log("res", res)
     alert("Your file was uploaded and saved!")
   }

   const getBase64 = _file => new Promise((resolve,reject) => {
     let reader = new FileReader();
     reader.readAsDataURL(_file);
     reader.onloadend = () => {
       resolve(reader.result)
     }
   });


   console.log(folders, selectedFolder, file, "elizabeth")

  return (


    <Fragment>

              <p className="mt-4 mb-0">Cloud Storage Folders</p>

    <div className="row d-flex align-items-center">

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

          <div className="col-md-3">


          <Select value={selectedFolder} onChange={handleFolderChange} id="form-control">
                {folders?.map(f => {
                  return (
                    <MenuItem value={f} id="form-control2">{f}</MenuItem>
                  )
                })}
              </Select>

              </div>

       {selectedFolder != ""?
       <>
    <div className="col-md-4">
          <Form.Control
          type="file"
          onChange={handleFileChange}
          />
          </div>
    <div className="col-md-4">
         <Button id="gray" onClick={submitFile}>Upload</Button>
            </div>
       </>
       :''}

    </div>

    </Fragment>
  );
};

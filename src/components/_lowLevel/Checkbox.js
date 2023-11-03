import React, {
  Fragment,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import {
  Accordion,
  Col,
  Form,
  Row,
  Button,
  Nav,
  AccordionCollapse,
} from "react-bootstrap";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { Switch } from "@mui/material";

const Checkbox = ({
  fieldOptions,
  setFieldOptions,
  selectedFields,
  setSelectedFields,
  fieldNameSuggestions,
  setFieldNameSuggestions,
  selectedCheckboxes,
  setSelectedCheckboxes,
  boardTitle,
  setBoardTitle,
  filter,
  expression,
  onChange,
}) => {
  const { core40SDK: sdk, extensionSDK } = useContext(ExtensionContext);

  const handleFieldSelection = (field, value) => {
    let _selectedCheckboxes = { ...selectedCheckboxes };
    let { title } = field;
    if (!_selectedCheckboxes.hasOwnProperty(title)) {
      _selectedCheckboxes[title] = [];
    }
    if (_selectedCheckboxes[title]?.includes(value)) {
      let index = _selectedCheckboxes[title].indexOf(value);
      _selectedCheckboxes[title].splice(index, 1);
      console.log(_selectedCheckboxes);
    } else {
      _selectedCheckboxes[title].push(value);
    }
    if (_selectedCheckboxes[title].length == 0) {
      delete _selectedCheckboxes[title];
    }
    setSelectedCheckboxes(_selectedCheckboxes);
  };

  useEffect(() => {
    console.log("fields", fieldNameSuggestions);
  }, [fieldNameSuggestions]);





  const handleSelectAll = (field) => {
    const allOptions = field.suggestions;
    const allSelected = allOptions.every((option) =>
      selectedCheckboxes[field.name]?.includes(option)
    );
    setSelectedCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [field.name]: allSelected ? [] : [...allOptions],
    }));
  };

  const [show5, setShow5] = React.useState();

   const wrapperRef = React.useRef(null);

   React.useEffect(() => {
     document.addEventListener("click", handleClickOutside, false);
     return () => {
       document.removeEventListener("click", handleClickOutside, false);
     };
   }, []);

   const handleClickOutside = (event) => {
     if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
       setShow5(true);

     }
   };

  const [open, setOpen] = React.useState(false);

  console.log(boardTitle);



  return (
    <Fragment>
      <div className="d-flex justify-content-start align-items-center flex-wrap custom">
        {fieldNameSuggestions.map((field, index) => (
          <Row key={index}>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header>{field.name}</Accordion.Header>

                <Accordion.Body>
                  <Switch
                    className="allOptions clear first"
                    label="Select All"
                    onClick={() => handleSelectAll(field)}
                    checked={field.suggestions.every((option) =>
                      selectedCheckboxes[field.title]?.includes(option)
                    )}
                  />
                  <div className="divider"></div>
                  <div class="scrollInside">
                    {field.suggestions.map((option, optionIndex) => (
                      <Form.Group key={optionIndex}>
                        <Form.Check
                          onClick={() => handleFieldSelection(field, option)}
                          type="checkbox"
                          className=""
                          label={option}
                          checked={selectedCheckboxes[field.title]?.includes(
                            option
                          )}
                          name="accountGroups"
                          id={`id_${index}_${optionIndex}`}
                          value={option}
                        />
                      </Form.Group>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>
        ))}
      </div>
    </Fragment>
  );
};

export default Checkbox;

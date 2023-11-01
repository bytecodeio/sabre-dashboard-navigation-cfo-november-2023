
import React, { Fragment, createContext, useEffect, useState, useContext } from "react";
import { Accordion, Col, Form, Row, Button, Nav } from "react-bootstrap";
import { ExtensionContext } from "@looker/extension-sdk-react";

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
  onChange
}) => {
  const { core40SDK: sdk, extensionSDK } = useContext(ExtensionContext);
  const handleFieldSelection = (field, value) => {
    let _selectedCheckboxes = {...selectedCheckboxes};
    let {title} = field;
    if (!_selectedCheckboxes.hasOwnProperty(title)) {
      _selectedCheckboxes[title] = []
    }
    if (_selectedCheckboxes[title]?.includes(value)) {
      let index = _selectedCheckboxes[title].indexOf(value)
      _selectedCheckboxes[title].splice(index,1)
      console.log(_selectedCheckboxes)
    } else {
      _selectedCheckboxes[title].push(value)
    }
    if (_selectedCheckboxes[title].length == 0 ) {
      delete _selectedCheckboxes[title]
    }
    setSelectedCheckboxes(_selectedCheckboxes)
    // setSelectedCheckboxes((prev) => {
    //   if (prev.includes(value)) {
    //     return prev.filter((selectedFilter) => selectedFilter !== value);
    //   } else {
    //     return [...prev, value];
    //   }
    // });
  };

  useEffect(() => {
    console.log("fields", fieldNameSuggestions)
  },[fieldNameSuggestions])



  const handleSelectAll = (field) => {
    const allOptions = field.suggestions;
    const allSelected = allOptions.every((option) =>
      selectedCheckboxes?.includes(option)
    );

    if (allSelected) {
      setSelectedCheckboxes((prev) =>
        prev.filter((option) => !allOptions.includes(option))
      );
    } else {
      setSelectedCheckboxes((prev) => [...prev, ...allOptions]);
    }
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

    console.log(boardTitle)

  return (

    <Fragment>
    <div className="d-flex justify-content-start align-items-center flex-wrap custom" ref={wrapperRef}>
     {fieldNameSuggestions.map((field, index) => (
       <Row key={index}>

           <Accordion defaultActiveKey="0">
             <Accordion.Item eventKey="1">
               <Accordion.Header>{field.name}</Accordion.Header>
               <Accordion.Body className={show5 ? "pink" : "blue"}>
                 <Form.Check
                   className="allOptions clear first"
                   type="switch"
                   label="Select All"
                   onClick={() => handleSelectAll(field)}
                   checked={field.suggestions.every((option) =>
                     selectedCheckboxes[field.title]?.includes(option)
                   )}
                 />
                 <div class="scrollInside">
                 {field.suggestions.map((option, optionIndex) => (
                   <Form.Group key={optionIndex}>
                     <Form.Check
                       onClick={() => handleFieldSelection(field, option)}
                       type="checkbox"
                       className=""
                       label={option}
                       checked={selectedCheckboxes[field.title]?.includes(option)}
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

    {/*<div className="d-flex justify-content-start align-items-center custom">
      {fieldNameSuggestions.map((field, index) => (
        <Row key={index}>
          <Col sm={12}>


            <Button
            id="gray2"
            onClick={() => {
              setOpen(!open);
            }}
            >
            {field.name}
            </Button>
                <div className={open ? "whiteBox" : 'whiteBox hidden'}>
                  <Form.Check
                    className="allOptions clear first"
                    type="switch"
                    label="Select All"
                    onClick={() => handleSelectAll(field)}
                    checked={field.suggestions.every((option) =>
                      selectedCheckboxes?.includes(option)
                    )}
                  />
                  {field.suggestions.map((option, optionIndex) => (
                    <Form.Group key={optionIndex}>
                      <Form.Check
                        onClick={() => handleFieldSelection(option)}
                        type="checkbox"
                        className=""
                        label={option}
                        checked={selectedCheckboxes?.includes(option)}
                        name="accountGroups"
                        id={`id_${index}_${optionIndex}`}
                        value={option}
                      />
                    </Form.Group>
                  ))}
              </div>
          </Col>
        </Row>
      ))}

      </div>*/}
  </Fragment>
  );
};

export default Checkbox;

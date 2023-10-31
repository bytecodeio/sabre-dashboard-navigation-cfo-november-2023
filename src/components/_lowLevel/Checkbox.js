
import React, { Fragment, useState } from "react";
import { Accordion, Col, Form, Row, Button, Nav } from "react-bootstrap";

const Checkbox = ({
  fieldOptions,
  setFieldOptions,
  selectedFields,
  setSelectedFields,
  fieldNameSuggestions,
  setFieldNameSuggestions,
  selectedCheckboxes,
  setSelectedCheckboxes,
}) => {
  const handleFieldSelection = (value) => {
    setSelectedCheckboxes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((selectedFilter) => selectedFilter !== value);
      } else {
        return [...prev, value];
      }
    });
  };

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


    const [open, setOpen] = React.useState(false);

  return (

    <Fragment>
    <div className="d-flex justify-content-start align-items-center custom">
     {fieldNameSuggestions.map((field, index) => (
       <Row key={index}>
         <Col sm={3}>
           <Accordion defaultActiveKey="0">
             <Accordion.Item eventKey="1">
               <Accordion.Header>{field.name}</Accordion.Header>
               <Accordion.Body>
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
               </Accordion.Body>
             </Accordion.Item>
           </Accordion>
         </Col>
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

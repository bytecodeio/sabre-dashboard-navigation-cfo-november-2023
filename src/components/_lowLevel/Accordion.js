import React, { useState } from "react";
import ReactDOM from "react-dom";
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import {
  Accordion,
  Button,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
  Modal
} from "react-bootstrap";
const Accordions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [faClass, setFaClass] = useState(true);

  const handleClick = () => {


      setFaClass(!faClass);

  };

  return (
  <Container fluid>

  <Card>
      <Card.Header
      onClick={() => {setIsExpanded(!isExpanded);handleClick();}}>
      Parent <i className={faClass ? 'fal fa-chevron-circle-down' : 'fal fa-chevron-circle-up'}></i></Card.Header>
      <Collapse in={isExpanded}>
        <Card.Body>
            <Card>
              <Card.Header onClick={() => setIsExpanded2(!isExpanded2)}>Child Accordion</Card.Header>
              <Collapse in={isExpanded2}>
                <Card.Body>Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content</Card.Body>


              </Collapse>
            </Card>
            <Card>
              <Card.Header>Child Accordion</Card.Header>
              <Collapse>
                <Card.Body>Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content</Card.Body>
              </Collapse>
            </Card>
        </Card.Body>
      </Collapse>
    </Card>

    //
    // <Accordion defaultActiveKey="0">
    //
    //   <Accordion.Item eventKey="1">
    //     <Accordion.Header>External Links</Accordion.Header>
    //     <Accordion.Body>
    //       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    //       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
    //       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    //       aliquip ex ea commodo consequat. Duis aute irure dolor in
    //       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    //       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    //       culpa qui officia deserunt mollit anim id est laborum.
    //     </Accordion.Body>
    //   </Accordion.Item>
    // </Accordion>


</Container>


  );
}

export default Accordions;

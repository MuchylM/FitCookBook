import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from "react"

const RecipeModal = (props) => {
    const [modalData, setModalData] = useState({});
    function getIngredientList() {
        const result = [];
        if (props.modalShow.ingredientsList) {
    result.push(
    <>
        {props.modalShow.ingredientsList.map((breakpoint) => (
        <ListGroup key={breakpoint} horizontal className="my-2">
            <ListGroup.Item>{(breakpoint.amount/props.modalShow.numberOfPortions*modalData.numberOfPortions).toFixed(1)}</ListGroup.Item>
            <ListGroup.Item>{breakpoint.unitOfMeasurement}</ListGroup.Item>
            <ListGroup.Item>{breakpoint.name}</ListGroup.Item>
        </ListGroup>
        ))}
    </>
    )}
        return result;
    }

   

    return (
        <Modal show={!!props.modalShow} onHide={() => props.setModalShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title> {props.modalShow.name} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <img src={"/recipeImage/get?id=" + props.modalShow.id} height={300} width={350} alt=""></img>
                        <br/>
                        <br/>
                        <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Number of portions</Form.Label>
                            <Form.Control type="number" 
                            placeholder={props.modalShow.numberOfPortions}
                            min="1"
                            defaultValue={props.modalShow.numberOfPortions}
                            onChange={(event) => {
                                setModalData(current => {
                                    const newData = { ...current };
                                    newData.numberOfPortions = event.target.value;
                                    return newData;
                                })
                            }}
                            value={modalData.numberOfPortions || props.modalShow?.numberOfPortions || ""} />
                        </Form.Group>
                        </Form>
                        <p>
                            {props.modalShow.method}  
                        </p>
                    </Col>
                    <Col>
                        {getIngredientList()}
                    </Col>
                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setModalShow(false)}>
                    Close
                </Button>
                
                <Button variant="success" onClick={() => {props.setModalShow(false); props.setUpdateFormShow(props.modalShow);}}>
                    Edit Recipe
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RecipeModal;




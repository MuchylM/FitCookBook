import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import { useState } from "react"

const IngredientForm = (props) => {
    const [formData, setFormData] = useState({});

    function createRecipe() {
        fetch("/ingredient/create", { 
                method: "POST", 
                body: JSON.stringify(formData),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(data => {
                props.setIngredientList(current => {
                    const newList = current.slice();
                    newList.push(data);
                    return newList;
                })
                props.setFormShow(false);
            })
    }

    return (
        <Modal show={!!props.formShow} onHide={() => props.setFormShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="name"
                            onChange={(event) => {
                                setFormData(current => {
                                    const newData = { ...current };
                                    newData.name = event.target.value;
                                    return newData;
                                })
                            }}
                            value={formData.name || props.formShow?.name || ""}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Unit od Measurement</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unit of measurement"
                            onChange={(event) => {
                                setFormData(current => {
                                    const newData = { ...current };
                                    newData.unitOfMeasurement = event.target.value;
                                    return newData;
                                })
                            }}
                            value={formData.unitOfMeasurement || props.formShow?.unitOfMeasurement || ""}
                            autoFocus
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Image"
                            onChange={(event) => {
                                setFormData(current => {
                                    const newData = { ...current };
                                    newData.image = event.target.value;
                                    return newData;
                                })
                            }}
                            value={formData.image || props.formShow?.image || ""}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setFormShow(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={createRecipe}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default IngredientForm;
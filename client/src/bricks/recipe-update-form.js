import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { useState } from "react"

const RecipeUpdateForm = (props) => {
    const [updateFormData, setUpdateFormData] = useState({});

    function getIngredientOptionList() {
        const result = [
            <option>Select ingredient</option>
        ];
        if (props.ingredientList) {
            props.ingredientList.forEach(ingredient => {
                result.push(<option value={ingredient.id}>{ingredient.name}</option>)
            })
        }
        return result;
    }

    function updateRecipe() {
        fetch("/recipe/update", { 
                method: "POST", 
                body: JSON.stringify(updateFormData),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(data => {
                props.setRecipeList(current => {
                    const newList = current.slice();
                    newList.push(data);
                    return newList;
                })
                props.setUpdateFormShow(false);
            })
    }

    return (
        <Modal show={!!props.updateFormShow} onHide={() => props.setUpdateFormShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title> Update Recipe </Modal.Title>
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
                                setUpdateFormData(current => {
                                    const newData = { ...current };
                                    newData.name = event.target.value;
                                    return newData;
                                })
                            }}
                            value={updateFormData.name || props.updateFormShow?.name || ""}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Number of portions</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Number of portions"
                            onChange={(event) => {
                                setUpdateFormData(current => {
                                    const newData = { ...current };
                                    newData.numberOfPortions = event.target.value;
                                    return newData;
                                })
                            }}
                            value={updateFormData.numberOfPortions || props.updateFormShow?.numberOfPortions || ""}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Ingredients</Form.Label>
                        <Row>
                        <Col md>
                        <Form.Control
                            type="text"
                            placeholder="Amount"
                            
                        />
                        </Col>
                        <Col md>
                        <Form.Select
                            aria-label="Default select example"
                            onChange={(event) => {
                                setUpdateFormData(current => {
                                    const newData = { ...current };
                                    newData.ingredientsList = [event.target.value];
                                    return newData;
                                })
                            }}
                            value={updateFormData.ingredientsList?.[0] || props.updateFormShow?.ingredientsList?.[0] || undefined}
                        >
                            {getIngredientOptionList()}
                        </Form.Select>
                        </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Method</Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea"
                            rows={6}
                            placeholder="Method"
                            onChange={(event) => {
                                setUpdateFormData(current => {
                                    const newData = { ...current };
                                    newData.method = event.target.value;
                                    return newData;
                                })
                            }}
                            value={updateFormData.method || props.updateFormShow?.method || ""}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setUpdateFormShow(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={updateRecipe}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RecipeUpdateForm;
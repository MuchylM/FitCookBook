import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import { useState, useEffect } from "react"

const RecipeForm = (props) => {
    const [formData, setFormData] = useState([]);
    const [dataIngredients, setDataIngredients] = useState(null)
    const [ingredientData, setIngredientData] = useState([]);
    const [toggleIngredient, setToggleIngredient] = useState(false)
    const [createIngredient, setCreateIngredient] = useState({ amount: 0 })

    useEffect(() => {
        if (typeof input === "undefined") {
            setDataIngredients(props.ingredientList)
        }
    }, [props.ingredientList])

    function createRecipe(json) {
        fetch("/recipe/create", {
            method: "POST",
            body: JSON.stringify(json),
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
                props.setFormShow(false);
            })
    }

    const handleUpdateAmount = (idx, value) => {
        const newArr = [...ingredientData]
        newArr[idx].amount = value

        setIngredientData(newArr);
    }

    const handleRemoveIngredient = (idx) => {
        const newIngredients = [...ingredientData]

        newIngredients.splice(idx, 1);
        setIngredientData(newIngredients)
    }

    const handleNewIngredient = () => {
        setDataIngredients(prev => [...prev, createIngredient])

        setCreateIngredient({ amount: 0 })
        setToggleIngredient(false)
    }

    const handleSubmit = () => {
        setFormData(current => {
            const newData = { ...current };
            newData = ingredientData;
            return newData;
        });

        createRecipe(formData);
    }

    return (
        <Modal show={!!props.formShow} onHide={() => props.setFormShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title> Create Recipe </Modal.Title>
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
                            }
                            }
                            value={formData.name || props.formShow?.name || ""}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Number of portions</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Number of portions"
                            onChange={(event) => {
                                setFormData(current => {
                                    const newData = { ...current };
                                    newData.numberOfPortions = event.target.value;
                                    return newData;
                                })
                            }}
                            value={formData.numberOfPortions || props.formShow?.numberOfPortions || ""}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Ingredients</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            onChange={(event) => {
                                setIngredientData(prev => [...ingredientData, { name: event.target[event.target.selectedIndex].dataset.name, unitOfMeasurement: event.target[event.target.selectedIndex].dataset.units, amount: 0, healthyIngredient: event.target[event.target.selectedIndex].dataset.healty }])
                            }}
                            value={formData.ingredientsList?.[0] || props.formShow?.ingredientsList?.[0] || undefined}
                        >
                            <>
                                <option>Select ingredient</option>
                                {dataIngredients ? dataIngredients.map((item, idx) => {
                                    return <option data-healty={item.healthyIngredient} data-name={item.name} data-units={item.unitOfMeasurement}>{`${item.name}`}</option>
                                }) : null}
                            </>
                        </Form.Select>
                    </Form.Group>
                    <div className="d-grid">
                        <Button className="mb-3" onClick={() => setToggleIngredient(!toggleIngredient)}>Add Ingredient</Button>
                    </div>
                    <div className={`mb-3 p-3 border border-primary ${!toggleIngredient && 'd-none'}`}>
                        <div className="row mb-3">
                            <div className="col-3">
                                <p className="mt-0 mb-1">Name</p>
                            </div>
                            <div className="col-9">
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    onChange={(e) => setCreateIngredient({ ...createIngredient, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-3">
                                <p className="mt-0 mb-1">Units</p>
                            </div>
                            <div className="col-9">
                                <Form.Control
                                    type="text"
                                    placeholder="Units"
                                    onChange={(e) => setCreateIngredient({ ...createIngredient, unitOfMeasurement: e.target.value })}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-3">
                                <p className="mt-0 mb-1">Healthy</p>
                            </div>
                            <div className="col-9">
                                <Form.Check type="checkbox" onChange={(e) => setCreateIngredient({ ...createIngredient, healthyIngredient: e.target.checked })} />
                            </div>
                        </div>
                        <Button onClick={handleNewIngredient}>Publish</Button>
                    </div>
                    {ingredientData.map((ingredient, idx) => {
                        return (
                            <div className="mb-3 p-3 border border-primary">
                                <p className="h6 font-weight-bold mb-3">{ingredient.name}</p>
                                <div>
                                    <div>
                                        <div className="row mb-3">
                                            <div className="col-3">
                                                <p className="mt-0 mb-1">Units</p>
                                            </div>
                                            <div className="col-9">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Amount"
                                                    value={ingredient.unitOfMeasurement}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-3">
                                                <p className="mt-0 mb-1">Amount</p>
                                            </div>
                                            <div className="col-9">
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Amount"
                                                    onChange={(e) => handleUpdateAmount(idx, e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => handleRemoveIngredient(idx)}>REMOVE</Button>
                            </div>
                        )
                    })}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Method</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Method"
                            onChange={(event) => {
                                setFormData(current => {
                                    const newData = { ...current };
                                    newData.method = event.target.value;
                                    return newData;
                                })
                            }}
                            value={formData.method || props.formShow?.method || ""}
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
                <Button variant="secondary" onClick={() => { props.setFormShow(false); setIngredientData([]) }}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal >
    );
}

export default RecipeForm;
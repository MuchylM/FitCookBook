import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { useState, useEffect } from 'react'
import ModalHeader from 'react-bootstrap/esm/ModalHeader'

const RecipeForm = (props) => {
    const { formShow, setFormShow, ingredientList } = props

    const [outputData, setOutputData] = useState({
        name: '',
        numberOfPortions: 0,
        ingredientsList: [],
        method: '',
        image: ''
    })
    const [createIngredient, setCreateIngredient] = useState({})
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [loading, setLoading] = useState(true)
    const [ingredients, setIngredients] = useState([])
    const [displayCreateIngredient, setDisplayCreateIngredient] = useState(false)

    useEffect(() => {
        if (ingredientList) {
            setLoading(false)
            setIngredients(ingredientList)
        }
    }, [loading, ingredientList])

    useEffect(() => {
        setOutputData({ ...outputData, ingredientsList: selectedIngredients })
    }, [selectedIngredients])

    function createRecipe(data) {
        fetch("/recipe/create", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
    }

    const handleCreationOfIngredient = () => {
        setCreateIngredient({ ...createIngredient, amount: 0 })
        setIngredients([...ingredients, createIngredient])
        setCreateIngredient({})
        setDisplayCreateIngredient(false)
    }

    const handleChangeAmount = (e, name) => {
        setSelectedIngredients(
            selectedIngredients.map(item =>
                item.name === name
                    ? { ...item, amount: e.target.valueAsNumber }
                    : item
            ))
    }

    const handleDeleteIngredient = (name) => {
        setSelectedIngredients(
            selectedIngredients.filter(t => t.name !== name)
        );
    }

    const handleSaveChanges = () => {
        createRecipe(outputData)
        setFormShow(false)
        setCreateIngredient({})
    }

    return (
        <Modal show={!!formShow} onHide={() => setFormShow(false)}>
            <ModalHeader closeButton>
                <Modal.Title>Create Recipe</Modal.Title>
            </ModalHeader>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type={'text'}
                            placeholder={'Name'}
                            autoFocus
                            onChange={(e) => setOutputData({ ...outputData, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Number Of Portions</Form.Label>
                        <Form.Control
                            type={'number'}
                            placeholder={'Number Of Portions'}
                            onChange={(e) => setOutputData({ ...outputData, numberOfPortions: e.target.valueAsNumber })}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Ingredients</Form.Label>
                        <Form.Select
                            onChange={(e) => {
                                const selectedItem = ingredients[e.target.selectedIndex - 1]

                                setSelectedIngredients((prev) => [
                                    ...prev,
                                    {
                                        name: selectedItem.name,
                                        unitOfMeasurement: selectedItem.unitOfMeasurement,
                                        healthyIngredient: selectedItem.healthyIngredient,
                                        amount: 0
                                    }
                                ])
                            }}
                        >
                            <>
                                <option disabled>Select ingredient</option>
                                {loading ? (
                                    <option>Loading Ingredients...</option>
                                ) : (
                                    ingredients.map((item, idx) => {
                                        return <option>{item.name}</option>
                                    })
                                )}
                            </>
                        </Form.Select>
                        <div className='mt-2'>
                            {selectedIngredients.map((item, idx) => {
                                return (
                                    <div className='mb-3'>
                                        <div className='px-3 py-2 border border-gray-400 rounded'>
                                            <label className='mb-2'>
                                                <strong>{item.name}</strong>
                                            </label>
                                            <div>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>Units</Form.Label>
                                                    <Form.Control
                                                        type='text'
                                                        placeholder={'Unit Of Measurement'}
                                                        value={item.unitOfMeasurement}
                                                        disabled
                                                    />
                                                </Form.Group>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>Amount</Form.Label>
                                                    <Form.Control
                                                        type='number'
                                                        placeholder={'Amount'}
                                                        onChange={(e) => handleChangeAmount(e, item.name)}
                                                    />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Healthy Ingredient?</Form.Label>
                                                    <Form.Check type='switch' checked={item.healthyIngredient} disabled />
                                                </Form.Group>
                                                <div className='d-grid mt-2'>
                                                    <Button variant="danger"className='mb-3' onClick={(e) => handleDeleteIngredient(item.name)}>
                                                        Remove Ingredient
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='d-grid mt-2'>
                            <Button
                                variant="success"
                                className='mb-3'
                                onClick={() => setDisplayCreateIngredient(!displayCreateIngredient)}
                            >
                                New Ingredient
                            </Button>
                        </div>
                        <div className={`mb-3 ${!displayCreateIngredient && 'd-none'}`}>
                            <div className='px-3 py-2 border border-gray-400 rounded'>
                                <Form.Label>
                                    <strong>Create New Ingredient</strong>
                                </Form.Label>
                                <div>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={'Name'}
                                            autoFocus
                                            onChange={(e) =>
                                                setCreateIngredient({ ...createIngredient, name: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Units</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={'Unit Of Measurement'}
                                            onChange={(e) =>
                                                setCreateIngredient({
                                                    ...createIngredient,
                                                    unitOfMeasurement: e.target.value
                                                })
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Healthy Ingredient?</Form.Label>
                                        <Form.Check
                                            type='switch'
                                            onChange={(e) =>
                                                setCreateIngredient({
                                                    ...createIngredient,
                                                    healthyIngredient: e.target.checked
                                                })
                                            }
                                        />
                                    </Form.Group>
                                    <div className='d-grid mt-2'>
                                        <Button variant="success" className='mb-3' onClick={handleCreationOfIngredient}>
                                            Add ingredient to list
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Method</Form.Label>
                        <Form.Control
                            type={'text'}
                            placeholder={'Method'}
                            onChange={(e) => setOutputData({ ...outputData, method: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type={'text'}
                            placeholder={'Image'}
                            onChange={(e) => setOutputData({ ...outputData, image: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={() => setFormShow(false)}>
                    Close
                </Button>
                <Button variant='success' onClick={handleSaveChanges}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RecipeForm

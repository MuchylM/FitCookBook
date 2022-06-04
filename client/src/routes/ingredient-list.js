import '../App.css';

import { useEffect, useState } from "react";
import IngredientTile from "../bricks/ingredient-tile";
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import IngredientForm from '../bricks/ingredient-form';

const IngredientList = () => {
    const [ingredientList, setIngredientList] = useState();
    const [formShow, setFormShow] = useState(false);

    useEffect(() => {
        fetch('/ingredient/list')
            .then(response => response.json())
            .then(data => setIngredientList(data))
    }, [])

    function getIngredientHtmlList() {
        const ingredientHtmlList = [];
        ingredientList.forEach(ingredient => {
            ingredientHtmlList.push(<IngredientTile ingredient={ingredient} setFormShow={setFormShow}/>)
        })
        return ingredientHtmlList;
    }

    function getChild() {
        let child;
        if (!ingredientList) {
            child = "loading";
        } else if (ingredientList) {
            child = getIngredientHtmlList();
        }
        return child;
    }

    return (
        <>
            <IngredientForm formShow={formShow} setFormShow={setFormShow} ingredientList={ingredientList} setIngredientList={setIngredientList}/>
            <Button variant="success" onClick={() => setFormShow(true)}>
                <Icon path={mdiPlus} size={1} />
                Create Ingredient
            </Button>
            <Row xs={1} md={2} className="g-4">
                {getChild()}
            </Row>
        </>
    )
}

export default IngredientList;
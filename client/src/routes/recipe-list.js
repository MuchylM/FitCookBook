import '../App.css';

import { useEffect, useMemo, useState } from "react";
import RecipeTile from "../bricks/recipe-tile";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Icon from '@mdi/react'
import { mdiPlus, mdiCheck } from '@mdi/js'
import RecipeForm from '../bricks/recipe-form';
import RecipeModal from '../bricks/recipe-modal';
import RecipeUpdateForm from '../bricks/recipe-update-form';
import RecipeVerify from '../bricks/recipe-verify';



const RecipeList = () => {
    const [recipeList, setRecipeList] = useState();
    const [ingredientList, setIngredientList] = useState();
    const [filterData, setFilterData] = useState({filter:""});
    const [ingredientFilter, setIngredientFilter] = useState({filter:""});
    const [formShow, setFormShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [verifyShow, setVerifyShow] = useState(false);

    useEffect(() => {
        fetch('/recipe/list')
            .then(response => response.json())
            .then(data => setRecipeList(data))

        fetch('/ingredient/list')
            .then(response => response.json())
            .then(data => setIngredientList(data))
    }, [])

    const ingredientMap = useMemo(() => {
        if (ingredientList) {
            const result = {};
            ingredientList.forEach(ingredient => result[ingredient.id] = ingredient);
            return result;
        }
    }, [ingredientList])

    function getRecipeHtmlList(filter, ingredientFilter) {
        const recipeHtmlList = [];
        if(filter === "" && ingredientFilter === ""){
            recipeList.forEach(recipe => {
                recipeHtmlList.push(<RecipeTile recipe={recipe} ingredientMap={ingredientMap} setModalShow={setModalShow} setUpdateFormShow={setUpdateFormShow} setVerifyShow={setVerifyShow}/>)
            })
            return recipeHtmlList;
        }
        if(filter !== "" && ingredientFilter === ""){
        recipeList.forEach(recipe => {
            if(recipe.name.toLowerCase().includes(filter.toLowerCase())){
                recipeHtmlList.push(<RecipeTile recipe={recipe} ingredientMap={ingredientMap} setModalShow={setModalShow} setUpdateFormShow={setUpdateFormShow} setVerifyShow={setVerifyShow}/>)
            }
        })
        return recipeHtmlList;
        }
        if(ingredientFilter !== "" && filter === ""){
        recipeList.forEach(recipe => {
            recipe.ingredientsList.forEach(ingredient => {
                if(ingredient.name.toLowerCase().includes(ingredientFilter.toLowerCase())){
                    recipeHtmlList.push(<RecipeTile recipe={recipe} ingredientMap={ingredientMap} setModalShow={setModalShow} setUpdateFormShow={setUpdateFormShow} setVerifyShow={setVerifyShow}/>)
            }})})
        return recipeHtmlList;
        }
    }

    function getChild(filter, ingredientFilter) {
            let child;
            if (!recipeList) {
                child = "loading";
            } else if (recipeList) {
                child = getRecipeHtmlList(filter, ingredientFilter);
            }
            return child;
        
    }

    return (
        <>
            <RecipeForm formShow={formShow} setFormShow={setFormShow} ingredientList={ingredientList} setRecipeList={setRecipeList}/>
            <RecipeUpdateForm updateFormShow={updateFormShow} setUpdateFormShow={setUpdateFormShow} ingredientList={ingredientList} setRecipeList={setRecipeList}/>
            <RecipeModal modalShow={modalShow} setModalShow={setModalShow} setUpdateFormShow={setUpdateFormShow} ingredientList={ingredientList} setRecipeList={setRecipeList}/>
            <RecipeVerify verifyShow={verifyShow} setVerifyShow={setVerifyShow} ingredientList={ingredientList} setRecipeList={setRecipeList} />
            <Row>
            <Col className="mb-1 mt-1 px-3 py-2">
                <Button variant="success" onClick={() => setFormShow(true)}>
                    <Icon path={mdiPlus} size={1} />
                    &nbsp;
                    Create Recipe
                </Button>
                &nbsp; 
                <Button variant="success" onClick={() => setVerifyShow(true)}>
                    <Icon path={mdiCheck} size={1} />
                    &nbsp;
                    Verify Recipe
                </Button>
            </Col>
            <Col md={4} className="mb-1 mt-2 px-3 py-2">
                <Form.Control 
                    type="text" 
                    placeholder="Search recipe by name"
                    
                    onChange={(event) => {
                        setFilterData(current => {
                            const newData = { ...current };
                            newData.filter = event.target.value;
                            return newData;
                        })
                    }}
                    value={filterData.filter || ""}
                    
                    autoFocus
                />
            </Col>
            <Col md={4} className="mb-1 mt-2 px-3 py-2">
                <Form.Control 
                    type="text" 
                    placeholder="Search recipe by ingredient"
                    onChange={(event) => {
                        setIngredientFilter(current => {
                            const newData = { ...current };
                            newData.filter = event.target.value;
                            return newData;
                        })
                    }}
                    value={ingredientFilter.filter || ""}
                    autoFocus
                />
            </Col>
            </Row>
            <Row xs={1} md={4} className="g-4">
                {getChild(filterData.filter, ingredientFilter.filter)}
            </Row>
        </>
    )
}

export default RecipeList;
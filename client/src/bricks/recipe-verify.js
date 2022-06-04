import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { useState, useEffect } from "react"
import UnverifiedRecipeTile from '../bricks/unverified-recipe-tile';

const RecipeVerify = (props) => {
    const [verifyData, setVerifyData] = useState({});
    const [unverifiedRecipeList, setUnverifiedRecipeList] = useState();
    
    useEffect(() => {
        fetch('/recipe/listUnverified')
        .then(response => response.json())
        .then(data => setUnverifiedRecipeList(data))
    }, []);
    
    
    function getUnverifiedRecipeHtmlList() {
        const unverifiedRecipeHtmlList = [];
        unverifiedRecipeList.forEach(recipe => {
            unverifiedRecipeHtmlList.push(<UnverifiedRecipeTile recipe={recipe}/>)
        })
        return unverifiedRecipeHtmlList;
    }

    function getUnverifiedChild() {
        let child;
        if (!unverifiedRecipeList) {
            child = "loading";
        } else if (unverifiedRecipeList) {
            child = getUnverifiedRecipeHtmlList();
        }
        return child;
    }

   

    return (
        <Modal show={!!props.verifyShow} onHide={() => props.setVerifyShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title> Verify Recipes </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Col>
                    <Row xs={1} md={4} className="g-4">
                    {getUnverifiedChild()}
                    </Row>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setVerifyShow(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RecipeVerify;




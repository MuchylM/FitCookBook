import '../App.css';
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"


const UnverifiedRecipeTile = (props) => {
    
    function verifyRecipe(id, status){
        let payload = {"id" : id, "verificationStatus" : status};
        fetch("/recipe/verify", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    return (
        <Col>
            <Card >
                <Card.Img variant="bottom" src={"/recipeImage/get?id=" + props.recipe.id} height={100} width={100} />
                <Card.Body>
                    <Card.Title className='mb-2'>Name : {props.recipe.name}</Card.Title>
                    <Card.Text className='mb-1'>Portions : {props.recipe.numberOfPortions}</Card.Text>
                    <Card.Text className='mb-1'>
                        Method : {props.recipe.method}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Row>
                    <Button variant="success" onClick={() => {verifyRecipe(props.recipe.id, true); props.setHandleVerify((current) => current = !current)}}>Verify</Button>
                    </Row>
                    <Row>
                    <Button variant="danger"onClick={() => verifyRecipe(props.recipe.id, false)}>Discard</Button>
                    </Row>
                    
                </Card.Footer>
            </Card>
        </Col>
    )
}

export default UnverifiedRecipeTile;
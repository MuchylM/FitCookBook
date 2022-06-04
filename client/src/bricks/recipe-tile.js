import '../App.css';
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"


const RecipeTile = (props) => {

    return (
        <Col>
            <Card border="success">
                <Card.Img variant="bottom" src={"/recipeImage/get?id=" + props.recipe.id} height={200} width={200} />
                <Card.Body>
                    <Card.Title className='mb-2'>{props.recipe.name}</Card.Title>
                </Card.Body>
                <Card.Footer>
                <Button variant="success" onClick={() => props.setModalShow(props.recipe)}>See Recipe</Button>
                </Card.Footer>
            </Card>
        </Col>
    )
}

export default RecipeTile;
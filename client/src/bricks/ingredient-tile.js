import '../App.css';
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

const IngredientTile = (props) => {

    function getIngredientList() {
        const result = [];
        props.forEach(ingredientId => {
            const ingredient = props.ingredientMap[ingredientId];
            result.push( ingredient.name + "  Units: " + ingredient.unitOfMeasurement + "  Healthy ingredient: " + ingredient.healthyIngredient)
        })
        return result.join(", ");
    }

    return (
        <Col>
            <Card>
                <Card.Body>
                    <Card.Title>{props.ingredient.name}</Card.Title>
                    <Card.Text>
                        Units: {props.ingredient.unitOfMeasurement}<br/>
                        {props.ingredientMap && getIngredientList()}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button onClick={() => props.setFormShow(props.ingredient)}>update</Button>
                </Card.Footer>
            </Card>
        </Col>
    )
}

export default IngredientTile;
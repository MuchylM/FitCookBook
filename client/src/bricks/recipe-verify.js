import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

const RecipeVerify = (props) => {    
    return (
        <Modal show={!!props.verifyShow} onHide={() => props.setVerifyShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title> Verify Recipes </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Col>
                    <Row xs={1} md={4} className="g-4">
                    {props.getUnverifiedChild()}
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




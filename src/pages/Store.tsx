import { Col, Row } from "react-bootstrap"
import storeItems from "../data/items.json"
import { StoreItem } from "../components/StoreItem"

export function Store(){
    return(
        <>
        <h1>Welcome to the Store!</h1>
        <Row className="g-3" xs={1} md={2} lg={3}>
            {storeItems.map(item => (
                <Col key={item.id}>
                    {/* {JSON.stringify(item)} <==> This line would just get the Stringified version of our Objects */}
                    <StoreItem {...item}/>
                </Col>
            ))}
        </Row>
        </>
    )
}
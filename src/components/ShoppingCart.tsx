import { Offcanvas, Stack, Modal, Button } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";
import { CartItem } from "./CartItem";
import { useState } from "react";
import storeItems from "../data/items.json"

type ShoppingCartProps = {
    isOpen: boolean
}

export function ShoppingCart({isOpen}: ShoppingCartProps){

    const { closeCart, cartItems, checkoutCart } = useShoppingCart()
    const [checkoutCompleted, setCheckoutCompleted] = useState(false)
    const [total, setTotal] = useState(0)

    function handleCheckout(){
        if(cartItems.length <= 0){
            console.log("Cart is Empty.")
        }else{
            const totalValue = cartItems.reduce((total, cartItem) => {
                const item = storeItems.find((i) => i.id === cartItem.id)
                return total + (item?.price || 0) * cartItem.quantity
            }, 0)
            setTotal(totalValue)
            checkoutCart()
            setCheckoutCompleted(true)
        }
    }

    function handleClosePopup(){
        setCheckoutCompleted(false)
        closeCart()
    }

    return(
        <Offcanvas show={isOpen} onHide={closeCart} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.map(item => (
                        <CartItem key={item.id} {...item}/>
                    ))}
                    <div className="ms-auto fw-bold fs-5">
                        Total: {formatCurrency(
                            cartItems.reduce((total, cartItem) => {
                                const item = storeItems.find(i => i.id === cartItem.id)
                                return total + (item?.price || 0) * cartItem.quantity
                            }, 0)
                        )}
                    </div>
                    <button onClick={handleCheckout}>Checkout</button>
                </Stack>
                <hr/>
                {checkoutCompleted && (
                    <div
                    className="modal show"
                    style={{ display: 'block', position: 'initial' }}
                  >
                    <Modal.Dialog>
                      <Modal.Header>
                        <Modal.Title>Thanks For Your Purchase!</Modal.Title>
                      </Modal.Header>
              
                      <Modal.Body>
                        <p>Your products have been sent to your home
                            and should arrive in 2 to 3 days.
                        </p>
                        <p>Your total was: <strong>{formatCurrency(total)}</strong></p>
                      </Modal.Body>
              
                      <Modal.Footer>
                        <Button onClick={handleClosePopup} variant="primary">OK</Button>
                      </Modal.Footer>
                    </Modal.Dialog>
                  </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    )
}
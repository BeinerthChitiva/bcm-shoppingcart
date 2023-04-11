import { createContext, useContext, ReactNode, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

//ReactNode is the Type we give to the Children Property in React
type ShoppingCartProviderProps = {
    children: ReactNode
}
//Type of Shopping Cart Context
type ShoppingCartContext = {
    //These are four functions that handle the Cart's Functionality
    //Gets Item Quantity, taking in ID of item we want and => Returning the Quantity of the Item in the Cart
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    checkoutCart: () => void
    cartQuantity: number
    cartItems: CartItem[]
}

//Type Cart Item
type CartItem = {
    id: number
    quantity: number
}


//Here we create the Shopping Cart Context, as an empty Object
const ShoppingCartContext = createContext({} as ShoppingCartContext)

//This is our CUSTOM HOOK, for getting our Context.
//We export it to use errywhere and pass it the ShoppingCartContext.
export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

/////////////////////////////////////////////////////////////////
//Function that implements the Provider for ShoppingCartContext,
//It gives the values we need and the code for rendering out ShoppingCart
//When we click on it.

//Function takes in children, and we re-render them.
//Because everytime we use a Provider, the Provider needs to have Objects and Children inside of it,
//So we're creating a wrapper around context that has the Children Object.
//The function returns the ShoppingCartContext.Provider we give it an initial value of empty object, and inside render the Children.
export function ShoppingCartProvider({children}: ShoppingCartProviderProps){

    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    //For each item, we take (quantity, item) and return => item.quantity + quantity. Default to 0.
    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
    )

    function getItemQuantity(id: number){
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    //If the item isn't in the Cart, spread the other cart items and also add the current one to it.
    //Else if Item.id===id, then Item is in cart, so add +1 to Cart.
    function increaseCartQuantity(id: number){
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id) == null){
                return [...currItems, {id, quantity: 1}]
            }else{
                return currItems.map(item => {
                    if(item.id === id){
                        return {...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }
    //If item in Cart only once, filter it out. If item doesn't exist, it still works.
    //Second part is the same as increase, but if item exists, just delete by one.
    function decreaseCartQuantity(id: number){
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1){
                return currItems.filter(item => item.id !== id)
            }else{
                return currItems.map(item => {
                    if(item.id === id){
                        return {...item, quantity: item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number){
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }

    function checkoutCart(){
        setCartItems(currItems => {
            return []
        })
    }

    return(
        <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity,decreaseCartQuantity, removeFromCart, checkoutCart, cartItems, cartQuantity, openCart, closeCart}}>
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    ) 
}
/////////////////////////////////////////////////////////////////


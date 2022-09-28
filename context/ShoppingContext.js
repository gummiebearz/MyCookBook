import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import { getStripe } from '../utils/stripe'

const cookbookKey = process.env.NEXT_PUBLIC_COOKBOOK_CART

export const ShoppingContext = createContext()
export const ShoppingProvider = ({ children }) => {
    const { user, isLoggedIn } = useContext(CurrentUserContext)
    const router = useRouter()
    const [cart, setCart] = useState([])

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(cookbookKey))
        if (items && items.length > 0) setCart((prevState) => items)
    }, [])

    const addItemToCart = (item) => {
        if (!isLoggedIn) throw Error('Not Authorized. Please log in to shop!')

        let newCart = [...cart]
        if (cart.length > 0) {
            let found = cart.find((itm) => itm.id === item.id)
            if (found) throw Error('Already in cart')

            newCart = [...newCart, item]
            setCart(() => newCart)
        } else {
            newCart = [...newCart, item]
            setCart(() => newCart)
        }

        localStorage.setItem(cookbookKey, JSON.stringify(newCart))
    }

    const removeItemFromCart = (itemId) => {
        let newCart = [...cart]
        newCart = newCart.filter((item) => item.id !== itemId)
        setCart(() => newCart)
        localStorage.setItem(cookbookKey, JSON.stringify(newCart))
    }

    const clearCart = () => {
        setCart(() => [])
        localStorage.removeItem(cookbookKey)
    }

    const createCheckoutSession = async () => {
        try {
            const stripe = await getStripe()
            const response = await fetch('/api/checkout-session', {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                method: 'POST',
                body: JSON.stringify({
                    lineItems: cart,
                    customerEmail: user?.user_data?.email
                })
            })

            const data = await response.json()
            stripe.redirectToCheckout({
                sessionId: data.session.id
            })
        } catch (error) {
            router.push('/checkout?canceled=true')
        }
    }

    return (
        <ShoppingContext.Provider
            value={{
                cart,
                addItemToCart,
                removeItemFromCart,
                clearCart,
                createCheckoutSession
            }}
        >
            {children}
        </ShoppingContext.Provider>
    )
}

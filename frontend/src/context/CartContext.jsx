import { createContext, useContext, useState, useEffect, createRef } from 'react';
import { authFetch, getAccessToken } from '../utils/auth';

const CartContext = createContext();

export const createProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

   
   
    // Fetch Cart
    const fetchCart = async () => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/`)
            // if (!res.ok) {
            //     throw new Error("Faild to fetch cart");
            // }

            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);

        } catch (error) {
            console.error("Error fetching cart!", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

     // Add To Cart
     const addToCart = async (productId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/add/`, 
                { 
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ product_id: productId }),
                  
                });
                fetchCart();
        
        } catch (error) {
            console.error("Error adding to cart!", error);
        }
    };


    // Romove product from cart
     const  removeFromCart = async (itemId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/remove/`, 
                { 
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ item_id: itemId }),
                });
                fetchCart();
        
        } catch (error) {
            console.error("Error remove to cart!", error);
        }
    };

    // Update quantity
    const updateQuantity = async(itemId, quantity) => {
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }

        try {
            await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ item_id: itemId }),

            });
            fetchCart();

        } catch (error) {
            console.error("Error updating quantity", error);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    }


    return (
        <CartContext.Provider
           value = {{cartItems, total, fetchCart, addToCart, removeFromCart, updateQuantity}}
        >
        {children}
        </CartContext.Provider>
    );


};
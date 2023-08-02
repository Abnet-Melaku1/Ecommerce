import { init } from "next/dist/compiled/@vercel/og/satori"
import { createContext, useReducer } from "react"
export const context = createContext()
const initialState = { cart: { cartItems: [] } }

const reducer = (state, action) => {
  switch (state.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload
      const isItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      )
      const cartItems = isItem
        ? state.cart.cartItems.map((item) =>
            item.name === isItem.name ? newItem : item
          )
        : [state.cart.cartItems]
      return { state, cart: { ...state.cart, cartItems } }
    }
    default:
      return state
  }
}
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <context.Provider value={value}>{children}</context.Provider>
}

import Cookies from "js-cookie"

export const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
}

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload

      const isItemExist = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      )
      const cartItems = isItemExist
        ? state.cart.cartItems.map((item) =>
            item.name === isItemExist.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem]
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }))
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case "REMOVE_CART_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      )
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }))
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case "INCREASE_QUANTITY": {
      const updatedCartItems = state.cart.cartItems.map((item) =>
        item.slug === action.payload.slug
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      Cookies.set(
        "cart",
        JSON.stringify({ ...state.cart, cartItems: updatedCartItems })
      )
      return { ...state, cart: { ...state.cart, cartItems: updatedCartItems } }
    }

    case "DECREASE_QUANTITY": {
      const updatedCartItems = state.cart.cartItems.map((item) =>
        item.slug === action.payload.slug
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      Cookies.set(
        "cart",
        JSON.stringify({ ...state.cart, cartItems: updatedCartItems })
      )
      return { ...state, cart: { ...state.cart, cartItems: updatedCartItems } }
    }
    case "CART_RESET": {
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      }
    }
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      }
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      }
    default:
      return state
  }
}
export default reducer

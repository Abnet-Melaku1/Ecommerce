export const initialState = { cart: { cartItems: [] } }
console.log("rendered")
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload

      const isItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      )
      const cartItems = isItem
        ? state.cart.cartItems.map((item) =>
            item.name === isItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem]
      return { state, cart: { ...state.cart, cartItems } }
    }
    default:
      return state
  }
}
export default reducer

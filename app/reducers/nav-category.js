const category = (state = {}, action) => {
  console.log(state, action);
  switch (action.type) {
    case 'EXPAND_CATEGORY':
      return { expand: state.expand === action.expand ? false : action.expand }
    default:
      return state
  }
}

export default category

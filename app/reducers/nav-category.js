const category = (state = {}, action) => {
  switch (action.type) {
    case 'EXPAND_CATEGORY':
      return {
        expand: state.expand === action.expand ? false : action.expand,
        manifest: state.manifest
      }
    default:
      return state
  }
}

export default category

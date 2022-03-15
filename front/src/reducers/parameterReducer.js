const reducer = (state = ['general', 'All users', 'No limit'], action) => {
  switch(action.type) {
  case 'CHANGE_PARAMS':
    return action.data
  default:
    return state
  }
}

export default reducer


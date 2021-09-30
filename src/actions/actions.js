export const ACTIONS = {
    GET_USER_DATA: 'GET_USER_DATA',
}

export const getUserData = (dataAboutTheUser) => {
    return {
        type: ACTIONS.GET_USER_DATA,
        payload: dataAboutTheUser
    }
}
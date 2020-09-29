import React from "react";
import store from './bd.js'

export const ContextApp = React.createContext();

export const initialState = store.store;

export const reducer = (state, action) => {
    switch(action.type) {
        case 'new':
            return {
                ...state,
                other: {
                    ...state.other,
                    currentId: Object.keys(action.payload)[0]
                },
                products: {
                    ...state.products,
                    ...action.payload
                }
            };
        case 'update': 
            return {
                ...state,
                products: {
                    ...state.products,
                    [action.payload.id]: {
                        ...state.products[action.payload.id],
                        [action.payload.element]: action.payload.value
                    }
                }
            }
        case 'delete':
            const deletedItem = {}
            Object.assign(deletedItem, state.products[action.payload.id])
            const date = Date.now()
            delete state.products[action.payload.id]
            return {
                ...state,
                other: {
                    ...state.other,
                    deletedProducts: {
                        ...state.other.deletedProducts,
                        [action.payload.id]: {
                            ...deletedItem,
                            daleted: date
                        }
                    }
                },
            };
        case 'relized':
            return {
                ...state,
                products: {
                    ...state.products,
                    [action.payload.id]: {
                        ...state.products[action.payload.id],
                        relized: action.payload.count
                    }
                }
            };
        case 'return':
            return {
                ...state,
                products: {
                    ...state.products,
                    [action.payload.id]: {
                        ...state.products[action.payload.id],
                        relized: action.payload.count
                    }
                }
            };
        case 'deletePersonalExpensis':
            delete state.personalExpensis[action.payload.id]
            return {
                ...state  
            };
        case 'addPersonalExpensis':
            return {
                ...state,
                personalExpensis: {
                    ...state.personalExpensis,
                    [action.payload.id]: {
                        sum: action.payload.sum,
                        description: action.payload.description
                    }
                }
            };
        case 'statistics':
            let statDate = Date.now()
            return {
                ...state,
                statistics: {
                    ...state.statistics,
                    [statDate]: {
                        ...action.payload
                    }
                }
            }

        default:
            return state
    }
};
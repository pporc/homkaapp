import React, {useContext} from 'react';
import {ContextApp} from '../store/reducer.js'

export default function PersonalExpensisRow(props) {

    const {state, dispatch} = useContext(ContextApp)

    const deleteHandler = () => {
        dispatch({
            type: 'deletePersonalExpensis',
            payload: {
                id: props.time
            }
        })
    }
    return (
        <tr>
            <td>{props.sum}<small className="text-muted float-right">{new Date(Number(props.time)).toLocaleDateString()}</small></td>
            <td>{props.description}</td>
            <td title='Удалить'>
                <svg onClick={deleteHandler} width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
					<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
				</svg>
            </td>
        </tr>
    )
}
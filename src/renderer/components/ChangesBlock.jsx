import React, {useState, useContext} from 'react';
import {ContextApp} from '../store/reducer.js'

export default function ChangesBlock({id, element, val, otherText}) {

	const {state, dispatch} = useContext(ContextApp)
	
	const [isChanged, setChanged] = useState(false)
	const [itemValue, setItemValue] = useState(val)

	const blurHandler = (e) => {
		let value;
		if (typeof e.target.value === 'number') {
			value = Math.sign(e.target.value) === -1 ? -e.target.value : e.target.value
		} else {
			value = e.target.value
		}
		
		setItemValue(value)
		setChanged(false)
		dispatch({
			type: 'update',
			payload: {
				id,
				element,
				value
			}
		})
	}

	const keyDownHandler = (e) => {
		let value;
		if (typeof e.target.value === 'number') {
			value = Math.sign(e.target.value) === -1 ? -e.target.value : e.target.value
		} else {
			value = e.target.value
		}

		if(e.key === 'Enter') {
			setItemValue(value)
			setChanged(false)
			dispatch({
				type: 'update',
				payload: {
					id,
					element,
					value
				}
			})
		}
	}

	return (
		<td title='Нажмите два раза для редактирования'>
			{!isChanged && <div onDoubleClick={() => setChanged(true)}>{itemValue}{otherText ? otherText : null}</div>}
			{isChanged && 
				<input 
				className='form-control'
				autoFocus
				defaultValue={itemValue} 
				onBlur={(e) => blurHandler(e)}
				onKeyDown={keyDownHandler}
				type={otherText ? 'text' : 'number'}
				/>
			}
		</td>
	);
}
import React, { useState, useEffect, useContext, useRef } from 'react';
import {ContextApp} from '../store/reducer.js'

export default function NewProduct(props) {

//TODO: fix render component after create new product
//add clear input

const {state, dispatch} = useContext(ContextApp)

const firstField = useRef(null)

const [toggle, setToggle] = useState(false)
const [submitActive, setSubmitActive] = useState(true)
const [form, setForm] = useState({
	name: '', 
	quantity: '', 
	purchasePrice: '', 
	salePrice: '',
	relized: 0,
	date: Date.now()
});

useEffect(() => {
	let error = Object.values(form).includes('')
	setSubmitActive(error);
}, [form])

useEffect(() => {
	if (toggle) {
		window.scrollBy({left: 0, top: 50, behavior: 'smooth'});
		setToggle(false)
	}
}, [toggle])

const submit = () => {

	let newId = (Number(state.other.currentId) + 1);
	dispatch({
		type: 'new',
		payload: {
			[newId]: {
				...form,
				id: newId
			}
		}
	})
	
	setForm({
		name: '', 
	quantity: '', 
	purchasePrice: '', 
	salePrice: ''
	})
	firstField.current.focus();
	setToggle(true)
};

const update = e => {
	let value = Math.sign(e.target.value) === -1 ? -e.target.value : e.target.value
	setForm({
		...form,
		[e.target.name]: value
	});
};

const lastFieldHandler = (e) => {
	if (e.key === 'Enter' && !submitActive) {
		submit();
	} if (e.key === 'Tab') {
		e.preventDefault()
		firstField.current.focus();
	}
}

	return (
		<tfoot>
				<tr>
					<td><input className='form-control' ref={firstField} title="Название товара" value={form.name} type="text" name="name" placeholder="Название" onChange={update}/></td>
					<td><input className='form-control' min='0' title="Закуплено" value={form.quantity} type="number" name="quantity" placeholder="Закуплено" onChange={update}/></td>
					<td>&nbsp;</td>
					<td><input className='form-control' min='0' title="Цена закупки" value={form.purchasePrice} type="number" name="purchasePrice" placeholder="Цена закупки" onChange={update}/></td>
					<td><input className='form-control' min='0' title="Цена продажи" value={form.salePrice} type="number" name="salePrice" placeholder="Цена продажи" onKeyDown={lastFieldHandler} onChange={update}/></td>
					<td colSpan='3'><button className={submitActive ? "btn btn-secondary" : "btn btn-success"} disabled={submitActive} onClick={submit}>Добавить</button></td>
				</tr>
		</tfoot>
	);
}
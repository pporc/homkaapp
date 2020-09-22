import React, {useState, useContext, useEffect, useRef} from 'react';
import {ContextApp} from '../store/reducer.js'
import PersonalExpensesRow from './PorsonalExpensisRow.jsx'
import { calcPersonalExpenses } from '../store/calc.js'

export default function PersonalExpenses(props) {

	const {state, dispatch} = useContext(ContextApp)
	const data = state.personalExpensis
	const firstField = useRef(null)
	const lastField = useRef(null)

	const [toggle ,setToggle] = useState(false)
	const [disableBtn, setDisableBtn] = useState(true)
	const [sum, setSum] = useState(0)
	const [description, setDescription] = useState('')

	useEffect(() => {
		setDisableBtn(true)
		if (sum !== 0 && description !== '') {
			setDisableBtn(false)
		}
	}, [sum, description])

	useEffect(() => {
		if (toggle) {
			window.scrollBy({left: 0, top: 50, behavior: 'smooth'});
			setToggle(false)
		}
	}, [toggle])

	const lastFieldHandler = (e) => {
		if (e.key === 'Enter' && !disableBtn) {
			submitHandler();
		} if (e.key === 'Tab' || e.key === '9') {
			e.preventDefault()
			firstField.current.focus();
		}
	}

	const submitHandler = () => {
		let newSum = 0;
		if ((sum + '')[0] === '0') {
			newSum = parseFloat((sum + '').substring(1))
			setSum(parseFloat((sum + '').substring(1)))
		} else {
			newSum = sum;
		}

		dispatch({
			type: 'addPersonalExpensis',
			payload: {
				id: Date.now(),
				sum: newSum,
				description
			}
		})
		setDescription('');
		setSum(0)
		firstField.current.focus();
		setToggle(true)
	
	}

	const fieldHandler = (e) => {
		e.target.type === 'number' ? setSum(e.target.value) : setDescription(e.target.value)
	}

	return (
		<div className="card col-md-4" style={{padding: '0'}}>
			<div className='card-header bg-info'>Персональные расходы</div>
				<table className="table table-bordered" style={{marginBottom: '0'}}>
					<thead>
						<tr>
							<td>Сумма <small className="text-muted float-right">Всего {calcPersonalExpenses(data)}грн</small></td>
							<td>Описание</td>
							<td></td>
						</tr>
					</thead>
					<tbody style={{overflow: 'scroll', maxHeight: '80vh', overflowX: 'hidden'}}>
						{data && Object.keys(data).map((val, index) => (
							<PersonalExpensesRow
								key={index}
								sum={data[val].sum}
								description={data[val].description}
								time={val}
							/>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td><input ref={ firstField } value={sum} min='0' className='form-control' type='number' onFocus={(e) => e.target.select()} onChange={fieldHandler}/></td>
							<td><input ref={ lastField } value={description} className='form-control' type='text' onKeyDown={lastFieldHandler} onChange={fieldHandler}/></td>
							<td><input type='button' className='btn btn-success' disabled={disableBtn} value='добавить' onClick={submitHandler}/></td>
						</tr>
					</tfoot>
				</table>
		</div>
	);
}
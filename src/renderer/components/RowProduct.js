import React, {useContext, useState} from 'react';
import {ContextApp} from '../store/reducer.js'
import ChangesBlock from './ChangesBlock';
import PopUp from './PopUp.jsx';
import { calcNetIncomeItem } from '../store/calc.js';

export default function RowProduct({id, name, quantity, relized = 0, purchasePrice, salePrice}) {

	const {state, dispatch} = useContext(ContextApp)
	const [showPopUp, setShowPopUp] = useState(false)
	const [relizedCount, setRelizedCount] = useState(0)
	const [returnCount, setReturnCount] = useState(0)

	const [activeTab, setActiveTab] = useState(true)
	const remainderCalc = (quantity - (relized || 0))
	const remainder = Number.isInteger(remainderCalc) ? remainderCalc : remainderCalc.toFixed(2)

	const deleteItem = (id) => {
		console.log('deleted id'+id)
		dispatch({
			type: 'delete',
			payload: {
				id: id
			}
		})
	}
	
	const relizedHandler = () => {
		dispatch({
			type: "relized",
			payload: {
				id: id,
				count: (Number(relized||0) + Number(relizedCount))
			}
		})
		closePopUp()
		setRelizedCount(0)
	}

	const closePopUp = () => {
		setShowPopUp(false)
	}

	const onChangeHandler = (e) => {
		if (e.target.value > 0 && e.target.value <= remainder) {
			setRelizedCount(e.target.value)
		} else if (remainder === 0) {
			closePopUp()
		} else if (e.target.value > remainder || e.target.value === 0) {
			e.target.value = remainder
			setRelizedCount(e.target.value)
		} else if (Math.sign(e.target.value) === -1) {
			e.target.value = -e.target.value
			setRelizedCount(-e.target.value)
		}
	}

	const onChangeReturnHandler = (e) => {
		setReturnCount(e.target.value)
	}

	const returnHandler = () => {
		if (!relized || relized < returnCount) return closePopUp(), setReturnCount(0);
		dispatch({
			type: "return",
			payload: {
				id: id,
				count: (Number(relized) - Number(returnCount))
			}
		})
		closePopUp()
		setReturnCount(0)
	}

	return (
		<tr id={id} className={remainder ? '' : 'table-danger'}>
			<ChangesBlock id={id} element='name' val={name} otherText={<small className="text-muted float-right">{remainder ? '' : 'нет в наличии'}</small>}/>
			<ChangesBlock id={id} customField={remainder} element='quantity' val={quantity}/>
			<td>{relized}
				<span title='Продать / Вернуть'>
					<svg onClick={() => setShowPopUp(true)} width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-bag-plus float-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M8 1a2.5 2.5 0 0 0-2.5 2.5V4h5v-.5A2.5 2.5 0 0 0 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5H2z"/>
						<path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"/>
					</svg>
				</span>
			</td>
			<ChangesBlock id={id} element='purchasePrice' val={purchasePrice}/>
			<ChangesBlock id={id} element='salePrice' val={salePrice}/>
			<td>{(salePrice * relized).toFixed(2) || 0}</td>
			<td>{calcNetIncomeItem(relized, salePrice, purchasePrice) || 0}</td>
			
			<td onClick={() => deleteItem(id)} title='Удалить'>
				<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
					<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
				</svg>
			</td>
			
			{showPopUp && <PopUp close={() => closePopUp()} tab={activeTab}>
				<div className='card-body'>
					<ul className="nav nav-tabs" id="myTab" role="tablist">
						<li className="nav-item" role="presentation" onClick={() => (setActiveTab(true))}>
							<span className={activeTab ? 'nav-link active': 'nav-link'} id="profile-tab">Продажа</span>
						</li>
						<li className="nav-item" role="presentation" onClick={() => (setActiveTab(false))}>
							<span className={!activeTab ? 'nav-link active': 'nav-link'} id="contact-tab">Возврат</span>
						</li>
					</ul>
					<div className="tab-content" id="myTabContent">
						<div  className={activeTab ? 'tab-pane fade show active': 'tab-pane fade'} id="home">
							<p>Введите количество товара, доступно {remainder}</p>
							<input className='form-control' type='number' disabled={!remainder} autoFocus onChange={onChangeHandler}/>
							<button className='btn btn-success' style={{marginTop: '10px'}} onClick={relizedHandler}>Подтвердить</button>
						</div>
						<div  className={!activeTab ? 'tab-pane fade show active': 'tab-pane fade'} id="profile">
							<p>Введите количество возвращаемого товара</p>
							<input className='form-control' type='number' disabled={relized === 0} autoFocus onChange={onChangeReturnHandler}/>
							<button className='btn btn-success' style={{marginTop: '10px'}} onClick={returnHandler}>Подтвердить</button>
						</div>
					</div>	
				</div>
			</PopUp>}

		</tr>
	);
}
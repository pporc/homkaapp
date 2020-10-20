import React, {useState, useContext, useEffect} from 'react'
import { Modal, Button, Table, Form, ListGroup} from 'react-bootstrap'
import { ContextApp } from '../store/reducer.js'

export default function CreateCheque() {

    const [modalShow, setModalShow] = useState(false);

    return (
        <div style={{position: 'fixed', bottom: '10px', right: '10px', backgroundColor: 'white'}}>
            <Button variant='outline-success' size='lg' onClick={() => setModalShow(true)}>Новый чек</Button>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    )
} 

function MyVerticallyCenteredModal(props) {

    const { state, dispatch } = useContext(ContextApp)
    const [products, setProducts] = useState([])
    const [chequeList, setChequeList] = useState([])
    const [chequeData, setChequeData] = useState([])
    const [sum, setSum] = useState(0)
    const [relogStateProducts, setRelogStateProducts] = useState(true)

    useEffect(() => {
        let result = [];

        Object.keys(state.products).map(val => {
            result.push(state.products[val])
        })

        setProducts(result)
    }, [state.products, relogStateProducts])

    const searchHandler = (e) => {
        if (e.target.value !== '') {
            setProducts(products.filter((val) => val.name.includes(e.target.value)))
        } else {
            let result = [];

            Object.keys(state.products).map(val => {
                result.push(state.products[val])
            })

            setProducts(result)
        }
    }

    const itemClickHandler = (value, index) => {
        setChequeList(chequeList.concat(value))
        setProducts(products.filter(v => v.id !== value.id))
    }

    const delItem = (value, index) => {
        setChequeList(chequeList.filter((item, i) => i !== index))
        setChequeData(chequeData.filter((item, i) => i !== index))
        setProducts(products.concat(value))
    }

    const callbackChequeListItemComponent = (arr) => {
        if (chequeData.some(el => el[2] === arr[2])) {
            let newState = [].concat(chequeData)
            newState[arr[2]][1] = arr[1]
            setChequeData(newState)
        } else {
            setChequeData([...chequeData, arr])
        }
    }

    const clearCheque = () => {
        setChequeList([])
        setChequeData([])
        setRelogStateProducts(!relogStateProducts)
    }

    const submitHandler = () => {
        
        chequeData.map(val => {
            dispatch({
			type: "relized",
			payload: {
				id: val[0].id,
				count: (Number(val[0].relized || 0) + Number(val[1]))
			}
		    })
        })

		dispatch({
			type: "statistics",
			payload: {
				action: 'cheque',
                data: chequeData
			}
		})
        setChequeList([])
        setChequeData([])
        props.onHide()
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Новый чек
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col-md-4">
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск"
                                    onChange={searchHandler}
                                />
                            </div>
                            <div className="col-md-8">
                                <ListGroup style={{maxHeight: '300px', overflowY: 'scroll'}}>
                                    {products.map((val, i) => (
                                        <ListGroup.Item
                                            className='chequeListItem'
                                            key={i}
                                            onClick={() => itemClickHandler(val, i)}
                                        >
                                            {val.name} <span className='float-right'>{val.salePrice}грн</span>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        </div>
                    </div>
                    <Table striped bordered hover size="sm" style={{margin: '10px'}}>
                        <thead>
                            <tr>
                                <th>Товар</th>
                                <th>Количество</th>
                                <th>Цена</th>
                                <th>Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chequeList && chequeList.map((val, i) => (
                                <ChequeListItemComponent key={i} item={val} index={i} callback={callbackChequeListItemComponent} delItem={delItem}/>
                            ))}
                            {chequeList.length == 0 && <tr style={{color: '#dc3545'}}><th style={{padding: '20px'}} colSpan='4'>Товар не выбран</th></tr>}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>К оплате: {chequeData.reduce(function(sum, arg) {
                                    return sum + (arg[1] * arg[0].salePrice)
                                    }, 0).toFixed(2)}грн
                                </th>
                                <th><input placeholder='Внесенная сумма' className='form-control' min={0} type='number' onChange={e => setSum(e.target.value)} /></th>
                                <th colSpan='2'>Сдача: {chequeData.length === 0 || sum === 0 ? 0 : (sum - chequeData.reduce(function(sum, arg) {return sum + (arg[1] * arg[0].salePrice)}, 0)).toFixed(2)}грн</th>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={submitHandler}>Подтвердить</Button>
                <Button variant="warning" onClick={clearCheque}>Очистить</Button>
            </Modal.Footer>
        </Modal>
    );
}

const ChequeListItemComponent = ({item, index, callback, delItem}) => {

    const [count, setCount] = useState(0)
    const [invalid, setInvalid] = useState(false)

    const inputHandler = (e) => {
        if (e.target.value <= (item.quantity - item.relized)) {
            setInvalid(false)
            setCount(e.target.value)
            callback([item, e.target.value, index])
        } else {
            setInvalid(true)
            setCount(item.quantity - item.relized)
        }
    }

    return (
        <tr>
            <td>{item.name} <span title='Удалить' className='float-right' onClick={() => delItem(item, index)}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
						<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
					</svg>
                </span></td>
            <td>
                <input className={invalid ? 'form-control is-invalid' : 'form-control'} placeholder='Количество' type="number" onChange={inputHandler} />
                <div className="invalid-feedback">
                    Товара на складе {item.quantity - item.relized}
                </div>
            </td>
            <td>{item.salePrice}</td>
            <td>{(item.salePrice * count).toFixed(2)}</td>
        </tr>
    )
}
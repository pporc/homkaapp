import React, {useContext, useState} from 'react'
import {ContextApp} from '../store/reducer.js'
import {Modal, Button, Card} from 'react-bootstrap'

export default function QuantityBlock({name, id, quantity, remainder}) {

    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <td style={{whiteSpace: 'nowrap'}}>
                {`${quantity} / ${remainder}`}
                <span style={{cursor: 'pointer'}} title='Пополнить склад' onClick={() => setModalShow(true)}>
                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-down-circle float-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>
                </span>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    quantity={quantity}
                    remainder={remainder}
                    id={id}
                    name={name}
                />
            </td>
        </>
    )
}

function MyVerticallyCenteredModal(props) {

    const {state, dispatch} = useContext(ContextApp)
    const [inputValue, setInputValue] = useState('')

    const inputHandler = (e) => {
      setInputValue(e.target.value)
    }

    const addNewQuantity = (val) => {
      dispatch({
        type: 'update',
        payload: {
          id: props.id,
          element: 'quantity',
          value: Number(props.quantity) + Number(val)
        }
      })
      dispatch({
        type: "statistics",
        payload: {
          name: props.name,
          id: props.id,
          action: 'addQuantity',
          oldCount: Number(props.quantity),
          newCount: Number(props.quantity) + Number(val)
        }
      })
    }

    const confirmHandler = () => {
        addNewQuantity(inputValue)
        setInputValue('')
        console.log(state)
    }

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Добавить товар '{props.name}' на склад
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card body>
            <div>Всего было закупленно: {props.quantity}</div>
            <div>Продано: {props.quantity - props.remainder}</div>
            <div>Доступно: {props.remainder}</div>
          </Card>
          <p className='mt-3 mb-1'>Введите количество нового товара:</p>
          <input className='form-control' type="number" onChange={inputHandler}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={confirmHandler} >Подтвердить</Button>
            <Button variant="secondary" onClick={props.onHide}>Отмена</Button>
        </Modal.Footer>
      </Modal>
    );
  }
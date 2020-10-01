import React, {useState, useEffect, useContext} from 'react';
import {Modal, Button} from 'react-bootstrap'
import RowProduct from './RowProduct.jsx';
import NewProduct from './NewProduct.jsx';
import PersonalExpenses from './PersonalExpenses.jsx';
import { RecentActions } from './RecentActions.jsx';
import {ContextApp} from '../store/reducer.js'

import './Body.less';

export function Body() {

  const {state, dispatch} = useContext(ContextApp)
  const [filter, setFilter] = useState('')
  const [modalShow, setModalShow] = useState(false);
  const [filteredData, setFilterData] = useState({});
  const data = state.products;

  const filterHandler = e => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    let newData = {};
    Object.keys(data).filter((element) => data[element].name.includes(filter)).map((val) => {
      for (let key in data) {
        if (key === val) {
          newData[val] = data[val]
        }
      }
    })
    setFilterData(newData)
  }, [filter, state])

  return (
    <div className='container-fluid'>
      <div className="tableAndPersonalExpenses row">
        <table className="table table-bordered col-md-8">
          <thead>
            <tr>
              <td>Название <br/><input className='form-control form-control-sm' type='text' onChange={filterHandler} placeholder='Поиск'/></td>
              <td>Закуплено / Остаток</td>
              <td>Реализовано</td>
              <td>Цена закупки</td>
              <td>Цена продажи</td>
              <td>Текущий доход</td>
              <td>Чистая прибыль</td>
              <td title='Последние действия' style={{ cursor: 'pointer', verticalAlign: 'middle' }} onClick={() => setModalShow(true)}>
                <svg style={{ margin: 'auto' }} width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-hourglass-split" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13s-.866-1.299-3-1.48V8.35z" />
                </svg>
              </td>
            </tr>
          </thead>
          <tbody>
            {data && Object.keys(filteredData).map((val, index) => {
              return <RowProduct
                key={index + Math.random(10)}
                id={filteredData[val].id}
                name={filteredData[val].name}
                quantity={filteredData[val].quantity}
                relized={filteredData[val].relized}
                purchasePrice={filteredData[val].purchasePrice}
                salePrice={filteredData[val].salePrice}
                date={filteredData[val].date}
              />
            })}
          </tbody>
          <NewProduct/>
        </table>
        <PersonalExpenses/>
      </div>
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
      <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
      />
    </div>
  );
}

function MyVerticallyCenteredModal(props) {

  const {state, dispatch} = useContext(ContextApp)

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Последние действия
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RecentActions actions={state.statistics}/>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
}

import React, {useState, useEffect, useContext} from 'react';
import {Modal, Button} from 'react-bootstrap'
import RowProduct from './RowProduct.jsx';
import NewProduct from './NewProduct.jsx';
import PersonalExpenses from './PersonalExpenses.jsx';
import { RecentActions } from './RecentActions.jsx';
import {ContextApp} from '../store/reducer.js'
import CreateCheque from './CreateСheque.jsx';

import './Body.less';

export function Body() {

  const {state, dispatch} = useContext(ContextApp)
  const [filter, setFilter] = useState('')
  const [modalShow, setModalShow] = useState(false);
  const [filteredData, setFilterData] = useState({});
  const [sortTrigger, setSortTrigger] = useState(true)
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

  const sort = (field) => {
    setSortTrigger(!sortTrigger)
    let sorted = Object.entries(data).map(([ key, val ]) => ({ ...val, id: key })).sort((a, b) => {
      if (field === 'currentIncome') {
        return sortTrigger ? (a.salePrice * a.relized || 0) - (b.salePrice * b.relized || 0) : (b.salePrice * b.relized || 0) - (a.salePrice * a.relized || 0)

      } else if (field === 'netIncome') {
        return sortTrigger ? ((a.relized * a.salePrice) - (a.relized * a.purchasePrice)) - ((b.relized * b.salePrice) - (b.relized * b.purchasePrice))
                          : ((b.relized * b.salePrice) - (b.relized * b.purchasePrice)) - ((a.relized * a.salePrice) - (a.relized * a.purchasePrice))
      } else {
        if (!sortTrigger) {
          return b[field] - a[field]
        } else {
          return a[field] - b[field]
        }
      }
    })
    setFilterData(sorted)
  }

  const sortedIcon = () => {
    if (sortTrigger) {
      return (
        <svg style={{cursor: 'pointer'}} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sort-numeric-down-alt" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11A.5.5 0 0 1 4 2z"/>
          <path fillRule="evenodd" d="M6.354 11.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L4 12.793l1.646-1.647a.5.5 0 0 1 .708 0z"/>
          <path d="M9.598 5.82c.054.621.625 1.278 1.761 1.278 1.422 0 2.145-.98 2.145-2.848 0-2.05-.973-2.688-2.063-2.688-1.125 0-1.972.688-1.972 1.836 0 1.145.808 1.758 1.719 1.758.69 0 1.113-.351 1.261-.742h.059c.031 1.027-.309 1.856-1.133 1.856-.43 0-.715-.227-.773-.45H9.598zm2.757-2.43c0 .637-.43.973-.933.973-.516 0-.934-.34-.934-.98 0-.625.407-1 .926-1 .543 0 .941.375.941 1.008zM12.438 14V8.668H11.39l-1.262.906v.969l1.21-.86h.052V14h1.046z"/>
        </svg>
      )
    } else {
      return (
        <svg style={{cursor: 'pointer'}} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sort-numeric-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 14a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-1 0v11a.5.5 0 0 0 .5.5z"/>
          <path fillRule="evenodd" d="M6.354 4.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L4 3.207l1.646 1.647a.5.5 0 0 0 .708 0z"/>
          <path d="M12.438 7V1.668H11.39l-1.262.906v.969l1.21-.86h.052V7h1.046zm-2.84 5.82c.054.621.625 1.278 1.761 1.278 1.422 0 2.145-.98 2.145-2.848 0-2.05-.973-2.688-2.063-2.688-1.125 0-1.972.688-1.972 1.836 0 1.145.808 1.758 1.719 1.758.69 0 1.113-.351 1.261-.742h.059c.031 1.027-.309 1.856-1.133 1.856-.43 0-.715-.227-.773-.45H9.598zm2.757-2.43c0 .637-.43.973-.933.973-.516 0-.934-.34-.934-.98 0-.625.407-1 .926-1 .543 0 .941.375.941 1.008z"/>
        </svg>
      )
    }
  }

  return (
    <div className='container-fluid' style={{height: '-webkit-fill-available', paddingTop: '55px'}}>
      <div className="tableAndPersonalExpenses row" style={{height: '-webkit-fill-available'}}>
        <table className={state.other.showInfo ? 'table table-bordered table-striped' : 'table table-bordered col-md-9 table-striped'} style={{ marginBottom: '60px'}}>
          <thead>
            <tr>
              <td>Название <br/><input className='form-control form-control-sm' type='text' onChange={filterHandler} placeholder='Поиск'/></td>
              <td>Закуплено / Остаток <span title='Сортировать' onClick={() => sort('quantity')}>{sortedIcon()}</span></td>
              <td>Реализовано <span title='Сортировать' onClick={() => sort('relized')}>{sortedIcon()}</span></td>
              <td className={state.other.showInfo ? 'hideEl' : ''}>Цена закупки <span title='Сортировать' onClick={() => sort('purchasePrice')}>{sortedIcon()}</span></td>
              <td>Цена продажи <span title='Сортировать' onClick={() => sort('salePrice')}>{sortedIcon()}</span></td>
              <td className={state.other.showInfo ? 'hideEl' : ''}>Текущий доход <span title='Сортировать' onClick={() => sort('currentIncome')}>{sortedIcon()}</span></td>
              <td className={state.other.showInfo ? 'hideEl' : ''}>Чистая прибыль <span title='Сортировать' onClick={() => sort('netIncome')}>{sortedIcon()}</span></td>
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
                filter={filter}
              />
            })}
          </tbody>
          <NewProduct/>
        </table>
        <PersonalExpenses/>
      </div>
      <CreateCheque/>
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

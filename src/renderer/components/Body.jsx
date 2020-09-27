import React, {useState, useEffect, useContext, useRef} from 'react';
import RowProduct from './RowProduct.jsx';
import NewProduct from './NewProduct.jsx';
import PersonalExpenses from './PersonalExpenses.jsx';
import {ContextApp} from '../store/reducer.js'

import './Body.less';

export function Body() {

  const {state, dispatch} = useContext(ContextApp)
  const [filter, setFilter] = useState('')
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
              <td></td>
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
              />
            })}
          </tbody>
          <NewProduct/>
        </table>
        <PersonalExpenses/>
      </div>
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
    </div>
  );
}
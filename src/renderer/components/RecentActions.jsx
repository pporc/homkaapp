import React, {useEffect, useState} from 'react'
import {Table, Accordion, Card, Container, Row, Col, Button} from 'react-bootstrap'

export function RecentActions ({actions}) {

    const [filteredActions, setFilteredActions] = useState([])
    const [loadItem, setLoadItem] = useState(10)

    useEffect(() => {
        let result = [];

        Object.keys(actions).map(val => {
            actions[val].time = val
            result.push(actions[val])
        })

        result.sort((a, b) => a.time - b.time).reverse()

        setFilteredActions(result)
    }, [actions])

    const getStyleVariant = (type) => {
        switch (type) {
            case 'newProduct':
                return ['info', 'Создан товар', '']
            case 'deleteProduct':
                return ['danger', 'Товар удален', '']
            case 'deleteExpenses': 
                return ['dark', 'Удален персональный расход', '']
            case 'addPersonalExpenses':
                return ['secondary', 'Добавлен персональный расход', '']
            case 'addQuantity': 
                return ['primary', 'Добавлен товар на склад', '']
            case 'relized': 
                return ['success', 'Продажа', '']
            case 'cheque': 
                return ['success', 'Продажа', '']
            case 'return': 
                return ['warning', 'Возврат', '']
            default:
                return ['light', 'Неизвестное действие', '']
        }
    }

    const parseItem = (item) => {
        switch(item.action) {
            case 'newProduct':
                return itemTable(item)
            case 'deleteProduct':
                return itemTable(item)
            case 'deleteExpenses':
                return itemTable(item)
            case 'addPersonalExpenses':
                return itemTable(item)
            case 'addQuantity':
                return itemTable(item)
            case 'relized':
                return itemTable(item)
            case 'return':
                return itemTable(item)
            case 'cheque':
                return chequeTable(item)
            default:
                return (<pre>{JSON.stringify(item, null, 2)}</pre>)
        }
    }

    const itemTable = (item) => (
        <Container>
            <Row>
                <Col>
                    <Table size="sm">
                        <tbody>
                            {Object.keys(item).map( v => {
                                if (translate[v] !== undefined) {
                                    return (
                                        <tr key={Math.random(10)}>
                                            <td>{translate[v]}</td>
                                            <td>{v === 'date' ? new Date(Number(item[v])).toLocaleDateString() : item[v]}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </Table>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )

    const chequeTable = (item) => (
        <Container>
            <Row className='row-cols-2'>
                {item.data.map((arr, i) => (
                    <Col key={i}>
                        <Table size="sm">
                            {arr.map( (val, i) => (
                                <tbody key={i}>
                                    {Object.keys(val).map((v, i) => {
                                        if (translate[v] !== undefined) {
                                            return (
                                                <tr key={i}>
                                                    <td>{translate[v]}</td>
                                                    <td>{v === 'date' ? new Date(Number(val[v])).toLocaleDateString() : val[v]}</td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            ))}
                            <tfoot style={{fontWeight: 'bold'}}>
                                <tr>
                                    <td>Продано</td>
                                    <td>{arr[1]}</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Col>
                ))}
            </Row>
        </Container>
    )

    const translate = {
        name: 'Имя',
        quantity: 'Закупленно',
        //purchasePrice: 'Цена покупки',
        salePrice: 'Цена продажи',
        relized: 'Продано ранее',
        date: 'Дата создания',
        sum: 'Сумма',
        description: 'Описание',
        oldCount: 'Старое количество',
        newCount: 'Новое количество',
        salePrice: 'Цена'
    }

    return (
        <div>
            <Accordion>
                {filteredActions.slice(0, loadItem).map((val, i) => (
                    <Card key={val.time}>
                        <Accordion.Toggle as={Card.Header} className={"list-group-item-" + getStyleVariant(val.action)[0]} eventKey={val.time}>
                            {new Date(Number(val.time)).toLocaleString()}
                            {<b className='ml-5'>{getStyleVariant(val.action)[1]}</b>}
                            {val.action === 'relized' ?
                                <span className='float-right'>{`+ ${((val.oldCount - val.newCount) * val.salePrice).toFixed(2)}грн`}</span>
                                : null}
                            {val.action === 'cheque' ?
                                <span className='float-right'>{`+ ${val.data.reduce(function(sum, arg) {
                                    return sum + (arg[1] * arg[0].salePrice)
                                    }, 0).toFixed(2)}грн`}</span>
                                : null}
                            {val.action === 'addQuantity' ?
                                <span className='float-right'>{val.oldCount} + {val.newCount - val.oldCount}</span>
                                : null}
                            {val.action === 'newProduct' ?
                                <span className='float-right'>{val.name}</span>
                                : null}
                            {val.action === 'addPersonalExpenses' ?
                                <span className='float-right'> - {val.sum}грн</span>
                                : null}
                            {val.action === 'deleteProduct' ?
                                <span className='float-right'>{val.name}</span>
                                : null}
                            {val.action === 'return' ?
                                <span className='float-right'>{`- ${((val.newCount - val.oldCount) * val.salePrice).toFixed(2)}грн`}</span>
                                : null}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={val.time}>
                            <Card.Body>
                                {parseItem(val)}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                ))}
            </Accordion>
            {loadItem >= filteredActions.length && <p style={{ textAlign: 'center' }} className='mt-3'><b>Конец действий</b></p>}
            <Button variant='outline-success' block className='mt-3' onClick={() => setLoadItem(loadItem + 10)}>Посмотреть действия раньше</Button>
            {/* <pre>{JSON.stringify(filteredActions, null, 2)}</pre> */}
        </div>
    )
}
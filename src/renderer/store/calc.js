const calcRemainder = (buy, relized) => {
    return (buy - relized).toFixed(2);
}

const calcIncome = (obj = {}) => {
    let income = 0;
    
    Object.keys(obj).map((val) => {
        income += obj[val].salePrice * (obj[val].relized || 0)
    });

    return income.toFixed(2);
}

const calcPersonalExpenses = (obj = {}) => {
    let count = 0;
    
    Object.keys(obj).map((val) => {
        count += Number(obj[val].sum)
    });

    return count.toFixed(2);
}

const calcNetIncomeItem = (relized, salePrice, purchasePrice) => {

    if (isNaN(relized)) return 0
    let count = ((relized * salePrice) - (relized * purchasePrice))

    return count.toFixed(2)
}

const calcNetIncome = (obj = {}) => {
    let count = 0;
    
    Object.keys(obj).map((val) => {
        let relized = isNaN(obj[val].relized) ? 0 : obj[val].relized;
        count += (relized * obj[val].salePrice) - (relized * obj[val].purchasePrice)
    });

    return count.toFixed(2);
}

const calcAllProductCost = (obj = {}) => {
    let count = 0;

    Object.keys(obj).map((val) => {
        count += ((obj[val].quantity - (obj[val].relized || 0)) * obj[val].purchasePrice)
    });

    return count.toFixed(2);
}

export {calcRemainder, calcIncome, calcPersonalExpenses, calcNetIncomeItem, calcNetIncome, calcAllProductCost}
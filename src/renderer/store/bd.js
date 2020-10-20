import Store from 'electron-store';

const store = new Store({name: 'homkaapp', schema});

const schema = {
	other: {
		type: 'object',
        properties: {
            currentId: {
                type: "number",
                default: 0
            },
            countSales: {
                type: "number",
                default: 0
            },
            deletedProducts: {
                type: "object"
            },
            backup: {
                type: 'number'
            },
            saveBackup: {
                type: 'number'
            }
        }
	},
	products: {
        type: 'object',
        properties: {
            id: {type: "number"},
            name: {type : "string"},
            buy: {type: "number"},
            priceBuy: {type: "number"},
            relized: {type: "number", default: 0},
            BuyRelized: {type: "number"},
            remainder: {type: "number"},
            date: {type: "date"}
        }
    },
    personalExpensis: {
        type: 'object',
        properties: {
            description: {type: 'text'},
            sum: {type: 'number'}
        }
    },
    statistics: {
        type: 'object',
        properties: {
            id: 'number',
            action: 'text',
            oldCount: 'text',
            newCount: 'text'
        }

    }
};

export default store;
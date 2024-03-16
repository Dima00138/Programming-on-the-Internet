const EventEmitter = require('events');

const DB = () => {
    let dbTable = [
        { id: 1, name: 'Строка 1', bday: new Date(232324343) },
        { id: 2, name: 'Строка 2', bday: new Date(232323) },
        { id: 3, name: 'Строка 3', bday: new Date(233) },
        { id: 4, name: 'Строка 4', bday: new Date(232353) },
        { id: 5, name: 'Строка 5', bday: new Date(66724343) },
        { id: 6, name: 'Строка 6', bday: new Date(78232324343) }
    ];

    const eventEmitter = new EventEmitter();

    async function Select() {
        eventEmitter.emit('select');
        return JSON.stringify(dbTable, null, " ");
    }

    async function Insert(newRow) {
        dbTable.push(newRow);
        eventEmitter.emit('insert', newRow);
    }

    async function Update(newRow) {
        const rowIndex = dbTable.findIndex((row) =>
            parseInt(row.id) === parseInt(newRow.id))
        if (rowIndex !== -1) {
            dbTable[rowIndex] = newRow;
            eventEmitter.emit('update', newRow);
        }
        else
            throw new Error();
    }

    async function Delete(rowId) {
        const rowIndex = dbTable.findIndex((row) => row.id === parseInt(rowId))

        if (rowIndex !== -1) {
            const delRow = dbTable[rowIndex];
            dbTable.splice(rowIndex, 1);
            eventEmitter.emit('delete', rowId);
        } else
            throw new Error();
    }

    return {
        on: eventEmitter.on.bind(eventEmitter),
        eE: eventEmitter,
        Select: Select,
        Insert: Insert,
        Update: Update,
        Delete: Delete
    };
}

module.exports = DB;
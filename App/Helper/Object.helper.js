export const ObjectHelper = {

    /**
     * Sort Array of Object by Key.
     * Value of key must be sortable (String,Number,etc.)
     * @param {String} key Key to compare
     * @param {String} mode Sort mode 'desc' or 'asc'
     * @param {Array} array Array of Object to sort
     */
    sort(key = '', mode = '', array = [{}]) {
        let compare = {
            desc: function (a, b) {
                if (a[key] < b[key]) {
                    return 1;
                }
                if (a[key] > b[key]) {
                    return -1;
                }
                return 0;
            },
            asc: function (a, b) {
                if (a[key] < b[key]) {
                    return -1;
                }
                if (a[key] > b[key]) {
                    return 1;
                }
                return 0;
            },
        }
        const sorted = [...array]
        return  sorted.sort(compare[mode])
    },
    /**
     * Fetch Array of Object
     * @param {String} key Key to compare
     * @param {*} value Value to compare
     * @param {Array} array Array to find
     */
    find(key = '', value, array = []) {
        return array.find(e => e[key] == value)
    },
    findIndex(key = '', value, array = []) {
        return array.findIndex(e => e[key] == value)
    },
    /**
     * Filter Array of Object
     * @param {String} key Key to filter 
     * @param {String} operator Operator to compare 
     * @param {*} value Value to compare
     * @param {Array} array Array of Object to filter
     */
    filter(key = '', operator = '', value, array = []) {
        let operand = {
            '=': (a, b) => a == b,
            '>=': (a, b) => a >= b,
            '>': (a, b) => a > b,
            '<=': (a, b) => a <= b,
            '<': (a, b) => a < b,
            '!=': (a, b) => a != b,
        }
        return array.filter(e => operand[operator](e[key],value))
    }
}
export default ObjectHelper = {

    /**
     * Sort Array of Object by Key.
     * Value of key must be sortable (String,Number,etc.)
     * @param {String} key Key to compare
     * @param {String} mode Sort mode 'desc' or 'asc'
     * @param {Array} array Array of Object to sort
     * @param {Boolean} copy Return new value or sort the original Array
     */
    sort(key = '', mode = '', array = [{}],copy=true) {
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
        if(copy == undefined || (copy)){
            const sorted = [...array]
            return  sorted.sort(compare[mode])
        }else{
            return array.sort(compare[mode])
        }
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
    /**
     * Fetch index Array of Object
     * @param {String} key Key to compare
     * @param {*} value Value to compare
     * @param {Array} array Array to find
     */
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
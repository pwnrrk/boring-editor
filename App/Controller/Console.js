export const Console = {
    consoleElment: document.createElement('div'),
    init(consoleElment = document.createElement()) {
        this.consoleElment = consoleElment
        this.defaultLog()
        this.error()
        this.warn()
        this.debug()
        this.globalerror()
    },
    defaultLog() {
        console.defaultLog = console.log.bind(console);
        console.logs = [];
        const consoleElment = this.consoleElment
        console.log = function () {
            // default &  console.log()
            console.defaultLog.apply(console, arguments);
            // new & array data
            console.logs.push(Array.from(arguments));
            consoleElment.innerHTML += `<p>${Array.from(arguments)}</p>`
        }
    },
    error() {
        console.defaultError = console.error.bind(console);
        console.errors = [];
        const consoleElment = this.consoleElment
        console.error = function () {
            // default &  console.error()
            console.defaultError.apply(console, arguments);
            // new & array data
            console.errors.push(Array.from(arguments));
            consoleElment.innerHTML += `<p class="text-danger"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="16px" focusable="false" data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"/></svg> ${Array.from(arguments)}</p>`
        }
    },
    warn() {
        console.defaultWarn = console.warn.bind(console);
        console.warns = [];
        const consoleElment = this.consoleElment
        console.warn = function () {
            // default &  console.warn()
            console.defaultWarn.apply(console, arguments);
            // new & array data
            console.warns.push(Array.from(arguments));
            consoleElment.innerHTML += `<p class="text-warning"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="16px" focusable="false" data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" role="img" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"/></svg> ${Array.from(arguments)}</p>`
        }
    },
    debug() {
        console.defaultDebug = console.debug.bind(console);
        console.debugs = [];
        const consoleElment = this.consoleElment
        console.debug = function () {
            // default &  console.debug()
            console.defaultDebug.apply(console, arguments);
            // new & array data
            console.debugs.push(Array.from(arguments));
            consoleElment.innerHTML += `<p class="text-info"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="16px" focusable="false" data-prefix="fas" data-icon="info-circle" class="svg-inline--fa fa-info-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg> ${Array.from(arguments)}</p>`
        }
    },
    globalerror() {
        window.addEventListener('error', function (e) {
            console.error(e.message);
        })
    }
}
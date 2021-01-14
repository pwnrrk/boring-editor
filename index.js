import { MenuBar } from "./Controller/MenuBar.js"

//Element
const editor = document.getElementById('editor')
const output = document.getElementById('output')
const wrapper = document.getElementById('wrapper')
const line = document.getElementById('line')
const filename = document.getElementById('filename')
const autosaving = document.getElementById('autosaving')
const liveArea = document.getElementById('live-area')
const liveRender = document.getElementById('live-render')

//Set default file name
filename.value = 'untitled.txt'

linenumber()

//Get temp file name
if (localStorage.getItem('filename')) {
    filename.value = localStorage.getItem('filename')
}
//Get temp content
if (localStorage.getItem('tempEditor')) {
    editor.innerHTML = localStorage.getItem('tempEditor')
    output.innerHTML = editor.innerHTML
    linenumber()
}
//Set title from file name
document.title = filename.value
//Check file type and hilight
checkFileType()
hilight()
//Line numbering Hilighting Autosaving
editor.addEventListener('keyup', event => {
    output.innerHTML = editor.innerHTML
    hilight()
    linenumber()
    autosave()
})
editor.addEventListener('focusin', event => {
    if (editor.innerText == "") {
        let range = window.getSelection().getRangeAt(0);
        let newLine = document.createElement('div')
        newLine.innerHTML = '<br>'
        range.insertNode(newLine);
        range.setStartAfter(newLine);
    }
})
editor.addEventListener('blur',hilight)

//Save file name to temp
filename.addEventListener('input', event => {
    localStorage.setItem('filename', filename.value)
    document.title = filename.value
    checkFileType()
})

//Hilight syntax
function hilight() {
    hljs.highlightBlock(output);
}

//Check file type
function checkFileType() {
    let fil = filename.value.split('.')
    let type = fil[fil.length - 1]
    output.setAttribute('class', type)
}

//Add line number 
function linenumber() {
    let lines = countLines()
    let template = document.createDocumentFragment()
    for (let i = 0; i < lines; i++) {
        let div = document.createElement('div')
        div.textContent = (i + 1)
        template.appendChild(div)
    }
    line.innerHTML = ''
    line.appendChild(template)
}

//Count line
function countLines() {

    // Get element with 'content' as id                             
    let el = editor;

    // Get total height of the content     
    let divHeight = el.getBoundingClientRect().height

    // object.style.lineHeight, returns  
    // the lineHeight property 
    // height of one line
    let lineHeight = 20;
    let lines = divHeight / lineHeight;
    return lines
}

//Auto save
function autosave() {
    localStorage.setItem('tempEditor', output.innerHTML)
    localStorage.setItem('tempContent', output.innerText)
    setTimeout(() => {
        if (!autosaving.classList.contains('showing')) {
            autosaving.classList.add('showing')
        }
    }, 700)
    setTimeout(() => {
        autosaving.classList.remove('showing')
    }, 2500)
}

function toggleLive() {
    if (liveArea.classList.contains('showing')) {
        liveArea.classList.remove('showing')
        liveRender.src = ''
    } else {
        liveArea.classList.add('showing')
        liveRender.src = 'live.html'
    }
}

function runLive() {
    liveRender.src = 'live.html'
}

//Send user to editor
document.addEventListener('click', e => {
    if (e.target == wrapper.children.item(0) && e.target != editor) {
        editor.focus()
        let range = window.getSelection().getRangeAt(0);
        let focus = editor.lastElementChild
        range.setStartAfter(focus);
    }
})

//Tab insert
window.addEventListener("keydown", event => {
    insertTabAtCaret(event)
    overrideCtrlA(event)
    overrideCtrlS(event)
    overrideCtrlN(event)
});

function insertTabAtCaret(event) {
    if (event.keyCode == 9) {
        event.preventDefault()
        let range = window.getSelection().getRangeAt(0);

        let tabNode = document.createElement('span')
        tabNode.innerHTML = '&#09;'
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
    }
}

function overrideCtrlA(event) {
    if (event.key == "a" && event.ctrlKey && event.target != editor) {
        event.preventDefault()
        MenuBar.selectAll()
    }
}

function overrideCtrlS(event) {
    if (event.key == "s" && event.ctrlKey && event.altKey) {
        event.preventDefault()
        openModal("#save-as")
    }
    else if (event.key == "s" && event.ctrlKey) {
        event.preventDefault()
        openModal("#save")
    }
}

function overrideCtrlN(event) {
    if (event.key == "n" && event.ctrlKey && event.altKey) {
        event.preventDefault()
        openModal("#new-file")
    }
}

function getVersion() {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let res = JSON.parse(this.responseText)
            document.getElementById('version').innerText = res[0].tag_name
            document.getElementById('release-title').innerText = res[0].name
            document.getElementById('release-body').innerText = res[0].body
        }
    }
    xmlhttp.open('GET', 'https://api.github.com/repos/pwnrrk/boring-editor/releases')
    xmlhttp.send()
}

getVersion()

//Disable scroll by space bar
window.onkeydown = function (e) {
    return !(e.keyCode == 32 && e.target == document.body);
};

document.getElementById('menubar').addEventListener('mousedown', e => {
    e.preventDefault()
})

//Menubar here
document.getElementById('save-btn').addEventListener('click', () => MenuBar.save())
document.getElementById('undo-btn').addEventListener('click', () => MenuBar.undo())
document.getElementById('redo-btn').addEventListener('click', () => MenuBar.redo())
document.getElementById('cut-btn').addEventListener('click', () => MenuBar.cut())
document.getElementById('copy-btn').addEventListener('click', () => MenuBar.copy())
document.getElementById('paste-btn').addEventListener('click', () => MenuBar.paste())
document.getElementById('selectall-btn').addEventListener('click', () => MenuBar.selectAll())
document.getElementById('new-btn').addEventListener('click', () => MenuBar.newFile())
document.getElementById('live-toggler').addEventListener('click', () => toggleLive())
document.getElementById('close-live').addEventListener('click', () => toggleLive())
document.getElementById('rerun-btn').addEventListener('click', () => runLive())
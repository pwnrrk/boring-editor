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
const context = document.getElementById('context')
const url = new URLSearchParams(window.location.search)

document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    context.classList.add('showing')
    context.setAttribute('style', `top:${event.y}px;left:${event.x}px`)
})


let files = JSON.parse(localStorage.getItem('files'))
let file = files.find(x => x.id == url.get('file'))
//Set default file name
filename.innerText = file.name
let index = files.findIndex(x => x.id == file.id)

//Get temp content
if (files[index].editor) {
    editor.innerHTML = files[index].editor
    output.innerHTML = editor.innerHTML
}
linenumber()
//Set title from file name
document.title = filename.innerText
//Check file type and hilight
checkFileType()
hilight()
//Line numbering Hilighting Autosaving
editor.addEventListener('input', event => {
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
editor.addEventListener('blur', hilight)

//local storageSave
function saveFiles() {
    localStorage.setItem('files', JSON.stringify(files))
    saving()
}

//Hilight syntax Feature
function hilight() {
    hljs.highlightBlock(output);
}

//Check file type
function checkFileType() {
    let fil = filename.innerText.split('.')
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
    files[index].editor = editor.innerHTML
    files[index].content = editor.innerText
    saveFiles()
}

function saving() {
    setTimeout(() => {
        if (!autosaving.classList.contains('showing')) {
            autosaving.classList.add('showing')
        }
    }, 700)
    setTimeout(() => {
        autosaving.classList.remove('showing')
    }, 2500)
}

function toggleLive(type) {
    if (type != undefined) {
        liveArea.classList.add('showing')
        liveRender.src = `live.html?file=${files[index].id}&type=${type}`
    }else{
        liveArea.classList.remove('showing')
        liveRender.src = ''
    }
}

function runLive() {
    liveRender.src = liveRender.src
}

//Send user to editor
document.addEventListener('click', e => {
    if (e.target == wrapper.children.item(0) && e.target != editor) {
        editor.focus()
        let range = window.getSelection().getRangeAt(0);
        let focus = editor.childNodes.item(editor.childNodes.length-1)
        range.setStartAfter(focus);
    }
})

//Tab insert
window.addEventListener("keydown", event => {
    insertTabAtCaret(event)
    overrideCtrlA(event)
    overrideCtrlS(event)
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

document.querySelectorAll('.live-toggler').forEach(e=>{
    e.addEventListener('click',()=>toggleLive(e.dataset.type))
})

document.getElementById('close-live').addEventListener('click', () => toggleLive())

//Context
document.getElementById('context-undo').addEventListener('click', () => MenuBar.undo())
document.getElementById('context-redo').addEventListener('click', () => MenuBar.redo())
document.getElementById('context-cut').addEventListener('click', () => MenuBar.cut())
document.getElementById('context-copy').addEventListener('click', () => MenuBar.copy())
document.getElementById('context-paste').addEventListener('click', () => MenuBar.paste())
document.getElementById('context-selectall').addEventListener('click', () => MenuBar.selectAll())

//Other
document.getElementById('rerun-btn').addEventListener('click', () => runLive())
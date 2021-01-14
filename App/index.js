import { File } from "./Controller/File.js"
import { getClassWithColor } from "../node_modules/file-icons-js/index.js"
import { Folder } from "./Controller/Folder.js"

//For First Run
let files = {
    files: [{
        id:0,
        name: '',
        editor: '',
        content: ''
    }]
}

if(!localStorage.getItem('files')){
    localStorage.setItem('files',JSON.stringify(files))
}

if(JSON.parse(localStorage.getItem('files')).files.length<1){
    localStorage.setItem('files',JSON.stringify(files))
}

let folders = {
    folders: [{
        id:0,
        name: '',
        files: [{
            id:'',
        }]
    }]
}

if(!localStorage.getItem('folders')){
    localStorage.setItem('folders',JSON.stringify(folders))
}

if(JSON.parse(localStorage.getItem('folders')).folders.length<1){
    localStorage.setItem('folders',JSON.stringify(folders))
}

function init() {

    getFile()
    getFolder()
    displayFile()
    displayFolder()
    //Context menu
    let context = document.getElementById('context')
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        context.classList.add('showing')
        document.querySelectorAll('.file-context').forEach(fc => {
            fc.setAttribute('hidden', '')
        })
        contextFileItem(event)
        contextFolderItem(event)
        context.setAttribute('style', `top:${event.y}px;left:${event.x}px`)
    })

    //Context Item
    document.getElementById('context-reload').addEventListener('click', refresh)
    document.getElementById('context-delete').addEventListener('click', () => {
        if(contextItem.type == 'file'){
            File.delete(contextItem.name)
        }else{
            Folder.delete(contextItem.name)
        }
        refresh()
    })
    document.getElementById('context-rename').addEventListener('click', ()=>{
        document.getElementById('newname').value = contextItem.name
    })

    //Button
    document.getElementById('newfile').addEventListener('click', newfile)
    document.getElementById('newfolder').addEventListener('click',newFolder)
    //TODO Rename btn
}

function getFile() {
    //Get File From Storage
    if (localStorage.getItem('files')) {
        files = JSON.parse(localStorage.getItem('files'))
    }
}
function getFolder() {
    //Get File From Storage
    if (localStorage.getItem('folders')) {
        folders = JSON.parse(localStorage.getItem('folders'))
    }
}

//New File
function newfile() {
    let filename = document.getElementById('filename').value
    if (files.files.filter(file => file.name == filename).length < 1) {
        files.files.push({ id:files.files[files.files.length-1].id+1,name: filename, editor:'',content: '' })
        localStorage.setItem('files', JSON.stringify(files))
        refresh()
    } else {
        alert('File already created')
    }
}

//New Folder
function newFolder() {
    let foldername = document.getElementById('foldername').value
    if (folders.folders.filter(folder => folder.name == foldername).length < 1) {
        folders.folders.push({id:folders.folders[folders.folders.length-1].id+1,name:foldername,files:[]})
        localStorage.setItem('folders', JSON.stringify(folders))
        refresh()
    } else {
        alert('Folder already created')
    }
}

//Display File
function displayFile() {
    document.getElementById('file-area').innerHTML = ""
    files.files.forEach(file => {
        if (file.name != "") {
            let button = document.createElement('button')
            button.innerHTML = `<span class="ic-wrapper"><i class="ic ${getClassWithColor(file.name)}"></i></span><span class="file-item-name">${file.name}</span>`
            button.setAttribute('class', 'btn btn-secondary shadow file-item m-1')
            button.dataset.name = file.name
            button.addEventListener('dblclick', () => File.open(file.name))
            document.getElementById('file-area').append(button)
        }
    });
}

function displayFolder() {
    document.getElementById('folder-area').innerHTML = ""
    folders.folders.forEach(folder => {
        if (folder.name != "") {
            let button = document.createElement('button')
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" style="width:16px;" data-icon="folder"  class="svg-inline--fa fa-folder fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"/></svg> ${folder.name}`
            button.setAttribute('class', 'btn btn-secondary shadow folder-item m-1')
            button.dataset.name = folder.name
            document.getElementById('folder-area').append(button)
        }
    });
}

//Context On File
let contextItem = {}
function contextFileItem(event) {
    document.querySelectorAll('.file-item').forEach(file => {
        if (event.target == file || file.contains(event.target)) {
            contextItem.name = file.dataset.name
            contextItem.type = 'file'
            document.querySelectorAll('.file-context').forEach(fc => {
                fc.removeAttribute('hidden')
            })
        }
    })
}

function contextFolderItem(event) {
    document.querySelectorAll('.folder-item').forEach(folder => {
        if (event.target == folder || folder.contains(event.target)) {
            contextItem.name = folder.dataset.name
            contextItem.type = 'folder'
            document.querySelectorAll('.file-context').forEach(fc => {
                fc.removeAttribute('hidden')
            })
        }
    })
}

function refresh() {
    getFile()
    getFolder()
    displayFile()
    displayFolder()
}

//
window.addEventListener('load', init)

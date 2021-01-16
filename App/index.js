import { File } from "./Controller/File.js"
import { getClassWithColor } from "../file-icons-js/index.js"
import { Folder } from "./Controller/Folder.js"
import { ObjectHelper } from "./Helper/Object.helper.js"

const url = new URLSearchParams(window.location.search)

let activeFolder = 0

if (url.get('folder')) {
    activeFolder = url.get('folder')
    document.title = `Minimal Editor - ${ObjectHelper.find('id', activeFolder, Folder.get().folders).name}`
}

//For First Run
let files = {
    files: [{
        id: 0,
        name: '',
        editor: '',
        content: '',
        parent: 0,
    }]
}
if (!localStorage.getItem('files')) {
    localStorage.setItem('files', JSON.stringify(files))
}

if (JSON.parse(localStorage.getItem('files')).files.length < 1) {
    localStorage.setItem('files', JSON.stringify(files))
}

let folders = {
    folders: [{
        id: 0,
        name: '',
        parent: 0
    }]
}

if (!localStorage.getItem('folders')) {
    localStorage.setItem('folders', JSON.stringify(folders))
}

if (JSON.parse(localStorage.getItem('folders')).folders.length < 1) {
    localStorage.setItem('folders', JSON.stringify(folders))
}

function init() {
    getVersion()
    files = File.get()
    folders = Folder.get()
    displayFile()
    displayFolder()
    contextOverride()

    //Button
    document.getElementById('newfile').addEventListener('click', newfile)
    document.getElementById('filename').addEventListener('keyup', (e) => {
        if (e.key == 'Enter' && e.target.value != '') {
            newfile()
            closeModal()
        }
    })
    document.getElementById('foldername').addEventListener('keyup', (e) => {
        if (e.key == 'Enter' && e.target.value != '') {
            newFolder()
            closeModal()
        }
    })
    document.getElementById('newfolder').addEventListener('click', newFolder)
    document.getElementById('delete-btn').addEventListener('click', () => {
        if (contextItem.type == 'file') {
            File.delete(contextItem.id, activeFolder)
        } else {
            //TODO Alert Not Empty
            Folder.delete(contextItem.id, activeFolder)
        }
        refresh()
    })
    //TODO Rename btn

}

//New File
function newfile() {
    let filename = document.getElementById('filename').value
    if (File.save(filename, activeFolder)) {
        refresh()
    } else {
        alert('File already created')
    }
}

function contextOverride() {
    //Context menu
    let context = document.getElementById('context')
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        context.classList.add('showing')
        document.querySelectorAll('.context-item').forEach(fc => {
            fc.removeAttribute('hidden')
        })
        document.querySelectorAll('.file-context').forEach(fc => {
            fc.setAttribute('hidden', '')
        })
        if (activeFolder == 0) {
            document.getElementById('context-back').setAttribute('hidden', '')
        }
        contextFileItem(event)
        contextFolderItem(event)
        context.setAttribute('style', `top:${event.y}px;left:${event.x}px`)
    })

    //Context Item
    document.getElementById('context-back').addEventListener('click', () => history.back())
    document.getElementById('context-reload').addEventListener('click', refresh)
    document.getElementById('context-delete').addEventListener('click', () => {
        document.getElementById('delete-title').innerText = contextItem.name
    })
    document.getElementById('context-rename').addEventListener('click', () => {
        document.getElementById('newname').value = contextItem.name
    })
}

//New Folder
function newFolder() {
    let foldername = document.getElementById('foldername').value
    if (Folder.save(foldername, activeFolder)) {
        refresh()
    } else {
        alert('Folder already created')
    }
}

//Display File
function displayFile() {
    document.getElementById('file-area').innerHTML = ''
    let fileInDir = ObjectHelper.filter('parent', '=', activeFolder, files.files)
    fileInDir.forEach(file => {
        if (file.name != "") {
            let button = document.createElement('button')
            button.innerHTML = `<span class="ic-wrapper"><i class="ic ${getClassWithColor(file.name)}"></i></span><span class="file-item-name">${file.name}</span>`
            button.setAttribute('class', 'btn btn-secondary shadow file-item m-1')
            setDragElement(button)
            button.dataset.id = file.id
            button.dataset.name = file.name
            button.dataset.type = 'file'
            button.addEventListener('dblclick', () => File.open(file.name))
            document.getElementById('file-area').append(button)
        }
    });
}

let draggingElement = undefined

function setDragElement(element = document.createElement()) {
    element.setAttribute('draggable', 'true')
    element.ondragstart = (event) => {
        element.classList.add('dragging')
        draggingElement = element
    }
    element.ondragend = () => {
        element.classList.remove('dragging')
        draggingElement = undefined
    }
    element.ondragover = (event) => {
        event.preventDefault()
        if (element.dataset.type != 'file') {
            if (element != draggingElement) {
                element.classList.add('dragover')
            }
        }
    }
    element.ondragleave = () => {
        if (element.dataset.type != 'file') {
            element.classList.remove('dragover')
        }
    }
    element.ondrop = (event) => {
        event.preventDefault()
        document.querySelectorAll('.folder-item').forEach(e => {
            if (e == event.target || e.contains(event.target)) {
                if (draggingElement.dataset.type == 'file') {
                    files.files[ObjectHelper.findIndex('id', draggingElement.dataset.id, files.files)].parent = e.dataset.id
                    File.update(files)
                } else {
                    folders.folders[ObjectHelper.findIndex('id', draggingElement.dataset.id, folders.folders)].parent = e.dataset.id
                    Folder.update(folders)
                }
                e.classList.remove('dragover')
                refresh()
                return false
            }
        })
    }
}


function displayFolder() {
    document.getElementById('folder-area').innerHTML = ""
    let folderInDir = ObjectHelper.filter('parent', '=', activeFolder, folders.folders)
    folderInDir.forEach(folder => {
        if (folder.name != "") {
            let button = document.createElement('button')
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" style="width:16px;" data-icon="folder"  class="svg-inline--fa fa-folder fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"/></svg> ${folder.name}`
            button.setAttribute('class', 'btn btn-secondary shadow folder-item m-1')
            button.dataset.id = folder.id
            button.dataset.name = folder.name
            button.dataset.type = 'folder'
            setDragElement(button)
            button.addEventListener('dblclick', () => window.location.href = `?folder=${button.dataset.id}`)
            document.getElementById('folder-area').append(button)
        }
    });
}

//Context On File
let contextItem = { id: 0, name: '', type: '' }

function contextFileItem(event) {
    document.querySelectorAll('.file-item').forEach(file => {
        if (event.target == file || file.contains(event.target)) {
            contextItem.id = file.dataset.id
            contextItem.name = file.dataset.name
            contextItem.type = 'file'
            document.querySelectorAll('.context-item').forEach(fc => {
                fc.setAttribute('hidden', '')
            })
            document.querySelectorAll('.file-context').forEach(fc => {
                fc.removeAttribute('hidden')
            })
        }
    })
}

function contextFolderItem(event) {
    document.querySelectorAll('.folder-item').forEach(folder => {
        if (event.target == folder || folder.contains(event.target)) {
            contextItem.id = folder.dataset.id
            contextItem.name = folder.dataset.name
            contextItem.type = 'folder'
            document.querySelectorAll('.context-item').forEach(fc => {
                fc.setAttribute('hidden', '')
            })
            document.querySelectorAll('.file-context').forEach(fc => {
                fc.removeAttribute('hidden')
            })
        }
    })
}

function refresh() {
    files = File.get()
    folders = Folder.get()
    displayFile()
    displayFolder()
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

//
init()

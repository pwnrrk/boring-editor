import { File } from "./Controller/File.js"
import { getClassWithColor } from "../file-icons-js/index.js"
import { Folder } from "./Controller/Folder.js"
import { ObjectHelper } from "./Helper/Object.helper.js"
import { App } from "./Controller/App.js"
import { Files } from "./Model/Files.js"
import { Folders } from "./Model/Folders.js"

const url = new URLSearchParams(window.location.search)

let activeFolder = url.get('folder') ?? 0

document.getElementById('path').innerText = App.getPath(activeFolder)

if (!App.isIntit()) {
    App.init()
}

let files = Files
let folders = Folders

const controller = {
    folder: Folder,
    file: File
}

window.addEventListener('load', init)

async function init() {
    files = File.get()
    folders = Folder.get()
    displayFile()
    displayFolder()
    contextOverride()

    await App.getVersion().then(res => {
        document.getElementById('version').innerText = res[0].tag_name
        document.getElementById('release-title').innerText = res[0].name
        document.getElementById('release-body').innerText = res[0].body
    })

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
        controller[contextItem.type].delete(contextItem.id)
        refresh()
    })
    document.getElementById('rename-btn').addEventListener('click', () => {
        controller[contextItem.type].rename(contextItem.id, document.getElementById('newname').value)
        refresh()
    })
    document.getElementById('newname').addEventListener('keyup', (e) => {
        if (e.key == 'Enter' && e.target.value != '') {
            controller[contextItem.type].rename(contextItem.id, document.getElementById('newname').value)
            refresh()
            closeModal()
        }
    })

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
    document.getElementById('context-open').addEventListener('click',()=>controller[contextItem.type].open(contextItem.id))
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
    let fileInDir = ObjectHelper.filter('parent', '=', activeFolder, files)
    fileInDir.forEach(file => {
        if (file.name != "") {
            let button = document.createElement('button')
            button.innerHTML = `<span class="ic-wrapper"><i class="ic ${getClassWithColor(file.name)}"></i></span><span class="file-item-name">${file.name}</span>`
            button.setAttribute('class', 'btn btn-secondary shadow file-item m-1')
            setDragElement(button)
            button.dataset.id = file.id
            button.dataset.name = file.name
            button.dataset.type = 'file'
            button.addEventListener('dblclick', () => File.open(button.dataset.id))
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
                    files[ObjectHelper.findIndex('id', draggingElement.dataset.id, files)].parent = e.dataset.id
                    File.update(files)
                } else {
                    folders[ObjectHelper.findIndex('id', draggingElement.dataset.id, folders)].parent = e.dataset.id
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
    let folderInDir = ObjectHelper.filter('parent', '=', activeFolder, folders)
    folderInDir.forEach(folder => {
        if (folder.name != "") {
            let button = document.createElement('button')
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" style="width:16px;" data-icon="folder"  class="svg-inline--fa fa-folder fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"/></svg> ${folder.name}`
            button.setAttribute('class', 'btn btn-secondary shadow folder-item m-1')
            button.dataset.id = folder.id
            button.dataset.name = folder.name
            button.dataset.type = 'folder'
            setDragElement(button)
            button.addEventListener('dblclick', () => Folder.open(button.dataset.id))
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

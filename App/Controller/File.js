import { ObjectHelper } from "../Helper/Object.helper.js"

class file {
    open(file) {
        window.open(`editor.html?file=${file}`)
    }
    get() {
        if (localStorage.getItem('files')) {
            return JSON.parse(localStorage.getItem('files'))
        }
    }
    save(filename, folderID) {
        let files = this.get()
        let fil = ObjectHelper.filter('parent', '=', folderID, files.files)
        if (ObjectHelper.filter('name', '=', filename, fil).length < 1) {
            let file = { id: files.files[files.files.length - 1].id + 1, name: filename, editor: '', content: '', parent: folderID }
            files.files.push(file)
            localStorage.setItem('files', JSON.stringify(files))
            return true
        } else {
            return false
        }
    }
    update(files) {
        localStorage.setItem('files', JSON.stringify(files))
    }
    delete(fileId) {
        let files = JSON.parse(localStorage.getItem('files'))
        let index = ObjectHelper.findIndex('id', fileId, files.files)
        files.files.splice(index, 1)
        localStorage.setItem('files', JSON.stringify(files))
    }
}
export const File = file.prototype
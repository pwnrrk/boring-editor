import { ObjectHelper } from "../Helper/Object.helper.js"
import { Files } from "../Model/Files.js"
import { FileIndex } from "./FileIndex.js"

class file {
    open(id) {
        window.open(`editor.html?file=${id}`)
    }
    get() {
        if (localStorage.getItem('files')) {
            return JSON.parse(localStorage.getItem('files'))
        }
    }
    save(filename, folderID) {
        let files = this.get()
        let fil = ObjectHelper.filter('parent', '=', folderID, files)
        if (ObjectHelper.filter('name', '=', filename, fil).length < 1) {
            let file = { id: FileIndex.next(), name: filename, editor: '', content: '', parent: folderID }
            files.push(file)
            localStorage.setItem('files', JSON.stringify(files))
            return true
        } else {
            return false
        }
    }
    update(files = Files) {
        localStorage.setItem('files', JSON.stringify(files))
    }
    delete(fileId) {
        let files = this.get()
        let index = ObjectHelper.findIndex('id', fileId, files)
        files.splice(index, 1)
        localStorage.setItem('files', JSON.stringify(files))
    }
    rename(id,newname){
        let files = Files
        files = this.get()
        files[ObjectHelper.findIndex('id',id,files)].name = newname
        this.update(files)
    }
}
export const File = file.prototype
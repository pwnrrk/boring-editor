import { ObjectHelper } from "../Helper/Object.helper.js"
import { Files } from "../Model/Files.js"
import { FileIndex } from "./FileIndex.js"

class file {
    open(id) {
        window.open(`editor.html?file=${id}`)
    }
    get() {
        return localStorage.getItem('files') ? JSON.parse(localStorage.getItem('files')) : alert("Something went wrong! We couldn't get your files.")
    }
    save(filename, folderID) {
        let files = this.get()
        let fil = ObjectHelper.filter('parent', '=', folderID, files)

        function execute() {
            try {
                let file = { id: FileIndex.next(), name: filename, editor: '', content: '', parent: folderID }
                files.push(file)
                localStorage.setItem('files', JSON.stringify(files))
                return true
            } catch (err) {
                console.error(err)
                return false
            }
        }

        return (ObjectHelper.filter('name', '=', filename, fil).length < 1) ? execute() : false
    }
    update(files = Files) {
        try {
            localStorage.setItem('files', JSON.stringify(files))
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }
    delete(fileId) {
        try {
            let files = this.get()
            let index = ObjectHelper.findIndex('id', fileId, files)
            files.splice(index, 1)
            localStorage.setItem('files', JSON.stringify(files))
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }
    rename(id, newname) {
        let files = Files
        files = this.get()
        files[ObjectHelper.findIndex('id', id, files)].name = newname
        this.update(files)
    }
}
export const File = file.prototype
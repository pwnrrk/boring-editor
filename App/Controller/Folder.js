import { ObjectHelper } from "../Helper/Object.helper.js"
import { Folders } from "../Model/Folders.js"
import { FolderIndex } from "./FolderIndex.js"

class folder {
    open(id){
        window.location.href = `?folder=${id}`
    }
    delete(targetID) {
        //TODO Delete child
        let folders = JSON.parse(localStorage.getItem('folders'))
        let index = ObjectHelper.findIndex('id', targetID, folders)
        folders.splice(index, 1)
        localStorage.setItem('folders', JSON.stringify(folders))
    }
    get() {
        if (localStorage.getItem('folders')) {
            return JSON.parse(localStorage.getItem('folders'))
        }
    }
    save(foldername, folderID) {
        let folders = this.get()
        let fil = ObjectHelper.filter('parent', '=', folderID, folders)
        if (ObjectHelper.filter('name', '=', foldername, fil).length < 1) {
            let folder = { id: FolderIndex.next(), name: foldername, parent: folderID }
            folders.push(folder)
            localStorage.setItem('folders', JSON.stringify(folders))
            return true
        } else {
            return false
        }
    }
    update(folders = Folders) {
        localStorage.setItem('folders', JSON.stringify(folders))
    }
    rename(id,newname){
        let folders = Folders
        folders = this.get()
        folders[ObjectHelper.findIndex('id',id,folders)].name = newname
        this.update(folders)
    }
}
export const Folder = folder.prototype
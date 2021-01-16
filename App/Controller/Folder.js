import { ObjectHelper } from "../Helper/Object.helper.js"

class folder {
    delete(targetID) {
        //TODO Delete child
        let folders = JSON.parse(localStorage.getItem('folders'))
        let index = ObjectHelper.findIndex('id', targetID, folders.folders)
        folders.folders.splice(index, 1)
        localStorage.setItem('folders', JSON.stringify(folders))
    }
    get() {
        if (localStorage.getItem('folders')) {
            return JSON.parse(localStorage.getItem('folders'))
        }
    }
    save(foldername, folderID) {
        let folders = this.get()
        let fil = ObjectHelper.filter('parent', '=', folderID, folders.folders)
        if (ObjectHelper.filter('name', '=', foldername, fil).length < 1) {
            let folder = { id: folders.folders[folders.folders.length - 1].id + 1, name: foldername, parent: folderID }
            folders.folders.push(folder)
            localStorage.setItem('folders', JSON.stringify(folders))
            return true
        } else {
            return false
        }
    }
    update(folders) {
        localStorage.setItem('folders', JSON.stringify(folders))
    }
}
export const Folder = folder.prototype
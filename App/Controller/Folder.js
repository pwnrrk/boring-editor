import { ObjectHelper } from "../Helper/Object.helper.js"
import { Folders } from "../Model/Folders.js"
import { File } from "./File.js"
import { FolderIndex } from "./FolderIndex.js"
import { AlertHelper } from "../Helper/Alert.helper.js"

class folder {
    open(id) {
        window.location.href = `?folder=${id}`
    }
    delete(targetID) {
        let folders = this.get()
        let index = ObjectHelper.findIndex('id', targetID, folders)

        let childFiles = ObjectHelper.filter('parent', targetID, File.get())
        childFiles.forEach(child => {
            File.delete(child.id)
        })

        let childFolders = ObjectHelper.filter('parent', targetID, folders)
        childFolders.forEach(child => {
            this.delete(child.id)
        })

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
    rename(id, newname) {
        let folders = Folders
        folders = this.get()
        folders[ObjectHelper.findIndex('id', id, folders)].name = newname
        this.update(folders)
    }
    moveTo(id, targetId, type) {
        let toMove
        if (type == 'folder') {
            toMove = ObjectHelper.find('id', id, this.get())
            if (checkExist() && checkName(this.get()) && checkInner()) {
                let folders = this.get()
                folders[ObjectHelper.findIndex('id', toMove.id, folders)].parent = targetId
                this.update(folders)
                return true
            }else{
                return false
            }
        } else {
            toMove = ObjectHelper.find('id', id, File.get())
            if (checkExist() && checkName(File.get())) {
                let files = File.get()
                files[ObjectHelper.findIndex('id', toMove.id, files)].parent = targetId
                File.update(files)
                return true
            }else{
                return false
            }
        }
        function checkExist() {
            if (toMove.parent == targetId) {
                AlertHelper.alert('Cannot Move','Item is already in folder!')
                return false
            } else {
                return true
            }
        }
        function checkName(array) {
            let filter = ObjectHelper.filter('parent', '=', targetId, array)
            filter = ObjectHelper.filter('name', '=', toMove.name, filter)
            if (filter.length > 0) {
                AlertHelper.alert('Cannot Move','Destination folder have an item with the same name!')
                return false
            } else {
                return true
            }

        }
        function checkInner() {
            const root = 0
            let temp = targetId
            let paths = []
            while (temp != root) {
                let folder = ObjectHelper.find('id', temp, Folder.get())
                temp = folder.parent
                paths.push(folder)
            }
            if (toMove.id == targetId) {
                AlertHelper.alert('Cannot Move','Cannot move to itself!')
                return false
            }
            else if (ObjectHelper.filter('parent','=',toMove.id,paths).length>0){
                AlertHelper.alert('Cannot Move','Cannot move to itself!')
                return false
            }else{
                return true
            }
        }
    }
}
export const Folder = folder.prototype
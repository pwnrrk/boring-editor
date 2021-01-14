class folder {
    delete(folder){
        let folders = JSON.parse(localStorage.getItem('folders'))
        let index = folders.folders.findIndex((x=> x.name == folder))
        folders.folders.splice(index,1)
        localStorage.setItem('folders',JSON.stringify(folders))
    }
}
export const Folder = folder.prototype
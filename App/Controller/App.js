import { ObjectHelper } from "../Helper/Object.helper.js"
import { Files } from "../Model/Files.js"
import { Folders } from "../Model/Folders.js"
import { Folder } from "./Folder.js"

export const App = {
    init() {
        //For First Run
        localStorage.clear()
        let files = Files
        localStorage.setItem('files', JSON.stringify(files))
        localStorage.setItem('files_index', JSON.stringify([{ value: 0 }]))
        localStorage.setItem('folders_index', JSON.stringify([{ value: 0 }]))
        let folders = Folders
        localStorage.setItem('folders', JSON.stringify(folders))
        localStorage.setItem('inited', 'true')
    },

    getVersion() {
        let connect = new Promise((resolve, reject) => {
            let xmlhttp = new XMLHttpRequest()
            xmlhttp.onreadystatechange = function () {
                if (this.status == 200 && this.readyState == 4) {
                    let res = JSON.parse(this.responseText)
                    localStorage.setItem('version', JSON.stringify({ tag_name: res[0].tag_name, name: res[0].name, body: res[0].body }))
                    resolve(res)
                }
            }
            xmlhttp.open('GET', 'https://api.github.com/repos/pwnrrk/minimaleditor/releases')
            xmlhttp.send()
        })
        return connect
    },
    isIntit() {
        return localStorage.getItem('inited') ?? false
    },
    getPath(current = 0) {
        const root = 0
        let temp = current
        let path = '~/'
        let paths = []
        const folders = Folder.get()
        while (temp != root) {
            let folder = ObjectHelper.find('id', temp, folders)
            temp = folder.parent
            paths.push(folder)
        }
        paths = ObjectHelper.sort('parent', 'asc', paths)
        paths.map(x => {
            path += `${x.name}/`
        })
        return path
    }

}
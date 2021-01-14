class file{
    open(file){
        window.open(`editor.html?file=${file}`)
    }
    delete(file){
        let files = JSON.parse(localStorage.getItem('files'))
        let index = files.files.findIndex((x=> x.name == file))
        files.files.splice(index,1)
        localStorage.setItem('files',JSON.stringify(files))
    }
}
export const File = file.prototype
export const FileIndex = {
    next() {
        let current = 0
        let files_index = JSON.parse(localStorage.getItem('files_index'))
        current = files_index[files_index.length - 1].value
        current++
        files_index.push({ value: current })
        localStorage.setItem('files_index', JSON.stringify(files_index))
        return current
    }
}
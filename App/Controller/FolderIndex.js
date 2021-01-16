export const FolderIndex = {
    next() {
        let current = 0
        let folders_index = JSON.parse(localStorage.getItem('folders_index'))
        current = folders_index[folders_index.length - 1].value
        current++
        folders_index.push({ value: current })
        localStorage.setItem('folders_index', JSON.stringify(folders_index))
        return current
    }
}
export const AlertHelper = {
    alert(title='',body=''){
        document.getElementById('alert-title').innerText = title
        document.getElementById('alert-body').innerText = body
        openModal('#alert')
    }
}
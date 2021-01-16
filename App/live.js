//Live Html Feature

import { ObjectHelper } from "./Helper/Object.helper.js"

const url = new URLSearchParams(window.location.search)
let files = JSON.parse(localStorage.getItem('files'))
let content = ObjectHelper.find('id',url.get('file'),files).content
window.onload = ()=>{
    window.document.write(content)
}
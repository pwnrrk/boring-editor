import { MenuBar } from "./Controller/MenuBar.js"

//Element
 const editor = document.getElementById('editor')
 const wrapper = document.getElementById('wrapper')
 const line = document.getElementById('line')
 const filename = document.getElementById('filename')
 const autosaving = document.getElementById('autosaving')

 //Set default file name
 filename.value = 'untitled.txt'

 //Get temp file name
 if (localStorage.getItem('filename')) {
     filename.value = localStorage.getItem('filename')
 }

 //Get temp content
 if (localStorage.getItem('tempEditor')) {
     editor.innerText = localStorage.getItem('tempEditor')
     linenumber()
 }

 //Set title from file name
 document.title = filename.value

 //Add line number and save to temp
 editor.addEventListener('keyup', event => {
     linenumber()
     autosave()
 })

 //Save file name to temp
 filename.addEventListener('input', event => {
     localStorage.setItem('filename', filename.value)
     document.title = filename.value
 })

 //Add line number 
 function linenumber() {
     let lines = countLines()
     let template = document.createDocumentFragment()
     for (let i = 0; i < lines; i++) {
         let div = document.createElement('div')
         div.textContent = (i + 1)
         template.appendChild(div)
     }
     line.innerHTML = ''
     line.appendChild(template)
 }

 //Count line
 function countLines() {

     // Get element with 'content' as id                             
     var el = editor;

     // Get total height of the content     
     var divHeight = el.offsetHeight

     // object.style.lineHeight, returns  
     // the lineHeight property 
     // height of one line
     var lineHeight = parseInt(el.style.lineHeight);
     var lines = divHeight / lineHeight;
     return lines
 }

 //Auto save
 function autosave() {
     setTimeout(() => {
         if (!autosaving.classList.contains('showing')) {
             autosaving.classList.add('showing')
         }
         let text = editor.innerText
         localStorage.setItem('tempEditor', text)
     }, 700)
     setTimeout(() => {

         autosaving.classList.remove('showing')
     }, 2500)
 }
 //Send user to editor
 document.addEventListener('click', e => {
     if (e.target == wrapper || e.target != editor && wrapper.contains(e.target) && editor.innerText == '') {
         editor.focus()
     }
 })

 //Tab insert
 window.addEventListener("keydown", event=>{
     insertTabAtCaret(event)
     overrideCtrlA(event)
     overrideCtrlS(event)
    });

 function insertTabAtCaret(event) {
     if (event.keyCode == 9) {
         event.preventDefault()
         var range = window.getSelection().getRangeAt(0);

         var tabNode = document.createElement('i')
         tabNode.innerHTML = '&#09;'
         range.insertNode(tabNode);

         range.setStartAfter(tabNode);
         range.setEndAfter(tabNode);
     }
 }

 function overrideCtrlA(event){
    if(event.key == "a" && event.ctrlKey &&event.target!=editor){
        event.preventDefault()
        MenuBar.selectAll()
    }
 }

 function overrideCtrlS(event){
    if(event.key == "s" && event.ctrlKey){
        event.preventDefault()
        openModal("#save")
    }
 }

 //Disable scroll by space bar
 window.onkeydown = function (e) {
     return !(e.keyCode == 32 && e.target == document.body);
 };

 document.getElementById('menubar').addEventListener('mousedown',e=>{
    e.preventDefault()
 })

 //Menubar here
document.getElementById('save-btn').addEventListener('click',()=>MenuBar.save())
document.getElementById('undo-btn').addEventListener('click',()=>MenuBar.undo())
document.getElementById('redo-btn').addEventListener('click',()=>MenuBar.redo())
document.getElementById('cut-btn').addEventListener('click',()=>MenuBar.cut())
document.getElementById('copy-btn').addEventListener('click',()=>MenuBar.copy())
document.getElementById('paste-btn').addEventListener('click',()=>MenuBar.paste())
document.getElementById('selectall-btn').addEventListener('click',()=>MenuBar.selectAll())
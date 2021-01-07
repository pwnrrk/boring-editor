class Menubar {

    /**
     * Save content to file
     */
    save() {
        // Convert the text to BLOB.
        const textToBLOB = new Blob([editor.innerText], { type: 'text/plain' });
        const sFileName = filename.value;	   // The file to save the data.

        let newLink = document.createElement("a");
        newLink.download = sFileName;

        if (window.webkitURL != null) {
            newLink.href = window.webkitURL.createObjectURL(textToBLOB);
        }
        else {
            newLink.href = window.URL.createObjectURL(textToBLOB);
            newLink.style.display = "none";
            document.body.appendChild(newLink);
        }
        newLink.click();
    }

    undo() {
        document.execCommand('undo', false, null);
    }
    redo() {
        document.execCommand('redo', false, null);
    }
    cut() {
        document.execCommand('cut', false, null)
    }
    copy(){
        document.execCommand('copy',false,null)
    }
    paste(){
        document.execCommand('paste',false,null)
    }
    selectAll(){
        var range = document.createRange();
        range.selectNode(editor);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    newFile(){
        localStorage.clear()
        location.reload()
    }
};

export const MenuBar = Menubar.prototype
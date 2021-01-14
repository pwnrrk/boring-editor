window.onload = () => {
    initnavbar()
    initmodal()
    initpopup()
    initAnimateSlideStyle()
    initCollapse()
    initForm()
    initDropdown()
}

function initnavbar() {
    document.addEventListener('click', (ev) => {
        document.querySelectorAll('.navbar-toggler').forEach(e => {
            if (ev.target == e || e.contains(ev.target)) {
                toggleCollapse(e.dataset.target)
            }
        })
    })

}

function toggleCollapse(target) {
    document.querySelectorAll(target).forEach(e => {
        if (e.classList.contains('opened')) {
            slideUpElement(e)

            function slideRemove() {
                if (e.classList.contains('opened')) {
                    e.classList.remove('opened')
                }
                removeSlideHandler(e)
            }

            function removeSlideHandler() {
                e.removeEventListener('animationend', slideRemove)
                e.removeEventListener('webkitAnimationEnd', slideRemove)
            }

            e.addEventListener('animationend', slideRemove)
            e.addEventListener('webkitAnimationEnd', slideRemove)
        } else {
            e.classList.add('opened')
            slideDownElement(e)
        }
    })
}

function initCollapse() {
    document.addEventListener('click', (ev) => {
        document.querySelectorAll('a,.btn').forEach(e => {
            if (ev.target == e || e.contains(ev.target)) {
                if (e.dataset.toggle == 'collapse') {
                    toggleCollapse(e.dataset.target)
                }
            }
        })
    })
}

function initAnimateSlideStyle() {
    let style = document.createElement('style')
    style.id = 'mb-slide-elm'
    document.querySelectorAll('head').forEach(h => {
        h.append(style)
    })
}

function slideDownElement(e) {
    document.querySelectorAll('#mb-slide-elm').forEach(slide => {
        slide.innerHTML = `
        @keyframes slide-elm-down {
            from{
                max-height: 0px;   
            }
            to{
                max-height: ${e.offsetHeight}px;
            }
        }
        `
    })
    e.setAttribute('style', 'animation: slide-elm-down .3s ease;will-change:height;')
    e.addEventListener('animationend', () => {
        e.removeAttribute('style')
    })
}

function slideUpElement(e) {
    document.querySelectorAll('#mb-slide-elm').forEach(slide => {
        slide.innerHTML = `
        @keyframes slide-elm-up {
            from{
                max-height: ${e.offsetHeight}px;
            }
            to{
                max-height: 0px;
            }
        }
        `
    })
    e.setAttribute('style', 'animation: slide-elm-up .3s ease;')
    e.addEventListener('animationend', () => {
        e.removeAttribute('style')
    })
}

function initmodal() {
    document.addEventListener('click', (ev) => {
        let flow = true
        document.querySelectorAll('.btn,.close,a').forEach(e => {
            if (ev.target == e || e.contains(ev.target)) {
                if (e.dataset.toggle == 'modal') {
                    openModal(e.dataset.target)
                    flow = false
                    return false
                } else if (e.dataset.dismiss == 'modal') {
                    closeModal()
                    flow = false
                    return false
                }
            }
        })
        if (flow) {
            document.querySelectorAll('.modal.showing').forEach(modal => {
                if (ev.target == modal) {
                    if (modal.classList.contains('static')) {
                        let dialog = modal.querySelectorAll('.modal-dialog').item(0)
                        if (modal.classList.contains('br') || modal.classList.contains('bl') || modal.classList.contains('tr') || modal.classList.contains('tl')) {
                            dialog.setAttribute('style', 'transform:scale(1.02);will-change:transform;')
                        } else {
                            dialog.setAttribute('style', 'transform:scale(1.02) translate(-50%);will-change:transform;')
                        }
                        dialog.addEventListener('transitionend', () => {
                            dialog.removeAttribute('style')
                        })
                        return false
                    } else {
                        closeModal()
                        return false
                    }
                }
            })
        }

    })
    document.addEventListener('keyup', closeModalEsc)
}

function openModal(target) {
    document.querySelectorAll(target).forEach(modal => {
        modal.classList.add('showing')
        if(document.body.offsetHeight > window.innerHeight){
            document.body.style.paddingRight = `${window.innerWidth - document.body.clientWidth}px`
        }
        document.body.classList.add('modal-open')
    })
}

function closeModalEsc(ev) {
    if (ev.key == 'Escape') {
        let close = true
        document.querySelectorAll('.modal.showing').forEach(e => {
            if (e.classList.contains('static')) {
                let dialog = e.querySelectorAll('.modal-dialog').item(0)
                if (e.classList.contains('br') || e.classList.contains('bl') || e.classList.contains('tr') || e.classList.contains('tl')) {
                    dialog.setAttribute('style', 'transform:scale(1.02);will-change:transform;')
                } else {
                    dialog.setAttribute('style', 'transform:scale(1.02) translate(-50%);will-change:transform;')
                }
                dialog.addEventListener('transitionend', () => {
                    dialog.removeAttribute('style')
                })
                close = false
                return false
            }
        })
        if (close) {
            closeModal()
        }
    }
}

function closeModal(target) {
    if(target == undefined) target = '.modal.showing'
    document.querySelectorAll(target).forEach(modal => {
        if (modal.classList.contains('showing')) {
            modal.classList.add('goingout')
            modal.addEventListener('animationend', () => {
                if (modal.classList.contains('goingout')) {
                    modal.classList.remove('goingout')
                    modal.classList.remove('showing')
                    document.body.classList.remove('modal-open')
                    document.body.style.paddingRight = ""
                }
            })
        }
    })
}

function initpopup() {
    document.addEventListener('click', (ev) => {
        let flow = true
        document.querySelectorAll('.btn,a').forEach(e => {
            if (ev.target == e || e.contains(ev.target)) {
                if (e.dataset.toggle == 'popup') {
                    openPopup(e, e.dataset.target)
                    flow = false
                }
            }
        })
        if (flow) {
            document.querySelectorAll('.popup.showing').forEach(popup => {
                if (!(ev.target == popup || popup.contains(ev.target))) {
                    closePopup()
                }
            })
        }
    })
}

function openPopup(source, target) {
    document.querySelectorAll(target).forEach(popup => {
        if(popup.classList.contains('showing')){
            closePopup(target)
        } else { 
            if (!popup.classList.contains('stack')) {
                closePopup()
            }
            popup.classList.add('showing')
            if (popup.classList.contains('dash-right')) {
                popup.setAttribute('style', `left: ${source.offsetLeft + source.offsetWidth + 10}px;top: ${source.offsetTop}px`)
            } else {
                popup.setAttribute('style', `left: ${source.offsetLeft}px;top: ${source.offsetTop + source.offsetHeight + 10}px`)
            }
        }
    })
}

function closePopup(target) {
    if(target == undefined) target = '.popup.showing'
    document.querySelectorAll(target).forEach(popup => {
        popup.classList.add('goingout')
        popup.addEventListener('animationend', () => {
            if (popup.classList.contains('goingout')) {
                popup.classList.remove('goingout')
                popup.classList.remove('showing')
            }
        })
    })
}

function initDropdown() {
    document.addEventListener('click', (ev) => {
        let flow = true
        document.querySelectorAll('.btn,a').forEach(e => {
            if (ev.target == e || e.contains(ev.target)) {
                if (e.dataset.toggle == 'dropdown') {
                    openDropdown(e,e.dataset.target)
                    flow = false
                }
            }
        })
        if(flow){
            document.querySelectorAll('.dropdown-link').forEach(link=>{
                if ((ev.target == link || link.contains(ev.target))) {
                    closeDropdown()
                    flow = false
                }
            })
        }
        if (flow) {
            document.querySelectorAll('.dropdown.showing').forEach(dropdown => {
                if (!(ev.target == dropdown || dropdown.contains(ev.target))) {
                    closeDropdown()
                }
            })
        }
    })

}

function openDropdown(source,target) {
    document.querySelectorAll(target).forEach(dropdown => {
        if (dropdown.classList.contains('showing')){
            closeDropdown(target)
        }else {
            if (!dropdown.classList.contains('stack')) {
                closeDropdown()
            }
            dropdown.classList.add('showing')
            dropdown.setAttribute('style', `top: ${source.offsetTop + source.offsetHeight}px;left:${source.offsetLeft}px`)
            if(dropdown.getBoundingClientRect().left + dropdown.getBoundingClientRect().width > window.innerWidth){
                dropdown.setAttribute('style', `top: ${source.offsetTop + source.offsetHeight}px;left:${source.offsetLeft - dropdown.getBoundingClientRect().width + source.getBoundingClientRect().width}px`)
            }
        }
    })
}

function closeDropdown(target) {
    if(target == undefined) target = '.dropdown.showing'
    document.querySelectorAll(target).forEach(dropdown => {
        dropdown.classList.remove('showing')
    })
}

function initForm() {
    formValidate()

    function formValidate() {
        document.querySelectorAll('.valid').forEach(e => {
            e.parentElement.querySelectorAll('.form-item-invalid-message').forEach(invalid => {
                invalid.classList.remove('showing')
            })
            e.parentElement.querySelectorAll('.form-item-valid-message').forEach(valid => {
                valid.classList.add('showing')
            })
        })
        document.querySelectorAll('.invalid').forEach(e => {
            e.parentElement.querySelectorAll('.form-item-invalid-message').forEach(invalid => {
                invalid.classList.add('showing')
            })
            e.parentElement.querySelectorAll('.form-item-valid-message').forEach(valid => {
                valid.classList.remove('showing')
            })
        })
    }
    document.addEventListener('input', (ev) => {
        formValidate()
    })
    document.addEventListener('change', (ev) => {
        formValidate()
    })
    document.addEventListener('click', (ev) => {
        formValidate()
    })
}
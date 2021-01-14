const MB = class {
    /**
     * Find all validation for display
     */
    formValidate() {
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
    /**
     * Toggle popup
     * @param {Element} source Source element
     * @param {String} target Target element (Need selector)
     */
    openPopup(source, target) {
        document.querySelectorAll(target).forEach(popup => {
            if (!popup.classList.contains('showing')) {
                if (!popup.classList.contains('stack')) {
                    this.closePopup()
                }
                popup.classList.add('showing')
                if (popup.classList.contains('dash-right')) {
                    popup.setAttribute('style', `left: ${source.offsetLeft + source.offsetWidth}px;top: ${source.offsetTop}px`)
                } else {
                    popup.setAttribute('style', `right: ${(document.body.offsetWidth - source.offsetLeft) - source.offsetWidth}px;top: ${source.offsetTop + source.offsetHeight + 10}px`)
                }
            }
        })
    }
    /**
     * Close popup
     * @param {String} target Target popup to close (Need selector) leave undefined to close all
     */
    closePopup(target) {
        if (target == undefined) target = '.popup.showing'
        document.querySelectorAll(target).forEach(popup => {
            if (popup.classList.contains('showing')) {
                popup.classList.add('goingout')
                popup.addEventListener('animationend', () => {
                    if (popup.classList.contains('goingout')) {
                        popup.classList.remove('goingout')
                        popup.classList.remove('showing')
                    }
                })
            }
        })
    }
    /**
     * Close modal
     * @param {String} target Target modal to close (Need selector) leave undefined to close all
     */
    closeModal(target) {
        if (target == undefined) target = '.modal.showing'
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
    /**
     * Dismiss specific modal
     * @param {String} target Target modal to dismiss (Need selector)
     */
    dismissModal(target) {
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
    /**
     * Open modal
     * @param {String} target Target id (Need selector)
     */
    openModal(target) {
        document.querySelectorAll(target).forEach(modal => {
            modal.classList.add('showing')
            if (document.body.offsetHeight > window.innerHeight) {
                document.body.style.paddingRight = `${window.innerWidth - document.body.clientWidth}px`
            }
            document.body.classList.add('modal-open')
        })
    }
    /**
     * Toggle collapse
     * @param {String} target Target id (Need selector)
     */
    toggleCollapse(target) {
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

    /**
     * Open dropdown elelement
     * @param {String} target Target dropdown (Need selector)
     */
    openDropdown(target) {
        document.querySelectorAll(target).forEach(dropdown => {
            if (!dropdown.classList.contains('showing')) {
                if (!dropdown.classList.contains('stack')) {
                    this.closeDropdown()
                }
                dropdown.classList.add('showing')
                dropdown.setAttribute('style', `top: ${source.offsetTop + source.offsetHeight}px;left:${source.offsetLeft}px`)
                if (dropdown.getBoundingClientRect().left + dropdown.getBoundingClientRect().width > window.innerWidth) {
                    dropdown.setAttribute('style', `top: ${source.offsetTop + source.offsetHeight}px;left:${source.offsetLeft - dropdown.getBoundingClientRect().width + source.getBoundingClientRect().width}px`)
                }
            }
        })
    }
    /**
     * Close dropdown
     * @param {String} target Target popup to close (Need selector) leave undefined to close all
     */
    closeDropdown(target) {
        if (target == undefined) target = '.dropdown.showing'
        document.querySelectorAll(target).forEach(dropdown => {
            dropdown.classList.remove('showing')
        })
    }
}

const MinB = MB.prototype

export { MinB }
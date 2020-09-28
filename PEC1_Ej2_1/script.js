const form = document.getElementById('form')
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const password2 = document.getElementById('password2')

function showError(input, msg) {
    const formControl = input.parentElement
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small')
    small.innerText = msg
}

function showSuccess(input) {
    const formControl = input.parentElement
    formControl.className = 'form-control success'
}

function checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
        showSuccess(input)
    } else {
        showError(input, 'Email is not valid')
    }
}

function checkPassword(input) {
    const checkIns = {
        // The string must contain at least 1 lowercase character
        lowercase: /(?=.*[a-z])/,
        // The string must contain at least 1 uppercase character
        uppercase: /(?=.*[A-Z])/,
        // The string must contain at least 1 numeric character
        numeric: /(?=.*[0-9])/,
        // The string must contain at least 1 special character
        special: /(?=.*[!@#$%^&*])/
    }
    for (let check of Object.keys(checkIns)) {
        if (!checkIns[check].test(input.value.trim())) {
            showError(input, `PW must contain at least one ${check} character`)
            break;
        }
    }
}

function checkRequired(inputArr) {
    inputArr.map((input) => {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)} is required`)
        } else {
            showSuccess(input)
        }
    })
}

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at least ${min} characters`)
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less than ${max} characters`)
    } else {
        showSuccess(input)
    }
}

function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords do not match')
    }
}

function getFieldName(input) {
    return `${input.id[0].toUpperCase()}${input.id.slice(1, input.id.length)}`
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    checkRequired([username, email, password, password2])
    checkLength(username, 3, 15)
    checkLength(password, 6, 25)
    checkEmail(email)
    checkPassword(password)
    checkPasswordsMatch(password, password2)
})


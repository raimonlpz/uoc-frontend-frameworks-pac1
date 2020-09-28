const container = document.querySelector('.container')
const seats = document.querySelectorAll('.row .seat:not(.occupied)')
const count = document.getElementById('count')
const total = document.getElementById('total')
const currencyText = document.getElementById('currency-txt')
const movieSelect = document.getElementById('movie')
const currencySelect = document.getElementById('currency')

populateUI()

let ticketPrice = +movieSelect.value

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex)
    localStorage.setItem('selectedMoviePrice', moviePrice)
}

// Save selected currency
function setCurrencyData(currencyIndex, currencyValue) {
    localStorage.setItem('selectedCurrencyIndex', currencyIndex)
    localStorage.setItem('selectedCurrency', currencyValue)
}

// Save currencies data in a Map to save API calls
function setCurrenciesExchangeData(currencyName, currencyValue) {
    let currencies = JSON.parse(localStorage.getItem('currencyExchanges'))
    if (currencies !== null) {
        currencies[currencyName] = currencyValue
        localStorage.setItem('currencyExchanges', JSON.stringify(currencies))
    } else {
        localStorage.setItem('currencyExchanges', JSON.stringify({ [currencyName]: currencyValue }))
    }
}

async function calculateCurrency() {
    let total
    let currencies = JSON.parse(localStorage.getItem('currencyExchanges'))
    if (currencies && currencies[currencySelect.value]) {
        return currencies[currencySelect.value]
    }
    await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
        .then(res => res.json())
        .then(data => {
            const rate = data.rates[currencySelect.value]
            total = rate
            setCurrenciesExchangeData(currencySelect.value, rate)
        })
    return total
}

// Update total and count
function updateSelectedCount(currencyValue) {
    const selectedSeats = document.querySelectorAll('.row .seat.selected')

    const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat))
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex))

    const selectedSeatsCount = selectedSeats.length
    count.innerText = selectedSeatsCount
    total.innerText = (selectedSeatsCount * currencyValue * ticketPrice).toFixed(2)
}

function updateSelectedCurrency() {
    currencyText.innerText = currencySelect.value
    calculateCurrency()
        .then((res) => {
            Object.keys(movie.options).map((k) => {
                let txt = movie.options[k].innerText
                let data = txt
                    .split('')
                    .splice(txt.lastIndexOf('('), txt.length - 1)

                movie.options[k] = new Option(
                    txt
                        .replace(data.join(''),
                            `(${(movie.options[k].value * res).toFixed(2)} ${currencySelect.value})`
                        ),
                    movie.options[k].value
                )
            })
            movieSelect.selectedIndex = localStorage.getItem('selectedMovieIndex')
            updateSelectedCount(res)
        })
}

// Get data from localStorage and populate UI
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'))
    if (selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected')
            }
        })
    }
    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex')
    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex
    }

    const selectedCurrencyIndex = localStorage.getItem('selectedCurrencyIndex')
    if (selectedCurrencyIndex !== null) {
        currencySelect.selectedIndex = selectedCurrencyIndex
    }
}

// Set click event
container.addEventListener('click', (e) => {
    if (
        e.target.classList.contains('seat') &&
        !e.target.classList.contains('occupied')
    ) {
        e.target.classList.toggle('selected')
        updateSelectedCurrency()
    }
})

movieSelect.addEventListener('change', (e) => {
    ticketPrice = +e.target.value
    setMovieData(e.target.selectedIndex, e.target.value)
    updateSelectedCurrency()
})

currencySelect.addEventListener('change', (e) => {
    setCurrencyData(e.target.selectedIndex, e.target.value)
    updateSelectedCurrency()
})

// Initial currency
updateSelectedCurrency()


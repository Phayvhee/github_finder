import Github from './github.js';
import UI from './ui.js';

// init Github
const github = new Github
// init UI
const ui = new UI
// search input
const searchUser = document.getElementById('searchUser')

function debounce(fn, delay = 300) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(...args), delay)
    }
}

async function handleSearch(e) {
    const userText = e.target.value.trim()

    if (!userText) {
        ui.clearProfile()
        return
    }

    const data = await github.getUser(userText)

    if (data.error) {
        ui.clearProfile()
        const message = data.profile && data.profile.message ? data.profile.message : data.error
        ui.showAlert(message, 'alert alert-danger')
        return
    }

    ui.showProfile(data.profile)
    ui.showRepos(data.repos)
}

if (searchUser) {
    searchUser.addEventListener('input', debounce(handleSearch, 400))
} else {
    console.error('Search input #searchUser not found in DOM.')
}
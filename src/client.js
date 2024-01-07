import { createRoot } from 'react-dom/client'
import { createFromFetch } from 'react-server-dom-webpack/client'

const node = document.getElementById('root')
const root = createRoot(node)

const fetchTree = async path => createFromFetch(fetch(`http://localhost:3000/rsc?path=${encodeURIComponent(path)}`))

const path = window.location.pathname
root.render(await fetchTree(path))

window.addEventListener('click', async e => {
    const target = e.target

    if (target.tagName === 'A') {
        e.preventDefault()

        const href = target.getAttribute('href')
        window.history.pushState({}, '', href)
        const tree = await fetchTree(href)
        root.render(tree)
    }
})

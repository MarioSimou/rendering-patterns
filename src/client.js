import { hydrateRoot } from 'react-dom/client'
import { deserialize } from './rsc'

const tree = await deserialize(window.__SERIALIZED_REACT_TREE__)
// hydrates the dom on the initial render
const root = hydrateRoot(document, tree)

document.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', async e => {
        e.preventDefault()

        const anchor = e.currentTarget
        const href = anchor.getAttribute('href')

        if (!href.startsWith('/')) {
            return
        }

        window.history.pushState({}, '', href)

        const res = await fetch(`/rsc?path=${encodeURIComponent(href)}`)
        // Request the page payload and deserialize it. The output of the deserialization is a react tree, which can be used in the render function.
        const serializedTree = await res.json()
        const tree = deserialize(serializedTree)

        // Re-hydrates the dom after a page change
        root.render(tree)
    })
})

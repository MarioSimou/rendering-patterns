import React from 'react'
export default function Head({ children }) {
    if (typeof window === 'undefined') {
        return null
    }

    return React.Children.forEach(children, child => {
        switch (child.type) {
            case 'title': {
                document.querySelector('title').innerText = child.props.children
                return
            }
            case 'meta': {
                const { name, content } = child.props
                const meta = document.querySelector(`meta[name="${name}"]`)
                if (meta) {
                    meta.setAttribute('content', content)
                    return
                }

                const node = document.createElement('meta')
                node.name = name
                node.content = content
                return document.head.append(node)
            }
        }
    })
}

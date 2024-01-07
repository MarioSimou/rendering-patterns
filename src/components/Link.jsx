export default function Link({ children, href }) {
    const onClick = e => {
        e.preventDefault()
        history.pushState({}, '', href)
        const event = new CustomEvent('popstate', { detail: { pathname: href } })
        window.dispatchEvent(event)
    }

    return (
        <a href={href} onClick={onClick}>
            {children}
        </a>
    )
}

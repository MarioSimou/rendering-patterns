import React from 'react'
import App from '../pages/_app'

export default function Router({ routes }) {
    const initialRoute = routes.find(route => route.pathname === window.location.pathname) ?? routes[0]
    const [route, setRoute] = React.useState({
        ...initialRoute,
        pageProps: window.__SSR__.pageProps,
    })

    React.useEffect(() => {
        const callback = async e => {
            const { pathname } = e.detail

            const route = routes.find(route => route.pathname === pathname)
            const res = await fetch(`http://localhost:3000${pathname}.json`)
            const { pageProps } = await res.json()
            window.__SSR__.pageProps = pageProps

            setRoute({
                ...route,
                pageProps,
            })
        }

        window.addEventListener('popstate', callback)
        return () => window.removeEventListener('popstate', callback)
    }, [])

    return <App page={route.component} pageProps={route.pageProps} />
}

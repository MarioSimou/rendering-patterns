import Meta from './Meta'
import Header from './Header'
import Search from './Search'

export default async function Layout({ children, title }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="stylesheet" href="/public/style.css" />
            </head>
            <body>
                <div>
                    <Header />
                    <main className="grid gap-12 py-8 px-8 mx-auto lg:px-0 lg:max-w-screen-lg">
                        <Search />
                        {children}
                    </main>
                </div>
                <script type="module" src="/public/client.js" />
            </body>
        </html>
    )
}

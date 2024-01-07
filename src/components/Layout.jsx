import Header from './Header'
import Search from './Search'

export default async function Layout({ children }) {
    return (
        <div>
            <Header />
            <main className="grid gap-12 py-8 px-8 mx-auto lg:px-0 lg:max-w-screen-lg">
                <Search />
                {children}
            </main>
        </div>
    )
}

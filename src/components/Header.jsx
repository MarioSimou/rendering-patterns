import Link from './Link'
export default function Header() {
    return (
        <header className="py-4 px-8 max-w-screen-xl lg:mx-auto bg-gray-100 shadow-md">
            <nav className="flex gap-4">
                <Link href="/todos">Todos</Link>
                <Link href="/todos/1">Todo</Link>
                <Link href="/about">About</Link>
            </nav>
        </header>
    )
}

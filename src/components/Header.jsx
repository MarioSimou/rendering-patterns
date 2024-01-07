export default function Header() {
    return (
        <header className="py-4 px-8 bg-gray-100 shadow-md w-full">
            <nav className="flex gap-4 max-w-screen-lg mx-auto">
                <a href="/todos">Todos</a>
                <a href="/todos/1">Todo</a>
                <a href="/about">About</a>
            </nav>
        </header>
    )
}

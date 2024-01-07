export default function Search() {
    return (
        <div className="grid gap-2">
            <label className="font-bold" htmlFor="search">
                Search:
            </label>
            <input
                className="ring-2 ring-blue-300 px-6 py-3 rounded-lg focus:outline-none focus:ring-blue-500"
                id="search"
                type="search"
                placeholder="Search..."
            />
        </div>
    )
}

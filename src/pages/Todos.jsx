import Title from '../components/Title'

export default async function Todos() {
    const res = await fetch('http://localhost:3001/todos')
    const todos = await res.json()

    return (
        <div>
            <Title>Todos</Title>
            <ul>
                {todos.map((todo, i) => (
                    <li key={todo.id}>
                        {i + 1}. {todo.title}
                    </li>
                ))}
            </ul>
        </div>
    )
}

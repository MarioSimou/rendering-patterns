import Title from '../components/Title'
import { Suspense } from 'react'

const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000))

const TodosList = async () => {
    await delay(3)
    const res = await fetch('http://localhost:3001/todos')
    const todos = await res.json()

    return (
        <ul>
            {todos.map((todo, i) => (
                <li key={todo.id}>
                    {i + 1}. {todo.title}
                </li>
            ))}
        </ul>
    )
}

export default async function Todos() {
    return (
        <div>
            <Title>Todos</Title>
            <Suspense fallback={<div>Fetching todos...</div>}>
                <TodosList />
            </Suspense>
        </div>
    )
}

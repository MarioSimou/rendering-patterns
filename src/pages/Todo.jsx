import Title from '../components/Title'

export default async function Todo({ params }) {
    const res = await fetch(`http://localhost:3001/todos/${params.id}`)
    const todo = await res.json()

    return (
        <div>
            <Title>{todo.title}</Title>
        </div>
    )
}

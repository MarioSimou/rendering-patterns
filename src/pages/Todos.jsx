import Title from '../components/Title'
import Head from '../components/Head'

export default function Todos({ todos }) {
    return (
        <>
            <Head>
                <title>Todos</title>
                <meta name="description" content="Todos" />
            </Head>
            <div className="p-8">
                <Title>Todos</Title>
                <ul>
                    {todos.map((todo, i) => (
                        <li key={todo.id}>
                            {i + 1}. {todo.title}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export const getServerSideProps = async req => {
    const res = await fetch('http://localhost:3001/todos')
    const todos = await res.json()

    return {
        todos,
    }
}

import Head from '../components/Head'
import Title from '../components/Title'

export default function Todo({ todo }) {
    return (
        <>
            <Head>
                <title>{todo.title}</title>
                <meta name="description" content={todo.title} />
            </Head>

            <div>
                <Title>{todo.title}</Title>
            </div>
        </>
    )
}

export const getServerSideProps = async req => {
    const res = await fetch('http://localhost:3001/todos/1')
    const todo = await res.json()

    return {
        todo,
    }
}

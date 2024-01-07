import Todos from '../pages/Todos'
import Todo from '../pages/Todo'
import About from '../pages/About'
import Layout from './Layout'

export default async function ServerRouter(req) {
    const { searchParams } = new URL(req.originalUrl, 'http://localhost:3000')
    const path = req.path.startsWith('/rsc') ? decodeURIComponent(searchParams.get('path')) : req.params[0]

    switch (true) {
        case /(^\/todos$)/.test(path): {
            const Page = await Todos({ searchParams, params: {} })
            return await Layout({ children: Page })
        }
        case /(^\/todos\/\d+)/.test(path): {
            const id = path.split('/').pop()
            const Page = await Todo({ searchParams, params: { id } })
            return await Layout({ children: Page })
        }
        case /(^\/about$)/.test(path): {
            const Page = await About({ searchParams, params: {} })
            return await Layout({ children: Page })
        }
        default: {
            throw new Error(`Path '${req.path}' not implemented yet.`)
        }
    }
}

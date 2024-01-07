import { createRoot } from 'react-dom/client'
import Todos from '../.build/pages/Todos'
import About from '../.build/pages/About'
import Todo from '../.build/pages/Todo'
import { createBrowserRouter } from './createBrowserRouter'

const domNode = document.getElementById('root')
const root = createRoot(domNode)

const router = createBrowserRouter({
    routes: [
        {
            pathname: '/',
            component: Todos,
        },
        {
            pathname: '/todos',
            component: Todos,
        },
        {
            pathname: '/about',
            component: About,
        },
        {
            pathname: '/todos/1',
            component: Todo,
        },
    ],
})

root.render(router)

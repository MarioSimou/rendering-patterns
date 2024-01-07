import express from 'express'
import path from 'path'
import * as esbuild from 'esbuild'
import ServerRouter from '../.build/components/ServerRouter.js'
import ReactServerDom from 'react-server-dom-webpack/server.node'

const watchBuild = async () => {
    const ctx = await esbuild.context({
        entryPoints: ['./src/**/*.jsx'],
        bundle: true,
        outdir: '.build',
        jsx: 'automatic',
        jsxDev: true,
        platform: 'neutral',
        target: 'esnext',
        format: 'esm',
        loader: { '.jsx': 'jsx' },
    })

    const clientCtx = await esbuild.context({
        entryPoints: ['./src/client.js'],
        bundle: true,
        outdir: '.build',
        jsx: 'automatic',
        jsxDev: true,
        platform: 'browser',
        target: 'esnext',
        format: 'esm',
        loader: { '.js': 'js' },
        splitting: true,
        banner: {
            js: 'window.__webpack_require__ = id => import(id)',
        },
    })

    return await Promise.all([ctx.watch(), clientCtx.watch()])
}

const createServer = async () => {
    const app = express()
    const PORT = process.env.PORT || 3000

    app.use('/public', express.static(path.resolve(process.cwd(), '.build')))

    // This endpoint is called when a user navigates to a new page. Based on the current page, it will return a serialized form of the components executed on the server
    app.get('/rsc', async (req, res) => {
        // The router identifies which page to load. It will return the page as a JSX element
        const rootTree = await ServerRouter(req)
        // We need to serialize the tree in order to send the serialized form of the tree to the client, which in turn will hydrate the dom.
        const stream = ReactServerDom.renderToPipeableStream(rootTree)
        return stream.pipe(res)
    })

    // This endpoint is called on the initial load.
    app.get('*', async (req, res, next) => {
        if (req.path.startsWith('/rsc')) {
            return next()
        }

        return res.contentType('html').send(`
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charSet="utf-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <title>Todos</title>
                <link rel="stylesheet" href="/public/style.css"></link>
            </head>
            <body> 
                <div id="root">
                    <header class="py-4 px-8 bg-gray-100 shadow-md w-full">
                        <nav class="flex gap-4 max-w-screen-lg mx-auto">
                            <a href="/todos">Todos</a>
                            <a href="/todos/1">Todo</a>
                            <a href="/about">About</a>
                        </nav>
                    </header>
                    <main class="grid gap-12 py-8 px-8 mx-auto lg:px-0 lg:max-w-screen-lg">
                        <div>Loading...</div>
                    </main>
                </div>
            </body>
            </html>     
            <script type="module" src="/public/client.js"></script>
        `)
    })

    await watchBuild()

    app.listen(PORT, () => console.log(`The app is running on port ${PORT}`))
}

await createServer()

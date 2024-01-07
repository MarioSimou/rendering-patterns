import express from 'express'
import path from 'path'
import { renderToString } from 'react-dom/server'
import * as esbuild from 'esbuild'
import { serialize } from './rsc.js'
import ServerRouter from '../.build/components/ServerRouter.js'

const watchBuild = async () => {
    const ctx = await esbuild.context({
        entryPoints: ['./src/**/*.jsx', './src/client.js'],
        bundle: true,
        outdir: '.build',
        jsx: 'automatic',
        jsxDev: true,
        platform: 'browser',
        target: 'esnext',
        format: 'esm',
        loader: { '.jsx': 'jsx', '.js': 'js' },
    })

    return ctx.watch()
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
        const payload = await serialize(rootTree)
        return res.json(payload).end()
    })

    // This endpoint is called on the initial load.
    app.get('*', async (req, res, next) => {
        if (req.path.startsWith('/rsc')) {
            return next()
        }

        // The router identifies which page to load. It will return the page as a JSX element
        const rootTree = await ServerRouter(req)

        // We need to serialize the tree in order to send the serialized form of the tree to the client, which in turn will hydrate the dom.
        const payload = await serialize(rootTree)

        // Convert the JSX tree into html. We also inject a script with the serialized form of the tree.
        let html = renderToString(rootTree)
        html += `<script>window.__SERIALIZED_REACT_TREE__ =${JSON.stringify(payload).replace(/</g, '\\u003c')}</script>`
        return res.contentType('html').send(html)
    })

    await watchBuild()

    app.listen(PORT, () => console.log(`The app is running on port ${PORT}`))
}

await createServer()

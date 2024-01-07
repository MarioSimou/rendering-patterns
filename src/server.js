import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { renderToString } from 'react-dom/server'
import * as esbuild from 'esbuild'
import fs from 'node:fs/promises'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const watchJsx = async () => {
    const ctx = await esbuild.context({
        entryPoints: ['./src/**/*.jsx'],
        bundle: true,
        outdir: '.build',
        jsx: 'automatic',
        jsxDev: true,
        platform: 'browser',
        target: 'esnext',
        format: 'esm',
        loader: { '.jsx': 'jsx' },
    })

    return ctx.watch()
}

const watchClientEntrypoint = async () => {
    const ctx = await esbuild.context({
        entryPoints: ['./src/client.js'],
        bundle: true,
        outdir: './public',
        jsx: 'automatic',
        jsxDev: true,
        platform: 'browser',
        target: 'esnext',
        format: 'esm',
        loader: { '.js': 'jsx' },
    })

    return ctx.watch()
}

app.use(express.static(path.resolve(process.cwd(), 'public')))

const pages = {
    '/': {
        title: 'Todos',
        path: '../.build/pages/Todos.js',
    },
    '/todos': {
        title: 'Todos',
        path: '../.build/pages/Todos.js',
    },
    '/about': {
        title: 'About',
        path: '../.build/pages/About.js',
    },
    '/todos/1': {
        title: 'Todo',
        path: '../.build/pages/Todo.js',
    },
}

app.get('*', async (req, res) => {
    if (req.path.endsWith('.json')) {
        const path = req.path.replace(/^(.+).json$/, '$1')
        const page = pages[path]

        const { getServerSideProps } = await import(page.path)
        if (!getServerSideProps) {
            return res.json({ pageProps: {} })
        }

        const pageProps = await getServerSideProps(req)
        return res.json({ pageProps })
    }

    const path = req.path
    const page = pages[path]

    if (!page) {
        return res.status(404).send(`Page for '${path}' not found`)
    }

    const { default: Page, getServerSideProps } = await import(page.path)
    let pageProps

    if (getServerSideProps) {
        pageProps = await getServerSideProps(req)
    }

    const { default: Html } = await import('../.build/components/Html.js')
    const { default: App } = await import('../.build/pages/_app.js')

    const html = renderToString(
        Html({
            title: page.title,
            stylesheet: '/style.css',
            clientEntrypoint: '/client.js',
            pageProps,
            children: App({
                pageProps,
                page: Page,
            }),
        })
    )
    return res.contentType('html').send(html)
})

await watchJsx()
await watchClientEntrypoint()

app.listen(PORT, () => console.log(`The app is running on port ${PORT}`))

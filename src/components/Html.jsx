import Meta from './Meta'

export default function Html({
    children,
    title,
    language = 'en',
    charset = 'UTF-8',
    stylesheet,
    clientEntrypoint,
    pageProps,
}) {
    return (
        <html lang={language}>
            <head>
                <meta charSet={charset} />
                <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="stylesheet" href={stylesheet} />
            </head>
            <body>
                <div id="root">{children}</div>
                <script
                    type="module"
                    dangerouslySetInnerHTML={{
                        __html: `window.__SSR__ = ${JSON.stringify({
                            pageProps,
                        })}`,
                    }}
                />

                <script type="module" src={clientEntrypoint} />
            </body>
        </html>
    )
}

import Header from '../components/Header'

export default function App({ pageProps, page: Page }) {
    return (
        <div>
            <Header />
            <main className="p-8">
                <Page {...pageProps} />
            </main>
        </div>
    )
}

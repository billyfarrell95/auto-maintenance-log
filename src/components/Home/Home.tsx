import Header from "../Header/Header";

function Home() {
    return (
        <>
            <Header />
            <main className="main-wrapper">
                <div className="d-flex gap-1">
                    <a className="btn btn-primary" href="/login">Log in</a>
                    <a className="btn btn-secondary" href="/demo">Use demo</a>
                </div>
            </main>
        </>
    )
}

export default Home;
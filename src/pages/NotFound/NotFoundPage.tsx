import NavBar from '../../components/common/NavBar'

export default function NotFoundPage() {
  return (
    <>
      <NavBar />
      <main style={{ padding: 24 }}>
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </main>
    </>
  )
}
import { useRouteError } from "react-router-dom"

const ErrorBoundary = () => {
    let error = useRouteError()
    console.log(error)
  return (
    <div className="flex h-screen items-center justify-center font-custom text-gray-400">
        <h2 className="text-3xl font-thin">{error.code} | { error.message }</h2>
    </div>
  )
}

export default ErrorBoundary
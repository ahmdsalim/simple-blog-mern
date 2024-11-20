import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css";
import "./fonts.css";
import AppLayout from './pages/layouts/AppLayout.jsx'
import AuthLayout from "./pages/layouts/AuthLayout.jsx";
import Detail from './pages/detail/Detail.jsx'
import Login from './pages/login/Login.jsx'
import SignUp from './pages/signup/SignUp.jsx'
import Landing from './pages/landing/Landing.jsx'
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Posts from "./pages/post/Posts.jsx"
import CreatePost from "./pages/post/CreatePost.jsx"
import PostsByCat from "./pages/post/PostsByCat.jsx";
import EditPost from "./pages/post/EditPost.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL_LOCAL
axios.defaults.headers.common['Accept'] = 'application/json'

//loader
import { loader as detailLoader } from './pages/detail/Detail.jsx'
import { loader as createPostLoader } from './pages/post/CreatePost.jsx'

//actions
// import { action as createPostAction } from './pages/post/CreatePost.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: "/my-posts",
        element: <ProtectedRoute><Posts /></ProtectedRoute>
      },
      {
        path: "/my-posts/create",
        element: <ProtectedRoute><CreatePost /></ProtectedRoute>,
        // action: createPostAction,
        loader: createPostLoader
      },
      {
        path: "/my-posts/edit/:postId",
        element: <ProtectedRoute><EditPost /></ProtectedRoute>
      },
      {
        path: "/posts/:catId/category",
        element: <PostsByCat />,
        // loader: postsByCatLoader
      },
      {
        path: "/:postId",
        element: <Detail />,
        loader: detailLoader
      }
    ],
    errorElement: <ErrorBoundary />
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/sign-up",
        element: <SignUp />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;

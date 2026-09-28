import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Pages/Home'
import Session from './Pages/Session'

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Header /> <Home /></>
  },
  {
    path: "/session",
    element: <><Header /> <Session /></>
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
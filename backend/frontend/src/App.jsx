import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Header from './Components/Header'
import Progress from './Pages/Progress'
import Home from './Pages/Home'

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Header /> <Home /></>
  },
  {
    path: "/progress",
    element: <><Header /> <Progress /></>
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
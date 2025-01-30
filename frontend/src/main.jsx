import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Layout from './Layout.jsx'
import App from './App.jsx'
import Home from './components/Home/Home.jsx'
import Landingpage from './components/LandingPage/Landinpage.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Student from './components/Student/Student.jsx'
import SlipCreate from './components/SlipCreate/SlipCreate.jsx'
import SlipList from './components/SlipList/SlipList.jsx'
import SlipDetail from './components/SlipDetail/SlipDetail.jsx'
import Worker from './components/Worker/Worker.jsx'
import Profile from './components/Profile/Profile.jsx'
import Admin from './components/Admin/Admin.jsx'

const router = createBrowserRouter(
  createRoutesFromElements (
    <Route path='/' element={<Layout />} >
      <Route path='/' element={<Landingpage />} />
      <Route path='Login/:role' element={<Login />} />
      <Route path='Register/:role' element={<Register />} />
      <Route path='student-dashboard' element={<Student />} />
      <Route path='worker-dashboard' element={<Worker />} />
      <Route path='slip-create' element={<SlipCreate />} />
      <Route path='slip-list' element={<SlipList />} />
      <Route path='slip-detail/:id' element={<SlipDetail />} />
      <Route path='admin-dashboard' element={<Admin />} />
      <Route path='' element={<Home />} />
      <Route path='profile' element={<Profile />} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

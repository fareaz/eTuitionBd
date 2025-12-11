import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <div >
 
    
      <div className='sticky top-0 bg-white  z-50 backdrop-blur-sm  shadow max-w-7xl mx-auto'>
          <Navbar />
      </div>
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout
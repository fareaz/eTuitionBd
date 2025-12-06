import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'

const MainLayout = () => {
  return (
    <div className=''>
      <Navbar />
      <div className=''>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout
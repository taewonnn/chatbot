import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import GlobalHeader from './GlobalHeader';

function Layout() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <GlobalHeader />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;

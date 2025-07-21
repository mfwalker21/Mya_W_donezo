import { Outlet, useNavigate } from 'react-router-dom';
import supabase from '../client';

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a href="/" className="btn btn-ghost text-xl">Donezo</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <button onClick={handleLogout} className="btn btn-link">Logout</button>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
}

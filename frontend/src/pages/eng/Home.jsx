import { useState, useEffect } from 'react' ;
import { useNavigate, Link } from 'react-router-dom' ;
import { clearTokens, getAccessToken, authFetch } from "../../utils/auth";

import { MdDashboardCustomize } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";


function Home () {
    // Must function inside a compoenent not outSide a component
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!getAccessToken();
    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

    const fetchUser = async () => {
            try {
                const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

                const response = await authFetch(`${BASE}/api/me/`);

                if (!response.ok) {
                    throw new Error('Failed to get user information');
                }

                const data = await response.json();

                setUser(data);

            } catch (error) {
                console.error('Error fetching user:', error);

                clearTokens();
                navigate('/login');

            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, [isLoggedIn, navigate]);



    const handleLogout = () => {
    clearTokens();
    navigate('/login');
    }

    // Wrap everything in a Fragment
    return (
        <>
        <div className='flex items-center justify-between  bg-blue-50 p-5'>

          <h1 className="text-lg">
            Welcome to Online SHOP
          </h1>

          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-gray-800 cursor-pointer font-medium">
                  Login
                </Link>

                <Link to="/signup" className="text-gray-800 cursor-pointer font-medium">
                  Register
                </Link>
              </>
            ) : (
              
              <>
                {/* Username */}
                  {!loading && user && (
                    <>
                      <span className="font-medium text-gray-800">
                        {user.username}
                      </span>

                      {/* <span className="text-blue-600">
                        Role: {user.role}
                      </span> */}
                    </>
                  )}
                {/* Vendor Dashboard */}
                    {!loading && user?.role === 'vendor' && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-blue-500 font-medium"
                      >
                      <MdDashboardCustomize size={24} />
                        Dashboard
                      </Link>
                )}
                
                <IoMdLogOut
                  onClick={handleLogout}
                  size={24}
                  className="text-red-600 cursor-pointer"
                />
              </>
              
              
              
            )}
          </div>

        </div>
        </>
      );


}


export default Home ;
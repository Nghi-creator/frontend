import { useState, useEffect, useContext } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import ApiContext from './ApiContext';

export default function Me() {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!api.key) {
      setLoading(false);
      return;
    }

    fetch(`${api.url}/auth/me`, {
      headers: {
        Authorization: `Bearer ${api.key}`,
      },
    })
      .then(async (result) => {
        if (result.status === 200) {
          const data = await result.json();
          setMe(data);
        } else {
          localStorage.removeItem('token');
          api.setKey(null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [api.url, api.key]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    api.setKey(null);
    setMe(null);
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ClipLoader color="#2563EB" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">

        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-3xl">
            {me ? '👤' : '👻'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {me ? 'My Profile' : 'Guest Access'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {me ? me.email : 'You are not logged in.'}
          </p>
        </div>

        <div className="space-y-4">
          {me ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">User ID:</span>
                  <span className="text-gray-900">{me.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Role:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${me.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {me.isAdmin ? 'ADMIN' : 'USER'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/orders')}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
              >
                📦 View My Orders
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import ApiContext from './ApiContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Verify() {
  const api = useContext(ApiContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const schema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    fetch(`${api.url}/auth/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, otp: data.otp }),
    }).then(async (result) => {
      if (result.ok) {
        alert('Account verified!');
        navigate('/login', { replace: true });
      } else {
        const json = await result.json();
        alert(json.message || 'Verification failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your Email</h2>
        <p className="text-sm text-gray-600 mb-8">
          We've sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              {...register('otp')}
              className="block w-full text-center text-3xl tracking-widest px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="000000"
              maxLength={6}
            />
            {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
          >
            Verify Account
          </button>
        </form>
      </div>
    </div>
  );
}
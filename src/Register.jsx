import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useState } from 'react' 
import ApiContext from './ApiContext'
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const api = useContext(ApiContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const schema = z.object({
    email: z.email().min(5, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setIsLoading(true); 
    
    fetch(`${api.url}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(async (result) => {
      const json = await result.json().catch(() => ({})); 

      if (result.status === 201) {
        navigate('/verify', { state: { email: data.email }, replace: true });
      } else {
        alert(json.message || 'Registration failed');
        setIsLoading(false); 
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Network Error. Backend might be sleeping (wait 30s) or URL is wrong.");
      setIsLoading(false);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md space-y-6 mt-10"
    >
      <h2 className="text-xl font-bold text-center">Register</h2>

      <div>
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          {...register('email')}
          className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Password</label>
        <input
          type="password"
          {...register('password')}
          className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex gap-4">
        <button
          type="button" 
          onClick={() => navigate('/login')}
          className="w-1/3 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
          disabled={isLoading}
        >
          Back
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-2/3 text-white py-2 rounded transition ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Processing...' : 'Register'}
        </button>
      </div>
    </form>
  );
}
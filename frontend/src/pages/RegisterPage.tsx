import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { Alert } from '../components/ui/Alert';
import { UserRole } from '../types';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ defaultValues: { role: 'sales' } });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    setIsSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-slate-600">Join Smart Leads Dashboard</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="label-field">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label-field">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label-field">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label-field">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (val) =>
                    val === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="label-field">
                Role
              </label>
              <select id="role" className="input-field" {...register('role')}>
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

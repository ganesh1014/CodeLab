import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';

import {
  Code,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

const signupSchema = z.object({
  firstName: z
    .string()
    .min(3, 'Minimum character should be 3'),

  emailId: z
    .string()
    .email('Invalid Email'),

  password: z
    .string()
    .min(8, 'Password is too weak'),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">

      {/* Container */}
      <div className="w-full max-w-md">

        {/* Logo + Heading */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm mb-4">
            <Code className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-base-content">
            Create Account
          </h1>

          <p className="text-base-content/50 mt-2 text-sm">
            Join CodeLab and start solving problems
          </p>
        </div>

        {/* Card */}
        <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl">

          <div className="card-body p-8">

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* First Name */}
              <div className="form-control">

                <label className="label pb-2">
                  <span className="text-sm font-medium text-base-content/70">
                    First Name
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="John"
                  className={`input input-bordered w-full rounded-xl focus:border-indigo-500 focus:outline-none ${
                    errors.firstName ? 'input-error' : ''
                  }`}
                  {...register('firstName')}
                />

                {errors.firstName && (
                  <span className="text-error text-sm mt-2">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="form-control">

                <label className="label pb-2">
                  <span className="text-sm font-medium text-base-content/70">
                    Email Address
                  </span>
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered w-full rounded-xl focus:border-indigo-500 focus:outline-none ${
                    errors.emailId ? 'input-error' : ''
                  }`}
                  {...register('emailId')}
                />

                {errors.emailId && (
                  <span className="text-error text-sm mt-2">
                    {errors.emailId.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-control">

                <label className="label pb-2">
                  <span className="text-sm font-medium text-base-content/70">
                    Password
                  </span>
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`input input-bordered w-full rounded-xl pr-12 focus:border-indigo-500 focus:outline-none ${
                      errors.password ? 'input-error' : ''
                    }`}
                    {...register('password')}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <span className="text-error text-sm mt-2">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl w-full h-11 mt-2 disabled:bg-indigo-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-xs text-base-content/30 my-6">
              CodeLab
            </div>

            {/* Footer */}
            <div className="text-center">

              <span className="text-sm text-base-content/50">
                Already have an account?
              </span>

              <NavLink
                to="/login"
                className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign In
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;











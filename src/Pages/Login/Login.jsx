import { useState } from 'react';
import getDataFromSubCollection from '../../utils/dataFetch/getDataFromSubCollection';
import userRegister from '../../utils/auth/register';
import { signOut } from 'firebase/auth';
import { auth } from '../../FireBase/firebase';
import userLogin from '../../utils/auth/login';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [select, setSelect] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Container for the Card */}
      <div className="w-full flex justify-center px-4">
        {select === 'login' ? (
          <LoginComponent onSwitch={() => setSelect('register')} />
        ) : (
          <RegisterComponent onSwitch={() => setSelect('login')} />
        )}
      </div>

      {/* Floating Home Button */}
      <button
        onClick={() => navigate('/')}
        className="mt-8 px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm hover:text-[#dc2626] hover:border-[#dc2626] transition-all duration-300"
      >
        ← Go to Home
      </button>
    </div>
  );
};

export default Login;

/* -----------------------
  LOGIN COMPONENT 
  -----------------------
*/
const LoginComponent = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [firebaseLoginErr, setFierBaseLoginError] = useState({
    emailErr: '',
    passwoardErr: '',
  });

  const loginHandle = (e) => {
    e.preventDefault();
    const email = e.target['email'].value;
    const passwoard = e.target['password'].value;
    setFierBaseLoginError({ emailErr: '', passwoardErr: '' });
    userLogin(email, passwoard, navigate, setFierBaseLoginError);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#dc2626]"></div>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to manage your account</p>
      </div>

      <form onSubmit={loginHandle} className="space-y-4">
        <LoginInput
          inputtype="email"
          label="Email Address"
          placeholder="name@company.com"
          name="email"
          validator={(v) => /\S+@\S+\.\S+/.test(v)}
          errMsg="Enter a valid email address"
          fierbaseErr={firebaseLoginErr.emailErr}
          setFierBaseLoginError={setFierBaseLoginError}
          isLogInHandle={true}
        />
        <LoginInput
          inputtype="password"
          label="Password"
          placeholder="••••••••"
          name="password"
          validator={(v) => v && v.length >= 6}
          errMsg="Password must be at least 6 characters"
          fierbaseErr={firebaseLoginErr.passwoardErr}
          setFierBaseLoginError={setFierBaseLoginError}
          isLogInHandle={true}
        />
        
        <button
          className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-600/40 transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
          type="submit"
        >
          Sign In
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-8">
        Don't have an account?{' '}
        <span
          className="text-[#dc2626] font-bold cursor-pointer hover:underline transition-all"
          onClick={onSwitch}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

/* -----------------------
  REGISTER COMPONENT 
  -----------------------
*/
const RegisterComponent = ({ onSwitch }) => {
  const [firebaseREGErr, setFierBaseregError] = useState('');
  const navigater = useNavigate();

  const registerHandle = (e) => {
    e.preventDefault();
    const name = `${e.target['firstName'].value} ${e.target['lastName'].value}`;
    const email = e.target['email'].value;
    const address = e.target['address'].value;
    const passwoard = e.target['password'].value;
    const cpasswoard = e.target['confirmPassword'].value;
    const phoneNumber = e.target['phoneNumber'].value;
    const profileImage = e.target['profileImage'].value;
    const role = 'user';

    if (passwoard === cpasswoard) {
      userRegister(
        email,
        passwoard,
        name,
        address,
        phoneNumber,
        profileImage,
        role,
        setFierBaseregError,
        navigater
      );
    } else {
        setFierBaseregError("Passwords do not match");
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden my-8">
       {/* Decorative top bar */}
       <div className="absolute top-0 left-0 w-full h-2 bg-[#dc2626]"></div>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-500 mt-2">Join us today! It takes less than a minute.</p>
      </div>

      <form onSubmit={registerHandle} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoginInput
            inputtype="text"
            label="First Name"
            placeholder="John"
            name="firstName"
            validator={(v) => v && v.trim().length > 0}
            errMsg="Required"
            setFierBaseLoginError={setFierBaseregError}
            isLogInHandle={false}
          />
          <LoginInput
            inputtype="text"
            label="Last Name"
            placeholder="Doe"
            name="lastName"
            validator={(v) => v && v.trim().length > 0}
            errMsg="Required"
            setFierBaseLoginError={setFierBaseregError}
            isLogInHandle={false}
          />
        </div>

        <LoginInput
          inputtype="email"
          label="Email Address"
          placeholder="name@company.com"
          name="email"
          validator={(v) => /\S+@\S+\.\S+/.test(v)}
          errMsg="Enter a valid email"
          setFierBaseLoginError={setFierBaseregError}
          isLogInHandle={false}
        />

        <LoginInput
          inputtype="text"
          label="Address"
          placeholder="123 Main St, City"
          name="address"
          validator={(v) => v && v.trim().length > 0}
          errMsg="Enter address"
          setFierBaseLoginError={setFierBaseregError}
          isLogInHandle={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoginInput
            inputtype="password"
            label="Password"
            placeholder="Create password"
            name="password"
            validator={(v) => v && v.length >= 6}
            errMsg="Min 6 characters"
            setFierBaseLoginError={setFierBaseregError}
            isLogInHandle={false}
          />
          <LoginInput
            inputtype="password"
            label="Confirm Password"
            placeholder="Confirm password"
            name="confirmPassword"
            validator={(v) => v && v.length >= 6}
            errMsg="Min 6 characters"
            setFierBaseLoginError={setFierBaseregError}
            isLogInHandle={false}
          />
        </div>

        <LoginInput
          inputtype="text"
          label="Phone Number"
          placeholder="+94 7X XXX XXXX"
          name="phoneNumber"
          validator={(v) => v && v.trim().length > 0}
          errMsg="Enter phone number"
          setFierBaseLoginError={setFierBaseregError}
          isLogInHandle={false}
        />

        <LoginInput
          inputtype="text"
          label="Profile Image"
          placeholder="https://example.com/image.png"
          name="profileImage"
          validator={(v) => v && v.trim().length > 0}
          errMsg="Enter image URL"
          setFierBaseLoginError={setFierBaseregError}
          isLogInHandle={false}
        />

        <button
          className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-600/40 transition-all duration-300 transform hover:-translate-y-0.5 mt-4"
          type="submit"
        >
          Create Account
        </button>
      </form>

      {firebaseREGErr && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">{firebaseREGErr}</div>}

      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <span
          className="text-[#dc2626] font-bold cursor-pointer hover:underline transition-all"
          onClick={onSwitch}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

/* -----------------------
  INPUT COMPONENT 
  -----------------------
*/
const LoginInput = ({
  inputtype,
  label, // Fixed typo from 'lable' to 'label'
  placeholder,
  name,
  validator,
  errMsg,
  fierbaseErr,
  setFierBaseLoginError,
  isLogInHandle,
}) => {
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [localErrMsg, setLocalErrMsg] = useState('');

  const handleBlur = () => {
    if (typeof validator === 'function') {
      const ok = validator(inputValue);
      setError(!ok);
      setLocalErrMsg(!ok ? errMsg || 'Invalid value' : '');
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (error) {
      // re-validate while typing
      if (typeof validator === 'function') {
        const ok = validator(e.target.value);
        setError(!ok);
        setLocalErrMsg(!ok ? errMsg || 'Invalid value' : '');
      } else {
        setError(false);
        setLocalErrMsg('');
      }
    }
    if (isLogInHandle) {
      setFierBaseLoginError({ emailErr: '', passwoardErr: '' });
    } else {
      setFierBaseLoginError('');
    }
  };

  // Determine border color based on state
  const borderColor = error || fierbaseErr ? 'border-[#dc2626] ring-1 ring-[#dc2626]' : 'border-gray-200 focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]';

  return (
    <div className="w-full">
      <label className={`block text-sm font-semibold mb-1.5 transition-colors ${error || fierbaseErr ? 'text-[#dc2626]' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        type={inputtype}
        name={name}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 bg-gray-50 rounded-lg border outline-none transition-all duration-200 placeholder-gray-400 ${borderColor}`}
        required
      />
      {error && localErrMsg ? <p className="text-xs font-medium text-[#dc2626] mt-1 ml-1">{localErrMsg}</p> : null}
      {fierbaseErr ? <p className="text-xs font-medium text-[#dc2626] mt-1 ml-1">{fierbaseErr}</p> : null}
    </div>
  );
};
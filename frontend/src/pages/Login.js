/**
 * Login Component
 * 
 * This component represents the login page for Panda Express POS. It allows users to log in 
 * using their username and password or via Google OAuth. If the login is successful, the user 
 * is redirected to either the manager or employee page based on their role. The component also 
 * supports translations for various UI elements.
 * 
 * Features:
 * - Provides a form for entering a username and password.
 * - Supports Google login through OAuth.
 * - Translates UI strings based on the selected language.
 * - Redirects the user based on their role (Manager or Employee).
 * 
 * API Endpoints:
 * - `/api/login` - Logs the user in with the provided username and password.
 * - `/api/googleLogin` - Logs the user in via Google OAuth.
 * 
 * @example
 * <Login />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, googleLogin } from '../services/LoginAPI';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslate } from '../contexts/TranslationContext';
import '../styles/Login.css';

/**
 * Login Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered login page with form and Google login button.
 */
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const { translate } = useTranslate();

  // Local state to store translated strings for UI labels
  /**
   * The state that stores translated strings for UI elements.
   * @type {Object}
   */
  const [translatedText, setTranslatedText] = useState({
    loginTitle: '',
    usernamePlaceholder: '',
    passwordPlaceholder: '',
    loginButton: '',
    backButton: '',
    googleLoginFailed: '',
    queryResultTitle: '',
  });

  /**
   * Loads translations for static labels on component mount.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        loginTitle: await translate('Login to Panda Express POS'),
        usernamePlaceholder: await translate('Username'),
        passwordPlaceholder: await translate('Password'),
        loginButton: await translate('Login'),
        backButton: await translate('Back'),
        googleLoginFailed: await translate('Google Login Failed'),
        queryResultTitle: await translate('Query Result'),
      };
      setTranslatedText(translations);
    };

    loadTranslations();
  }, [translate]);

  /**
   * Handles user login with username and password.
   * Sends login request to the backend and processes the result.
   * 
   * @returns {void}
   */
  const handleLogin = async () => {
    const result = await login(username, password);
    handleQueryResult(result);
  };

  /**
   * Handles Google login with the OAuth credential response.
   * Sends login request to the backend via Google OAuth and processes the result.
   * 
   * @param {Object} credentialResponse - The Google OAuth credential response.
   * @returns {void}
   */
  const handleGoogleLogin = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse);
    handleQueryResult(result);
  };

  /**
   * Navigates to the home page.
   * 
   * @returns {void}
   */
  const navigateToHome = () => {
    navigate('/');
  };

  /**
   * Handles the query result from the login process.
   * Redirects the user based on their role (Manager or Employee).
   * 
   * @param {Array<Object>} result - The result of the login attempt.
   * @returns {void}
   */
  const handleQueryResult = (result) => {
    if (result && result.length > 0) {
      setQueryResult(result);
      if (result[0].position === 'Manager') {
        navigate('/manageroremployee', { state: { position: 'Manager' } });
      } else {
        navigate('/manageroremployee', { state: { position: 'Employee' } });
      }
    } else {
      alert('Login failed! Please check your username and/or password.');
      setPassword('');
      setUsername('');
    }
  };

  return (
    <div id="login-container">
      <div className="login-box">
        <img
          src={`${process.env.PUBLIC_URL}/panda-logo.png`}
          alt="Panda Express Logo"
          className="logo"
        />
        <h2>{translatedText.loginTitle}</h2>
        <input
          type="text"
          id="username-input"
          placeholder={translatedText.usernamePlaceholder}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          id="password-input"
          placeholder={translatedText.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>{translatedText.loginButton}</button>
        <button onClick={navigateToHome}>{translatedText.backButton}</button>
        {queryResult && (
          <div id="query-result">
            <h4>{translatedText.queryResultTitle}</h4>
            <pre>{JSON.stringify(queryResult, null, 2)}</pre>
          </div>
        )}
        <div style={{ paddingTop: 15, paddingLeft: 180, alignItems: 'center' }}>
          <GoogleLogin
            width={190}
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log(translatedText.googleLoginFailed);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;

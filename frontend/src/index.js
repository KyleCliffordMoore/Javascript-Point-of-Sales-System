/**
 * Entry point for the React application.
 * This file initializes and renders the application with various providers for global state management.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
//import './styles/index.css';

import { ShoppingCartProvider } from './contexts/ShoppingCartContext';
import { TimeProvider } from './contexts/TimeProvider';
import { TranslationProvider } from './contexts/TranslationContext';
import { FasterTranslationProvider } from './contexts/FasterTranslationContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { WeatherProvider } from './contexts/WeatherProvider';
import Layout from './contexts/Layout';

/**
 * The root DOM container where the React app will be mounted.
 * @type {HTMLElement}
 */
const container = document.getElementById('root');
/**
 * Creates the React root and initializes the app rendering.
 */
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="196474627665-g0jl6957an659iv89tkl5mdpb9gsi05u.apps.googleusercontent.com">
            <FasterTranslationProvider>
                <TranslationProvider>
                    <TimeProvider>
                        <WeatherProvider>
                            <Layout>
                                <ShoppingCartProvider>
                                    <App />
                                </ShoppingCartProvider>
                            </Layout>
                        </WeatherProvider>
                    </TimeProvider>
                </TranslationProvider>
            </FasterTranslationProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);

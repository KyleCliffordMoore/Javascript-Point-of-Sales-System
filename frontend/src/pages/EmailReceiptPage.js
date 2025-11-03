/**
 * EmailReceiptPage.js
 * 
 * This file defines the `EmailReceiptPage` component, which allows users to send
 * a receipt to a specified email address. It fetches translations dynamically and 
 * provides error handling for invalid inputs and failed API calls.
 * 
 * Dependencies:
 * - React
 * - React Router (for navigation and location)
 * - TranslationContext (for dynamic string translation)
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslate } from '../contexts/TranslationContext';

/**
 * Component: EmailReceiptPage
 * Allows the user to send a receipt to a specified email address. It handles input validation,
 * dynamic translation of labels, and API interaction to send the email.
 * 
 * @component
 * @returns {JSX.Element} The email receipt page UI.
 */
const EmailReceiptPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [translatedStrings, setTranslatedStrings] = useState({
    emailLabel: "",
    sendButton: "",
    statusMessage: "",
    errorMessage: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const receiptId = location.state?.receiptId || null;
  const { translate } = useTranslate(); // Access the translate function from context

  /**
   * Load translations for static text labels on component mount or language change.
   * @async asynchronise function
   * @function translateStrings translates the text
   * @returns {Promise<void>} just in case nothing returns
   */
  useEffect(() => {
    const translateStrings = async () => {
      const emailLabel = await translate("Email Address:");
      const sendButton = await translate("Send Email");
      const statusMessage = await translate("Please provide both email and receipt ID.");
      const errorMessage = await translate("Failed to send email.");
      
      setTranslatedStrings({
        emailLabel,
        sendButton,
        statusMessage,
        errorMessage,
      });
    };

    translateStrings(); // Call the translation function on component mount
  }, [translate]); // Re-run translation on language change

  /**
   * 
   * When button is clicked email will be sent.
  */
  const handleSendEmail = async () => {
    if (!email || !receiptId) {
      setStatus(translatedStrings.statusMessage);
      return;
    }

    try {
      const response = await fetch("/api/doSendEmailReceipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, receiptId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Receipt: ${receiptId} has been sent to ${email}.`);
        navigate("/home"); // Navigate to /home after alert
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus(translatedStrings.errorMessage);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>{translatedStrings.sendButton}</h1>
      <label>
        {translatedStrings.emailLabel}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </label>
      <button onClick={handleSendEmail} style={{ padding: "10px", width: "100%" }}>
        {translatedStrings.sendButton}
      </button>
      {status && <p style={{ marginTop: "10px", color: "red" }}>{status}</p>}
    </div>
  );
};

export default EmailReceiptPage;

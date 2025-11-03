/**
 * EditEmployee Component
 * 
 * This component allows the user to edit an employee's details, including name,
 * email, position, hours, pay, and password. It retrieves the current employee data
 * from the location state and pre-fills the form fields. Upon saving the changes, 
 * it sends the updated employee data to the backend API and displays a success or 
 * error message.
 * 
 * Features:
 * - Allows editing of employee details.
 * - Sends updated employee data to the backend for processing.
 * - Displays success or error messages based on the result of the update.
 * - Provides translated labels and messages for UI components.
 * 
 * API Endpoints:
 * - `/api/doEditEmployee` - Updates the employee details in the backend.
 * 
 * @example Usage Example:
 * <EditEmployee />
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext'; // Adjust the import path as necessary

const API_URL = '/api';

/**
 * The main component for editing employee details.
 * 
 * @returns {JSX.Element} - The rendered EditEmployee page with a form to update employee details.
 */
const EditEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { translate } = useTranslate();

  // Extract employee data from location.state
  const { employee } = location.state || {};
  const [name, setName] = useState(employee ? employee.name : '');
  const [email, setEmail] = useState(employee ? employee.email : '');
  const [position, setPosition] = useState(employee ? employee.position : '');
  const [hours, setHours] = useState(employee ? employee.hours : '');
  const [pay, setPay] = useState(employee ? employee.pay : '');
  const [password, setPassword] = useState(employee ? employee.password : '');

  // State for translated labels
  const [labels, setLabels] = useState({
    editEmployee: 'Edit Employee',
    name: 'Name',
    email: 'Email',
    position: 'Position',
    hours: 'Hours',
    pay: 'Pay',
    password: 'Password',
    saveChanges: 'Save Changes',
    back: 'Back',
    success: 'Employee updated successfully!',
    fail: 'Failed to update employee:',
    error: 'An error occurred while updating the employee.',
  });

  // Load translations on component mount
  /**
   * Loads the translations for all labels when the component is mounted.
   * 
   * @returns {void} returns nothing
   */
  useEffect(() => {
    const loadTranslations = async () => {
      const translatedLabels = {
        editEmployee: await translate('Edit Employee'),
        name: await translate('Name'),
        email: await translate('Email'),
        position: await translate('Position'),
        hours: await translate('Hours'),
        pay: await translate('Pay'),
        password: await translate('Password'),
        saveChanges: await translate('Save Changes'),
        back: await translate('Back'),
        success: await translate('Employee updated successfully!'),
        fail: await translate('Failed to update employee:'),
        error: await translate('An error occurred while updating the employee.'),
      };
      setLabels(translatedLabels);
    };

    loadTranslations();
  }, [translate]);

  /**
   * Handles saving the edited employee details.
   * Sends the updated data to the backend API and processes the response.
   * 
   * @returns {void}
   */
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/doEditEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employee_id,
          name,
          email,
          position,
          hours,
          pay,
          password,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(labels.success);
        navigate('/listemployee'); // Navigate back to the employee list
      } else {
        alert(`${labels.fail} ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert(labels.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{labels.editEmployee}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.name}:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.email}:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.position}:</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.hours}:</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.pay}:</label>
          <input
            type="number"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.password}:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSave}>
          {labels.saveChanges}
        </button>
        <button
          type="button"
          onClick={() => navigate('/listemployee')}
          style={{ marginLeft: '10px' }}
        >
          {labels.back}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;

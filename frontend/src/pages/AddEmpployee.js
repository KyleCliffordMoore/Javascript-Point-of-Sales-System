/**
 * AddEmployee Component
 * 
 * This component allows the user to add a new employee by filling out a form with employee details.
 * The form includes fields for ID (which can be auto-generated), name, email, position, hours, pay, and password.
 * Upon submitting the form, the employee data is sent to the backend API to add the employee to the system.
 * Success or error messages are shown based on the result from the backend.
 * 
 * Features:
 * - Provides a form for adding new employee details.
 * - Supports position selection between Manager, Crew Member, and Fired.
 * - Sends employee data to the backend to add the employee.
 * - Displays success or error messages based on the result of the API call.
 * - Supports translated labels for UI components.
 * 
 * API Endpoints:
 * - `/api/doAddEmployee` - Adds the new employee to the backend.
 * 
 * @example Usage Example:
 * <AddEmployee />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext'; 
import styles from '../styles/AllManager.module.css';

const API_URL = '/api'; 

/**
 * The main component for adding a new employee.
 * 
 * @component
 * @returns {JSX.Element} - The rendered AddEmployee page with a form to input new employee details.
 */
const AddEmployee = () => {
  const navigate = useNavigate();
  const { translate } = useTranslate();

  // State to hold employee data
  const [employeeData, setEmployeeData] = useState({
    id: '',
    name: '',
    email: '',
    position: '',
    hours: '',
    pay: '',
    password: '',
  });

  // State for translated labels
  const [labels, setLabels] = useState({
    addNewEmployee: 'Add New Employee',
    id: 'ID (leave blank to auto-generate an id):',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    position: 'Position',
    hours: 'Hours',
    pay: 'Pay',
    addEmployee: 'Add Employee',
    backToList: 'Back to Employee List',
    manager: 'Manager',
    crewMember: 'Crew Member',
    fired: 'Fired',
    success: 'Employee added successfully!',
    fail: 'Failed to add employee:',
  });

  // Load translations on component mount
  /**
   * Loads translations for all labels when the component is mounted.
   * 
   * @returns {void} returns nothing
   */
  useEffect(() => {
    const loadTranslations = async () => {
      const translatedLabels = {
        addNewEmployee: await translate('Add New Employee'),
        id: await translate('ID (leave blank to auto-generate an id):'),
        name: await translate('Name'),
        email: await translate('Email'),
        password: await translate('Password'),
        position: await translate('Position'),
        hours: await translate('Hours'),
        pay: await translate('Pay'),
        addEmployee: await translate('Add Employee'),
        backToList: await translate('Back to Employee List'),
        manager: await translate('Manager'),
        crewMember: await translate('Crew Member'),
        fired: await translate('Fired'),
        success: await translate('Employee added successfully!'),
        fail: await translate('Failed to add employee:'),
      };
      setLabels(translatedLabels);
    };

    loadTranslations();
  }, [translate]);

  /**
   * Handles input changes and updates the employeeData state.
   * 
   * @param {React.ChangeEvent} e - The event object for the input change.
   * @returns {void} returns nothing
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  /**
   * Handles the logic for adding a new employee.
   * Sends the employee data to the backend API and displays a success or error message based on the result.
   * 
   * @returns {void} returns nothing
   */
  const handleAddEmployee = async () => {
    try {
      const response = await fetch(`${API_URL}/doAddEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();
      if (result.success) {
        alert(labels.success);
        navigate('/listemployee');
      } else {
        alert(`${labels.fail} ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert(labels.fail);
    }
  };

  return (
    <div className={styles.container}>
      <form>
        <h2>{labels.addNewEmployee}</h2>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>{labels.id}</label>
          <input 
            type="text" 
            name="id" 
            className={styles.inputField}
            value={employeeData.id} 
            onChange={handleInputChange} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>{labels.name}:</label>
          <input 
            type="text" 
            name="name" 
            className={styles.inputField}
            value={employeeData.name} 
            onChange={handleInputChange} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>{labels.email}:</label>
          <input 
            type="text" 
            name="email" 
            className={styles.inputField}
            value={employeeData.email} 
            onChange={handleInputChange} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>{labels.password}:</label>
          <input 
            type="password" 
            name="password" 
            className={styles.inputField}
            value={employeeData.password} 
            onChange={handleInputChange} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>{labels.position}:</label>
          <select 
            name="position" 
            className={styles.inputField}
            value={employeeData.position} 
            onChange={handleInputChange}
          >
            <option value="Manager">{labels.manager}</option>
            <option value="Crew Member">{labels.crewMember}</option>
            <option value="Fired">{labels.fired}</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>{labels.hours}:</label>
          <input 
            type="number" 
            name="hours" 
            className={styles.inputField}
            value={employeeData.hours} 
            onChange={handleInputChange} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>{labels.pay}:</label>
          <input 
            type="number" 
            name="pay" 
            className={styles.inputField}
            value={employeeData.pay} 
            onChange={handleInputChange} 
          />
        </div>

        <div className={styles.buttonGroup}>
          <button 
            type="button"
            className={styles.button} 
            onClick={handleAddEmployee}
          >
            {labels.addEmployee}
          </button>
          <button 
            type="button"
            className={styles.button} 
            onClick={() => navigate('/listemployee')}
          >
            {labels.backToList}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
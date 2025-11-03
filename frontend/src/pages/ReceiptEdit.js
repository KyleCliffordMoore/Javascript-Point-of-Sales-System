/**
 * ReceiptEdit Component
 * 
 * This component allows the user to edit an existing receipt. It fetches receipt details from the backend 
 * using the provided receipt ID, allows modification of the receipt's status and line items, and saves the changes 
 * back to the server. It also provides functionality to add or remove line items dynamically.
 * 
 * Features:
 * - Displays the receipt ID, date, and current status.
 * - Allows the user to change the status of the receipt (e.g., "Pending", "Fulfilled", "Cancelled").
 * - Provides an interface to view and modify line items, including adding and removing them.
 * - Sends the updated receipt data to the server for persistence.
 * 
 * API Endpoints:
 * - `GET /api/receipts/:receipt_id` - Fetches receipt details.
 * - `PUT /api/receipts/:receipt_id` - Updates the receipt with new details.
 * 
 * @component
 * @example
 * // Example usage
 * <ReceiptEdit />
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useFasterTranslate } from "../contexts/FasterTranslationContext";

const API_URL = "/api";

/**
 * The ReceiptEdit component renders a form for editing an existing receipt's details.
 * 
 * @returns {JSX.Element} - The rendered ReceiptEdit page with options to edit the receipt's status and line items.
 */
function ReceiptEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const { receipt_id } = location.state || {};
    const [receipt, setReceipt] = useState(null);
    const [status, setStatus] = useState("");
    const [lineItems, setLineItems] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [appetizers, setAppetizers] = useState([]);
    const [mealEntrees, setMealEntrees] = useState([]);
    const [mealSides, setMealSides] = useState([]);
    const [newItemType, setNewItemType] = useState("Drink");
    const [translations, setTranslations] = useState({});
    const { translate } = useFasterTranslate();

    /**
     * Fetches the receipt data from the server using the provided receipt_id.
     * 
     * @returns {void}
     */
    useEffect(() => {
        const fetchReceiptData = async () => {
            try {
                const response = await axios.get(`${API_URL}/receipts/${receipt_id}`);
                const updatedLineItems = response.data.line_items.map((item) => {
                    if (item.type === "Meal" && !item.entrees) {
                        item.entrees = [null, null, null];
                    }
                    return item;
                });
                setReceipt(response.data);
                setStatus(response.data.status);
                setLineItems(updatedLineItems);
            } catch (error) {
                console.error("Error fetching receipt:", error);
            }
        };

        const fetchDropdownOptions = async () => {
            try {
                const [drinkRes, appRes, entreeRes, sideRes] = await Promise.all([
                    axios.post(`${API_URL}/doQueryDrinkItems`),
                    axios.post(`${API_URL}/doQueryAppItems`),
                    axios.post(`${API_URL}/doQueryEntree`),
                    axios.post(`${API_URL}/doQuerySide`),
                ]);
                setDrinks(drinkRes.data);
                setAppetizers(appRes.data);
                setMealEntrees(entreeRes.data);
                setMealSides(sideRes.data);
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
            }
        };

        const fetchTranslations = async () => {
            try {
                const keys = [
                    "Loading...",
                    "Back",
                    "Edit Receipt",
                    "Receipt ID",
                    "Date",
                    "Status",
                    "Pending",
                    "Fulfilled",
                    "Cancelled",
                    "Line Items",
                    "Type",
                    "Select Drink",
                    "Select Appetizer",
                    "Select Entree",
                    "Select Side",
                    "Price",
                    "Remove",
                    "Add Item",
                    "Drink",
                    "Appetizer",
                    "Meal",
                    "Add Line Item",
                    "Update Receipt",
                    "Receipt updated successfully!",
                    "Failed to update receipt",
                    "There was an error while updating the receipt.",
                ];
                const translationMap = {};
                for (const key of keys) {
                    translationMap[key] = await translate(key);
                }
                setTranslations(translationMap);
            } catch (error) {
                console.error("Error fetching translations:", error);
            }
        };

        if (receipt_id) {
            fetchReceiptData();
            fetchDropdownOptions();
            fetchTranslations();
        }
    }, [receipt_id, translate]);

    const handleMealChange = (index, entreeIndex, value) => {
        const updatedLineItems = [...lineItems];
        if (!updatedLineItems[index].entrees) {
            updatedLineItems[index].entrees = [null, null, null];
        }
        updatedLineItems[index].entrees[entreeIndex] = value;
        setLineItems(updatedLineItems);
    };

    const handleStatusChange = (e) => setStatus(e.target.value);

    const handleLineItemChange = (index, field, value) => {
        const updatedLineItems = [...lineItems];
        updatedLineItems[index][field] = value;
        setLineItems(updatedLineItems);
    };

    /**
     * Adds a new empty line item to the line items list.
     * 
     * @returns {void}
     */
    const handleAddLineItem = () => {
        const newItem = { type: newItemType, price: 0 };
        if (newItemType === "Meal") {
            newItem.entrees = [null, null, null];
            newItem.side = null;
        }
        setLineItems([...lineItems, newItem]);
    };

    /**
     * Removes a line item from the list of line items based on its index.
     * 
     * @param {number} index - The index of the line item to be removed.
     * @returns {void}
     */
    const handleRemoveLineItem = (index) => {
        const updatedLineItems = lineItems.filter((_, i) => i !== index);
        setLineItems(updatedLineItems);
    };

    /**
     * Handles the form submission to update the receipt with modified data.
     * 
     * @param {React.FormEvent} e - The form submit event.
     * @returns {void}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedReceipt = { receipt_id, status, line_items: lineItems };

        try {
            const response = await axios.put(`${API_URL}/receipts/${receipt_id}`, updatedReceipt);
            if (response.data.success) {
                alert(translations["Receipt updated successfully!"]);
                navigate("/receiptpage");
            } else {
                alert(translations["Failed to update receipt"]);
            }
        } catch (error) {
            console.error("Error updating receipt:", error);
            alert(translations["There was an error while updating the receipt."]);
        }
    };

    const navigateBack = () => navigate("/receiptpage");

    if (!receipt || !translations["Loading..."]) {
        return <div>{translations["Loading..."] || "Loading..."}</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={navigateBack}>{translations["Back"]}</button>
            <h2>{translations["Edit Receipt"]}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{translations["Receipt ID"]}:</label>
                    <span>{receipt.receipt_id}</span>
                </div>
                <div>
                    <label>{translations["Date"]}:</label>
                    <span>{new Date(receipt.date).toLocaleString()}</span>
                </div>
                <div>
                    <label>{translations["Status"]}:</label>
                    <select value={status} onChange={handleStatusChange}>
                        <option value="Pending">{translations["Pending"]}</option>
                        <option value="Fulfilled">{translations["Fulfilled"]}</option>
                        <option value="Cancelled">{translations["Cancelled"]}</option>
                    </select>
                </div>
                <h3>{translations["Line Items"]}:</h3>
                {lineItems.map((item, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                        <label>{translations["Type"]}:</label>
                        <span>{item.type}</span>
                        {item.type === "Drink" && (
                            <select
                                value={item.name || ""}
                                onChange={(e) => handleLineItemChange(index, "name", e.target.value)}
                            >
                                <option value="">{translations["Select Drink"]}</option>
                                {drinks.map((drink) => (
                                    <option key={drink.menu_id} value={drink.name}>
                                        {drink.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {item.type === "Appetizer" && (
                            <select
                                value={item.name || ""}
                                onChange={(e) => handleLineItemChange(index, "name", e.target.value)}
                            >
                                <option value="">{translations["Select Appetizer"]}</option>
                                {appetizers.map((app) => (
                                    <option key={app.menu_id} value={app.name}>
                                        {app.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {item.type === "Meal" && (
                            <div>
                                <label>{translations["Entrees"]}:</label>
                                {[0, 1, 2].map((i) => (
                                    <select
                                        key={i}
                                        value={item.entrees?.[i] || ""}
                                        onChange={(e) => handleMealChange(index, i, e.target.value)}
                                    >
                                        <option value="">{translations["Select Entree"]}</option>
                                        {mealEntrees.map((entree) => (
                                            <option key={entree.menu_id} value={entree.name}>
                                                {entree.name}
                                            </option>
                                        ))}
                                    </select>
                                ))}
                                <label>{translations["Side"]}:</label>
                                <select
                                    value={item.side || ""}
                                    onChange={(e) => handleLineItemChange(index, "side", e.target.value)}
                                >
                                    <option value="">{translations["Select Side"]}</option>
                                    {mealSides.map((side) => (
                                        <option key={side.menu_id} value={side.name}>
                                            {side.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <input
                            type="number"
                            step="0.01"
                            placeholder={translations["Price"]}
                            value={item.price || 0}
                            onChange={(e) => handleLineItemChange(index, "price", parseFloat(e.target.value))}
                            required
                        />
                        <button type="button" onClick={() => handleRemoveLineItem(index)}>
                            {translations["Remove"]}
                        </button>
                    </div>
                ))}
                <div>
                    <label>{translations["Add Item"]}:</label>
                    <select value={newItemType} onChange={(e) => setNewItemType(e.target.value)}>
                        <option value="Drink">{translations["Drink"]}</option>
                        <option value="Appetizer">{translations["Appetizer"]}</option>
                        <option value="Meal">{translations["Meal"]}</option>
                    </select>
                    <button type="button" onClick={handleAddLineItem}>
                        {translations["Add Line Item"]}
                    </button>
                </div>
                <button type="submit">{translations["Update Receipt"]}</button>
            </form>
        </div>
    );
}

export default ReceiptEdit;

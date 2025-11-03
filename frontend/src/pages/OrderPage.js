import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext';
import '../styles/OrderPage.css';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

const API_URL = '/api';

const OrderPage = () => {
    
    /** 
     * Destructure addItemToCart and cartItems from ShoppingCartContext.
     * addItemToCart is used to add items to the cart, and cartItems holds the list of items in the cart.
     */
    const { addItemToCart, cartItems } = useShoppingCart(); // Access cartItems
    const navigate = useNavigate();
    const { translate } = useTranslate();

    /** 
     * State to track the selected category (Meals, Drinks, Appetizers).
     */
    const [selectedCategory, setSelectedCategory] = useState("Meals");

    /** 
     * States to store different item lists based on categories (Appetizers, Drinks, Meals).
     */
    const [appetizerItems, setAppetizerItems] = useState([]);
    const [drinkItems, setDrinkItems] = useState([]);
    const [mealItems, setMealItems] = useState([]);

    /** 
     * State to store translated strings used for text in the component.
     */
    const [translatedStrings, setTranslatedStrings] = useState({
        orderCategories: '',
        meals: '',
        drinks: '',
        appetizers: '',
        viewCart: '',
        backToHome: '',
        selectCategory: '',
    });
   
    /** 
     * State to manage the visibility of the popup suggesting adding a drink or side to the cart.
     */
    const [showPopup, setShowPopup] = useState(false); // Manage popup visibility

    // Handle adding an item to the cart
    /** 
     * Function to handle adding an item to the shopping cart.
     * Alerts the user that the item has been added.
     */
    const handleAddToCart = (item) => {
        addItemToCart(item);
        alert(`${item.name} added to cart!`);
    };

    /** 
     * Function to handle the selection of a category (Meals, Drinks, Appetizers).
     */
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    /** 
     * Fetches meal items from the API and updates the mealItems state.
     */
    const fetchMeals = async () => {
        try {
            const response = await fetch(`${API_URL}/doQueryMealItems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setMealItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching meal items:', error);
            setMealItems([]);
        }
    };

    /** 
     * Fetches appetizer items from the API and updates the appetizerItems state.
     */
    const fetchAppetizers = async () => {
        try {
            const response = await fetch(`${API_URL}/doQueryAppItems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            const itemsWithType = Array.isArray(data) ? data.map(item => ({ ...item, type: "appetizer" })) : [];
            setAppetizerItems(itemsWithType);
        } catch (error) {
            console.error('Error fetching appetizer items:', error);
            setAppetizerItems([]);
        }
    };
    

    /** 
     * Fetches drink items from the API and updates the drinkItems state.
     */
    const fetchDrinks = async () => {
        try {
            const response = await fetch(`${API_URL}/doQueryDrinkItems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            const itemsWithType = Array.isArray(data) ? data.map(item => ({ ...item, type: "Drink" })) : [];
            setDrinkItems(itemsWithType);
        } catch (error) {
            console.error('Error fetching drink items:', error);
            setDrinkItems([]);
        }
    };

    /** 
     * UseEffect hook to translate the necessary strings when the component mounts.
     * Translated strings are then set in the state.
     */
    useEffect(() => {
        const translateStrings = async () => {
            const orderCategories = await translate('Order Categories');
            const meals = await translate('Meals');
            const drinks = await translate('Drinks');
            const appetizers = await translate('Appetizers');
            const viewCart = await translate('View Shopping Cart');
            const backToHome = await translate('Back to Home');
            const selectCategory = await translate('Select a Category');

            setTranslatedStrings({
                orderCategories,
                meals,
                drinks,
                appetizers,
                viewCart,
                backToHome,
                selectCategory,
            });
        };

        translateStrings(); // Translate strings on component mount
    }, [translate]);

    /** 
     * UseEffect hook to fetch data for the selected category.
     * Fetches meals, appetizers, or drinks based on selectedCategory.
     */
    useEffect(() => {
        if (selectedCategory === 'Appetizers') fetchAppetizers();
        if (selectedCategory === 'Drinks') fetchDrinks();
        if (selectedCategory === 'Meals') fetchMeals();
    }, [selectedCategory]);

    // Check if there's a meal in the cart and no drink on page load
    /** 
     * UseEffect hook to check the cart on page load.
     * Shows a popup if a meal is in the cart and there is no drink or side.
     */
    useEffect(() => {
        const hasMeal = cartItems.some(item => item.type === 'Meal');
        const hasDrink = cartItems.some(item => item.type === 'Drink');
        const hasSide = cartItems.some(item => item.type === 'Side');
        if (hasMeal && !hasDrink && !hasSide) {
            setShowPopup(true); // Show the popup if there is a meal and no drink
        }
    }, [cartItems]);

    /** 
     * Function to handle closing the popup.
     */
    const handleClosePopup = () => {
        setShowPopup(false); 
    };

    /** 
     * Function to navigate to the Drinks category and close the popup.
     */
    const handleAddDrink = () => {
        setShowPopup(false); 
        handleCategoryClick("Drinks");
    };

    /** 
     * Function to navigate to the Appetizers category and close the popup.
     */
    const handleAddSide = () => {
        setShowPopup(false); 
        handleCategoryClick("Appetizers");
    };

    return (
        <div className="order-page">
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>It looks like you have a meal in your cart. Would you like to add a drink or side to go with i?</p>
                        <button onClick={handleAddDrink}>Yes, take me to drinks</button>
                        <button onClick={handleAddSide}>Yes, take me to sides</button>
                        <button onClick={handleClosePopup}>No, thanks</button>
                    </div>
                </div>
            )}

            <div className="sidebar">
                <h3>{translatedStrings.orderCategories}</h3>
                <ul>
                    <li onClick={() => handleCategoryClick("Meals")}>{translatedStrings.meals}</li>
                    <li onClick={() => handleCategoryClick("Drinks")}>{translatedStrings.drinks}</li>
                    <li onClick={() => handleCategoryClick("Appetizers")}>{translatedStrings.appetizers}</li>
                    <li onClick={() => navigate("/shoppingcart")}>{translatedStrings.viewCart}</li>
                    <li onClick={() => navigate("/")} >{translatedStrings.backToHome}</li>
                </ul>
            </div>

            <div className="content">
                <h2>{selectedCategory ? selectedCategory : translatedStrings.selectCategory}</h2>

                {selectedCategory === "Meals" && (
                    <div className="grid-container">
                        {mealItems.map((item, index) => (
                            
                            <button key={index} className="grid-item" onClick={() => navigate("/selectentree1", { state: { meal_item: item } })}>
                                <img class="inverted" src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}Icon.png`} alt={item.name}></img>
                                {MealSubText(item.name)}
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}

                {selectedCategory === 'Drinks' && (
                    <div className="grid-container">
                        {drinkItems.map((item, index) => (
                            <button key={index} className="grid-item" onClick={() => handleAddToCart(item)}>
                                <img class="inverted" src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}.png`} alt={item.name}></img>
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}

                {selectedCategory === 'Appetizers' && (
                    <div className="grid-container">
                        {appetizerItems.map((item, index) => (
                            <button key={index} className="grid-item" onClick={() => handleAddToCart(item)}>
                                <img src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}.png`} alt={item.name}></img>
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Inline CSS for Popup */}
            <style jsx>{`
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999;
                }

                .popup-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .popup-content button {
                    margin: 10px;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .popup-content button:hover {
                    background-color: #45a049;
                }
            `}</style>
        </div>
    );
};

/**
 * Helper function to return the appropriate subtext for each meal type.
 */
const MealSubText = ( name ) => {
    let ReturnedText;
    if (name === 'Bowl') 
        ReturnedText = '1 entree & 1 side';
    else if (name === 'Plate') 
        ReturnedText = '2 entrees & 1 side';
    else if (name === "Bigger Plate")
        ReturnedText = '3 entrees & 1 side';
    else 
        ReturnedText = 'N/A';

    return (
        <p>
            ({ReturnedText})
        </p>
    );
}

export default OrderPage;

/**
 * @file Menu.js
 * @description This component represents the Menu display of the point of sales application. 
 * Features:
 * - It displays all menu items such as meals, entrees, sides, appetizers, and drinks 
 *      with supported dynamic animations to account for new menu items later on.
 * - Additionally, it displays the associated prices, details for meals, fluid count, and
 *      calorie count for each item.
 * 
 * Dependencies:
 * - fetchMenuTypes: For collecting menu items from the database.
 * - useNavigate: For navigation between pages.
 * 
 * @example
 * <Menu />
 */

import React, { useState, useEffect } from 'react';
import '../styles/Menu.css';
import { fetchMenuType } from '../services/MenuAPI';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

/**
 * Menu component
 * 
 * Displays the menu page, handles collecting items from the database, and
 * dynamically animating menu items.
 * 
 * @component
 * @returns {JSX.Element} The rendered menu page.
 */
function Menu() {
    const { translate } = useFasterTranslate();
    const [translatedText, setTranslatedText] = useState({});
    const [loadingTranslations, setLoadingTranslations] = useState(true);

    // Array data for Menu
    const [meals, setMeals] = useState([]);
    const [entrees, setEntrees] = useState([]);
    const [sides, setSides] = useState([]);
    const [appetizers, setAppetizers] = useState([]);
    const [drinks, setDrinks] = useState([]);

    /**
     * Fetches translations for key headings.
     */
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const translations = await translate([
                    'Welcome to Panda Express',
                    'PICK A MEAL',
                    'ENTREES',
                    'SIDES',
                    'APPETIZERS',
                    'DRINKS',
                ]);

                setTranslatedText({
                    welcome: translations[0],
                    pickMeal: translations[1],
                    entrees: translations[2],
                    sides: translations[3],
                    appetizers: translations[4],
                    drinks: translations[5],
                });
            } catch (error) {
                console.error('Error loading translations:', error);
            } finally {
                setLoadingTranslations(false);
            }
        };

        loadTranslations();
    }, [translate]);

    /**
     * Monitors menu items like meals, entrees, sides, appetizers, and drinks. 
     * Updates stored values and sets values in Menu.css.
     */
    useEffect(() => {
        const fetchData = async () => {
            // Get and Set Meals
            const fetchedMeals = await fetchMenuType('meal');
            setMeals(fetchedMeals);
            if (fetchedMeals.length < 3)
                document.documentElement.style.setProperty("--NumberOfMeals", 3); // Ensures if there are less than 3 meals the meals section doesn't scroll
            else
                document.documentElement.style.setProperty("--NumberOfMeals", fetchedMeals.length);

            // Get and Set Entrees
            const fetchedEntrees = await fetchMenuType('entree');
            setEntrees(fetchedEntrees);
            document.documentElement.style.setProperty("--NumberOfEntreeRows", Math.floor(fetchedEntrees.length / 4));

            // Get and Set Sides
            const fetchedSides = await fetchMenuType('side');
            setSides(fetchedSides);
            if (fetchedSides.length < 2)
                document.documentElement.style.setProperty("--NumberOfSides", 2);
            else
                document.documentElement.style.setProperty("--NumberOfSides", fetchedSides.length);

            // Get and Set Appetizers
            const fetchedAppetizers = await fetchMenuType('appetizer');
            setAppetizers(fetchedAppetizers);
            if (fetchedAppetizers.length < 4)
                document.documentElement.style.setProperty("--NumberOfAppetizers", 4); // Ensures if there are less than 4 appetizers the appetizer section doesn't scroll
            else
                document.documentElement.style.setProperty("--NumberOfAppetizers", fetchedAppetizers.length);

            // Get and Set Drinks
            const fetchedDrinks = await fetchMenuType('drink');
            setDrinks(fetchedDrinks);
            if (fetchedDrinks.length < 3)
                document.documentElement.style.setProperty("--NumberOfDrinks", 3); // Ensures if there are less than 3 drinks the drinks section doesn't scroll
            else
                document.documentElement.style.setProperty("--NumberOfDrinks", fetchedDrinks.length);
        };

        fetchData();
    }, []);

    if (loadingTranslations) {
        return <div>Loading translations...</div>;
    }

    return (
        <div className="menu-board">
            <header className="welcome">
                <h1>{translatedText.welcome}</h1>
            </header>

            {/* Top half of the Menu */}
            <div className="row-1">
                {/* Section for Meal options */}
                <section className="meal-options">
                    <h2>{translatedText.pickMeal}</h2>
                    <div className="meals-container">
                        {meals.map((item, index) => (<MealSlice key={index} item={item} />))}
                    </div>
                </section>

                {/* Bracket Separator */}
                <div className="bracket-1">
                    &#125;
                </div>

                {/* Section for main Entree options */}
                <section className="entrees">
                    <h2>{translatedText.entrees}</h2>
                    <div className="entree-grid">
                        {entrees.map((item, index) => (<EntreeSlice key={index} item={item} />))}
                    </div>
                </section>
            </div>

            {/* Bottom half of the Menu */}
            <div className="row-2">
                {/* Section for Sides options */}
                <div className="sides-bracket-container">
                    <div className="bracket-2">&#125;</div>
                    <section className="sides">
                        <h2>{translatedText.sides}</h2>
                        <div className="sides-container">
                            {sides.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (<SideSlice key={index} item={item} />))}
                        </div>
                    </section>
                </div>

                {/* Section for Appetizers and Drinks */}
                <section className="extras">
                    <div className="appetizers">
                        <h2>{translatedText.appetizers}</h2>
                        <div className="appetizer-container">
                            {appetizers.map((item, index) => (<AppetizerSlice key={index} item={item} />))}
                        </div>
                    </div>
                    <div className="drinks">
                        <h2>{translatedText.drinks}</h2>
                        <div className="drinks-container">
                            <img src={`${process.env.PUBLIC_URL}/Drinks.png`} alt="Drinks"></img>
                            <div className="drink-options">
                                {drinks.map((item, index) => (<DrinkSlice key={index} item={item} />))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

/**
 * MealSubText Function
 * 
 * Returns a styled paragraph element containing a description 
 * of the meal benefits based on its name. If the meal name is not recognized, 
 * it defaults to "N/A".
 * 
 * @param {string} name - name of the meal 
 * @returns {JSX.Element} - Styled <p> containing the meal details 
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
        <p className="meal-details">
            {ReturnedText}
        </p>
    );
}

/**
 * MealSlice Component
 * 
 * Renders a styled component displaying information about a meal, including 
 * its name, description, and price.
 * 
 * @component
 * @param {Object} item - A meal item with name, price, and calories
 * @returns {JSX.Element} - Styled <div> containing the meal item's data 
 */
const MealSlice = ( {item} ) => (
    <div class="meal-slice">
        <img src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}Icon.png`} alt={item.name}></img>
        <div class="details-container">
            <p class="meal-name">{item.name}</p>
            {MealSubText(item.name)}
            <p class="price">{item.name ? `$${item.price}` : 'N/A'}</p>
        </div>
    </div>
);

/**
 * Entree Component
 * 
 * Renders a styled component displaying information about an entree, including 
 * its name, description, and price.
 * 
 * @component
 * @param {Object} item - A entree item with name, price, and calories
 * @returns {JSX.Element} - Styled <div> containing the entree item's data 
 */
const EntreeSlice = ( {item} ) => (
    <div className="entree-slice">
        <img src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}.png`} alt={`${item.name}`}></img>
        <div class="entree-details">
            <p class="entree-name">{item.name}</p>
            <p class="calories">{item.calories ? `${item.calories} calories` : 'N/A'}</p>
        </div>
    </div>
);

/**
 * SideSlice Component
 * 
 * Renders a styled component displaying information about a side, including 
 * its name, description, and price.
 * 
 * @component
 * @param {Object} item - A side item with name, price, and calories
 * @returns {JSX.Element} - Styled <div> containing the side item's data 
 */
const SideSlice = ( {item} ) => (
    <div class="side-slice">
        <img src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}.png`} alt={`${item.name}`}></img>
        <p class="side-name">{item.name}</p>
        <p class="calories">{item.calories ? `${item.calories} calories` : 'N/A'}</p>
    </div>
);

/**
 * AppetizerSlice Component
 * 
 * Renders a styled component displaying information about an appetizer, including 
 * its name, description, and price.
 * 
 * @component
 * @param {Object} item - A appetizer item with name, price, and calories
 * @returns {JSX.Element} - Styled <div> containing the appetizer item's data 
 */
const AppetizerSlice = ( {item} ) => (
    <div class="appetizer-slice">
        <img src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}.png`} alt={`${item.name}`}></img>
        <p class="appetizer-name">{item.name}</p>
        <p class="calories">{item.calories ? `${item.calories} calories` : 'N/A'}</p>
        <p class="price">{item.price ? `$${item.price}` : 'No Price'}</p>
    </div>
);

/**
 * DrinkSubText Function
 * 
 * Returns a styled paragraph element containing a description 
 * of the drink fluid count based on its name. If the drink name is not recognized, 
 * it defaults to "N/A".
 * 
 * @param {string} name - name of the drink 
 * @returns {JSX.Element} - Styled <p> containing the drink size
 */
const DrinkSubText = ( name ) => {
    let ReturnedText;
    if (name === 'Small Drink') 
        ReturnedText = '16 fl oz';
    else if (name === 'Medium Drink') 
        ReturnedText = '24 fl oz';
    else if (name === "Large Drink")
        ReturnedText = '32 fl oz';
    else 
        ReturnedText = 'N/A';

    return (
        <p className="drink-size">
            {ReturnedText}
        </p>
    );
}

/**
 * DrinkSlice Component
 * 
 * Renders a styled component displaying information about a drink, including 
 * its name, description, and price.
 * 
 * 
 * @param {Object} item - A drink item with name, price, and calories
 * @returns {JSX.Element} - Styled <div> containing the drink item's data 
 */
const DrinkSlice = ( {item} ) => (
    <div class="drink-slice">
        <p class="drink-name">{`${item.name.replace(" Drink", '')}`}</p>
        {DrinkSubText(item.name)}
        <p class="price">{item.price ? `$${item.price}` : 'N/A'}</p>
    </div>
);

export default Menu;
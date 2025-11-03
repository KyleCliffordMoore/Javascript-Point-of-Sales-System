import React, { useEffect, useState } from 'react';
import { fetchPendingOrders, completeOrder } from '../services/kitchenApi';
import '../styles/KitchenView.css'; // Import CSS for styling
import { useNavigate } from 'react-router-dom';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

const KitchenView = () => {
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const { translate } = useFasterTranslate();
  const [translatedText, setTranslatedText] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  /**
   * Load translations for static labels.
   */
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Order',
          'Email:',
          'Time:',
          'Elapsed:',
          'Complete',
          'Back',
          'No orders',
          'None specified',
        ]);

        setTranslatedText({
          orderLabel: translations[0],
          emailLabel: translations[1],
          timeLabel: translations[2],
          elapsedLabel: translations[3],
          completeButton: translations[4],
          backButton: translations[5],
          noOrders: translations[6],
          noEmail: translations[7],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [translate]);

  const handleBack = () => {
    navigate(-1);
  };

  const loadOrders = async () => {
    const data = await fetchPendingOrders();
    const sortedOrders = data.sort((a, b) => new Date(b.order_time) - new Date(a.order_time)).slice(0, 6);
    setOrders(sortedOrders);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleComplete = async (receipt_id, email) => {
    const success = await completeOrder(receipt_id, email);
    if (success) {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.receipt_id !== receipt_id)
      );
    } else {
      alert('Error completing order');
    }
  };

  const getAdjustedOrderTime = (orderTime) => {
    let orderDate = new Date(orderTime);

    if (isNaN(orderDate)) {
      const currentDate = new Date().toISOString().split('T')[0];
      orderDate = new Date(`${currentDate}T${orderTime}`);
    }

    if (isNaN(orderDate)) {
      console.error(`Invalid order_time format: ${orderTime}`);
      return "Invalid time";
    }

    orderDate.setHours(orderDate.getHours() - 6);
    return orderDate.toTimeString().split(' ')[0];
  };

  const getElapsedTime = (orderTime) => {
    let orderDate = new Date(orderTime);

    if (isNaN(orderDate)) {
      const currentDate = new Date().toISOString().split('T')[0];
      orderDate = new Date(`${currentDate}T${orderTime}`);
    }

    if (isNaN(orderDate)) {
      console.error(`Invalid order_time format: ${orderTime}`);
      return "Invalid time";
    }

    orderDate.setHours(orderDate.getHours() - 6);
    const diff = Math.floor((currentTime - orderDate) / 1000);

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${minutes}m ${seconds}s ago`;
  };

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="kitchen-page">
      <div className="kitchen-view">
        {orders.length === 0 ? (
          <p className="no-orders-message">{translatedText.noOrders}</p>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.receipt_id} className="order-card">
                <h3>{`${translatedText.orderLabel} #${order.receipt_id}`}</h3>
                <p>
                  <strong>{translatedText.emailLabel}</strong>{' '}
                  {order.email || translatedText.noEmail}
                </p>
                <p>
                  <strong>{translatedText.timeLabel}</strong>{' '}
                  {getAdjustedOrderTime(order.order_time)}
                </p>
                <p>
                  <strong>{translatedText.elapsedLabel}</strong>{' '}
                  {getElapsedTime(order.order_time)}
                </p>
                <div className="order-items">
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.type === 'Meal' && (
                          <>
                            <strong>{item.size} Meal</strong>: {item.meats.join(', ')} with {item.side}
                          </>
                        )}
                        {item.type === 'Appetizer' && (
                          <>
                            <strong>Appetizer</strong>: {item.name}
                          </>
                        )}
                        {item.type === 'Drink' && (
                          <>
                            <strong>Drink</strong>: {item.size} {item.name}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => handleComplete(order.receipt_id, order.email)}>
                  {translatedText.completeButton}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="back-button" onClick={handleBack}>
        {translatedText.backButton}
      </button>
    </div>
  );
};

export default KitchenView;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, amount, courseId, userId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const options = {
                key: 'rzp_test_tjBFE0bB8UnJnG', // Razorpay key
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                name: 'GUVI',
                description: 'Course Payment',
                order_id: orderId, // Razorpay order ID
                handler: async (response) => {
                    // Handle successful payment here
                    console.log(response);
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#F37254',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Payment error:", err);
            setError('Payment initiation failed, please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handlePayment();
    }, []); // Trigger payment on component mount

    return (
        <div>
            {loading ? <p>Loading...</p> : <h1>Processing Payment...</h1>}
            {error && <div>{error}</div>}
        </div>
    );
};

export default Payment;

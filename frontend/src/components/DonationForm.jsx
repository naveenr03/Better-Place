/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function DonationForm({ campaignId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe has not been initialized');
      }

      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/crowdfunding/create-payment-intent',
        { amount: Number(amount), campaignId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { error: paymentError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      await axios.post(
        'http://localhost:5000/api/crowdfunding/donate',
        { campaignId, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <CardElement className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Donate'}
      </button>
    </form>
  );
}

export default DonationForm; 
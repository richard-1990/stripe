import React, { useState, useEffect, useCallback } from 'react';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser, AuthCheck } from 'reactfire';

import { db } from './firebase';
import { SignIn, SignOut } from './Customers';

const UserData = (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .doc(props.user.uid)
      .onSnapshot((doc) => setData(doc.data()));
    return () => unsubscribe;
  }, [props.user]);

  return (
    <pre>
      Stripe Customer Id: {data.stripeCustomerId} <br />
      Subscriptions: {JSON.stringify(data.activePlans || [])}
    </pre>
  );
};

const SubscibeToPlan = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();

  const [plan, setPlan] = useState();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSubscriptions = useCallback(async () => {
    if (user) {
      const subs = await fetchFromAPI('subscriptions', { method: 'GET' });
      setSubscriptions(subs);
    }
  }, [user]);

  useEffect(() => {
    getSubscriptions();
  }, [getSubscriptions]);

  const cancel = async (id) => {
    setLoading(true);
    await fetchFromAPI(`subscriptions/${id}`, { method: 'PATCH' });
    alert('cancelled');
    await getSubscriptions();
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const subscription = await fetchFromAPI('subscriptions', {
      body: { plan, paymentMethod: paymentMethod.id },
    });

    const { latest_invoice } = subscription;
    if (latest_invoice.payment_intent) {
      const { client_secret, status } = latest_invoice.payment_intent;

      if (status === 'requires_action') {
        const { error: confirmationError } = await stripe.confirmCardPayment(
          client_secret
        );
        if (confirmationError) {
          console.log(confirmationError);
          alert('unable to confirm card');
          return;
        }

        alert('You are subscribed!');
        getSubscriptions();
      }
      setLoading(false);
      setPlan(null);
    }
  };

  return (
    <>
      <AuthCheck fallback={<SignIn />}>
        <div>
          <div>
            <button onClick={() => setPlan('price_1HsryVEd42XMNDfdhvp2Y7iV')}>
              Choose Monthly £10/month
            </button>
            <button onClick={() => setPlan('price_1HsryVEd42XMNDfdEPDxivXB')}>
              Choose Yearly £100/month
            </button>
            <p>
              Selected Plan: <strong>{plan}</strong>
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} hidden={!plan}>
              <CardElement />
              <button type="submit" disabled={loading}>
                Subscribe & Pay
              </button>
            </form>
          </div>

          <h3>Manage Current Subscriptions</h3>
          <div>
            {subscriptions.map((sub) => (
              <div key={sub.id}>
                {sub.id}. Next payment of {sub.plan.amount} due{' '}
                {new Date(sub.current_period_end * 1000).toUTCString()}
                <button onClick={() => cancel(sub.id)} disabled={loading}>
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SignOut user={user} />
        </div>
      </AuthCheck>
    </>
  );
};

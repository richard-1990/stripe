import { useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { fetchFromApi } from './helpers';

export const Checkout = () => {
  const stripe = useStripe();
  // stripe.

  const [product, setProduct] = useState({
    name: 'Hat',
    description: 'Pug hat. A hat your pug will love.',
    images: ['your-img'],
    amount: 799,
    currency: 'gbp',
    quantity: 0,
  });

  const changeQuantity = (v) => {
    setProduct({ ...product, quantity: Math.max(0, product.quantity + v) });
  };

  const handleClick = async (event) => {
    const body = { line_items: [product] };
    const { id: sessionId } = await fetchFromApi('checkouts', { body });

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <h3>{product.name}</h3>
        <h4>Stripe Amount: {product.amount}</h4>
        <img src={product.images[0]} width="250px" alt="product" />
        <button onClick={() => changeQuantity(-1)}>-</button>
        {product.quantity}
        <button onClick={() => changeQuantity(+1)}>+</button>
      </div>
      <hr />
      <button onClick={handleClick} disabled={product.quantity < 1}>
        Start Checkout
      </button>
    </>
  );
};

export const CheckoutFail = () => {
  return <h3>Checkout Failed!</h3>;
};

export const CheckoutSuccess = () => {
  const url = window.location.href;
  const sessionId = new URL(url).searchParams.get('session_id');
  return <h3>Checkout was a Success! {sessionId}</h3>;
};

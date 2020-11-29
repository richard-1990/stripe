import { stripe } from '.';

export const createPaymentIntent = async (amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
  });

  return paymentIntent;
};

export const placeholder = 'placeholder';

import Stripe from 'stripe';
import { db } from './firebase';
import { stripe } from '.';

export const getOrCreateCustomer = async (
  userId: string,
  params?: Stripe.CustomerCreateParams
) => {
  const userSnapshot = await db.collection('users').doc(userId).get();

  const { stripeCustomerId, email } = userSnapshot.data();

  // If missing customerID, create it
  if (!stripeCustomerId) {
    // CREATE new customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        firebaseUID: userId,
      },
      ...params,
    });
    await userSnapshot.ref.update({ stripeCustomerId: customer.id });
    return customer;
  }
  return (await stripe.customers.retrieve(stripeCustomerId)) as Stripe.Customer;
};

export const createSetupIntent = async (userId: string) => {
  const customer = await getOrCreateCustomer(userId);
  return stripe.setupIntents.create({ customer: customer.id });
};

export const listPaymentMethods = async (userId: string) => {
  const customer = await getOrCreateCustomer(userId);

  return stripe.paymentMethods.list({
    customer: customer.id,
    type: 'card',
  });
};

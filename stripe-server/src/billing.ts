import Stripe from 'stripe';
import { firestore } from 'firebase-admin';
import { stripe } from '.';
import { db } from './firebase';
import { getOrCreateCustomer } from './customers';

export const createSubscription = async (
  userId: string,
  plan: string,
  paymentMethod: string
) => {
  const customer = await getOrCreateCustomer(userId);

  await stripe.paymentMethods.attach(paymentMethod, { customer: customer.id });

  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: paymentMethod },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan }],
    expand: ['latest_invoice.payment_intent'],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  if (paymentIntent.status === 'succeeded') {
    await db
      .collection('users')
      .doc(userId)
      .set(
        {
          stripeCustomerId: customer.id,
          activePlans: firestore.FieldValue.arrayUnion(plan),
        },
        { merge: true }
      );
  }

  return subscription;
};

export const cancelSubscription = async (
  userId: string,
  subscriptionId: string
) => {
  const customer = await getOrCreateCustomer(userId);
  if (customer.metadata.firebaseUID !== userId) {
    throw Error('Firebase UID does not match stripe customer');
  }
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
};

export const listSubscriptions = async (userId: string) => {
  const customer = await getOrCreateCustomer(userId);
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  });
  return subscriptions;
};

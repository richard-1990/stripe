import { firestore } from 'firebase-admin';
import Stripe from 'stripe';
import { stripe } from '.';
import { db } from './firebase';

const webhookHandlers = {
  'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {},
  'payment_intent.failed': async (data: Stripe.PaymentIntent) => {},
  'customer.subscription.create': async (data: Stripe.Subscription) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    const userId = customer.metadata.firebaseUID;
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      activePlans: firestore.FieldValue.arrayUnion(data.id),
    });
  },
  'invoice.payment_failed': async (data: Stripe.Invoice) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    if (!customer) {
      throw new Error('Customer not found');
    }

    const userSnapshot = await db
      .collection('users')
      .doc(customer.metadata.firebaseUID)
      .get();
    await userSnapshot.ref.update({ status: 'PAST_DUE' });
  },
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req['rawBody'],
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  try {
    await webhookHandlers[event.type](event.data.object);
    res.send({ received: true });
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export const placeholder = '';

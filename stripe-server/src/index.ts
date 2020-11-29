import { config } from 'dotenv';
import { app } from 'firebase-admin';
import Stripe from 'stripe';

import App from './api';

const port = process.env.PORT ?? 3333;

if (process.env.NODE_ENV !== 'production') {
  config();
}

export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: process.env.STRIPE_API_VERSION as string,
});

App.listen(port, () =>
  console.log(`App available on http://localhost:${port}`)
);

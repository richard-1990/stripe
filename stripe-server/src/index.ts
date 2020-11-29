import { config } from 'dotenv';
import Stripe from 'stripe';

import App from './api';

const port = process.env.PORT ?? 3333;

if (process.env.NODE_ENV !== 'production') {
  config();
}

export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

App.listen(port, () => {
  console.info(`App available on http://localhost:${port}`);
});

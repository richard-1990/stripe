import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useUser, AuthCheck } from 'reactfire';

import firebase from 'firebase/app';

import { auth, db } from './firebase';
import { Suspense, useEffect, useState } from 'react';
import { fetchFromApi } from './helpers';

export const SignIn = () => {
  const signIn = async () => {
    const credential = await auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );

    const { uid, email } = credential.user;
    db.collection('users').doc(uid).set({ email }, { merge: true });
  };

  return <button onClick={signIn}>Sign In with Google</button>;
};

export const SignOut = (props) => {
  return (
    props.user && (
      <button onClick={() => auth.signOut()}>
        Sign Out User {props.user.uid}
      </button>
    )
  );
};

const SaveCard = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();

  const [setupIntent, setSetupIntent] = useState();
  const [wallet, setWallet] = useState([]);
  const getWallet = async () => {
    if (user) {
      const paymentMethods = await fetchFromApi('wallet', { method: 'GET' });
      setWallet(paymentMethods);
    }
  };
  useEffect(() => {
    getWallet();
  }, [getWallet, user]);

  const createSetupIntent = async (event) => {
    const si = await fetchFromApi('wallet');
    setSetupIntent(si);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    const {
      setupIntent: updatedSetupIntent,
      error,
    } = await stripe.confirmCardSetup(setupIntent.client_secret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      alert(error.message);
      console.error(error);
    } else {
      setSetupIntent(updatedSetupIntent);
      await getWallet();
      alert('Success! Card added to your wallet');
    }
  };

  return (
    <>
      <AuthCheck fallback={<SignIn />}>
        <div>
          <button onClick={createSetupIntent} hidden={setupIntent}>
            Attach New Credit Card
          </button>
        </div>
        <hr />

        <form onSubmit={handleSubmit}>
          <CardElement />
          <button type="submit">Attach</button>
        </form>
        <div>
          <h3>Retrieve all Payment Sources</h3>
          <select>
            {wallet.map((paymentSource) => (
              <CreditCard key={paymentSource.id} card={paymentSource.card} />
            ))}
          </select>
        </div>
        <div>
          <SignOut user={user} />
        </div>
      </AuthCheck>
    </>
  );
};

const CreditCard = (props) => {
  const { last4, brand, exp_month, exp_year } = props.card;
  return (
    <option>
      {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
    </option>
  );
};

const Customers = () => {
  return (
    <Suspense fallback={'Loading user...'}>
      <SaveCard />
    </Suspense>
  );
};

export default Customers;

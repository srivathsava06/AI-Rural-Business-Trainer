import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

/**
 * Set up invisible reCAPTCHA for OTP verification.
 * Must be called once on the login page.
 */
export function setupRecaptcha(buttonId: string): RecaptchaVerifier {
  const verifier = new RecaptchaVerifier(auth, buttonId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved — allow signInWithPhoneNumber
    },
  });
  return verifier;
}

/**
 * Send OTP to the given phone number.
 * Returns a ConfirmationResult to verify the code later.
 */
export async function sendOTP(
  phone: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phone, verifier);
}

/**
 * Verify OTP code using the ConfirmationResult from sendOTP.
 * Returns the Firebase User on success.
 */
export async function verifyOTP(
  confirmationResult: ConfirmationResult,
  code: string
) {
  const result = await confirmationResult.confirm(code);
  return result.user;
}

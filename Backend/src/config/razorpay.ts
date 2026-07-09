import Razorpay from "razorpay";

export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error("❌ Razorpay ENV Missing");
    throw new Error("Razorpay keys not found in env");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};
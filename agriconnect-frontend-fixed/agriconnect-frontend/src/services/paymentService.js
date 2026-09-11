import {
  createPaymentApi,
  verifyPaymentApi,
} from "../api/paymentApi";

export const initiatePayment =
  async (orderData) => {
    try {
      const response =
        await createPaymentApi(
          orderData
        );

      return response;
    } catch (error) {
      throw error;
    }
  };

export const verifyPayment =
  async (paymentData) => {
    try {
      const response =
        await verifyPaymentApi(
          paymentData
        );

      return response;
    } catch (error) {
      throw error;
    }
  };
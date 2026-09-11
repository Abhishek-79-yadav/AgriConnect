export const formatCurrency =
  (
    amount,
    currency = "INR"
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style:
          "currency",
        currency,
      }
    ).format(amount);
  };

export const formatDate =
  (date) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN"
    );
  };

export const formatDateTime =
  (date) => {
    return new Date(
      date
    ).toLocaleString(
      "en-IN"
    );
  };

export const capitalize =
  (text = "") => {
    return (
      text
        .charAt(0)
        .toUpperCase() +
      text.slice(1)
    );
  };
export const generateId =
  () => {
    return (
      Date.now() +
      Math.floor(
        Math.random() *
          1000
      )
    );
  };

export const debounce =
  (
    func,
    delay = 500
  ) => {
    let timer;

    return (...args) => {
      clearTimeout(
        timer
      );

      timer =
        setTimeout(
          () =>
            func(
              ...args
            ),
          delay
        );
    };
  };

export const truncateText =
  (
    text,
    length = 100
  ) => {
    if (
      !text ||
      text.length <=
        length
    )
      return text;

    return (
      text.slice(
        0,
        length
      ) + "..."
    );
  };

export const sleep =
  (ms) =>
    new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          ms
        )
    );
export const doSomethingBefore = () => {
  return false;
};

export const forgotPassword = data => {
  const boolean = doSomethingBefore();
  if (!boolean) {
    return true;
  }
  return false;
};

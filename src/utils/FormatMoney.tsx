const currencySymbols: Record<string, string> = {
  THB: "฿",
  USD: "$",
};

export const formatMoney = (amount: number, currency: string) => {
  const currencyCode = currency.toUpperCase();
  const symbol = currencySymbols[currencyCode] ?? currencyCode;
  let amountSuffix = "";
  if (amount < 10000) {
    amountSuffix = "";
  } else if (amount >= 10000 && amount < 1000000) {
    amountSuffix = "K";
    amount = amount / 1000;
  } else if (amount >= 1000000 && amount < 1000000000) {
    amountSuffix = "M";
    amount = amount / 1000000;
  } else {
    amountSuffix = "B";
    amount = amount / 1000000000;
  }

  const formattedAmount = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formattedAmount}${amountSuffix}`;
};

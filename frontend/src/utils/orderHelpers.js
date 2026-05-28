export const ORDER_STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  Packed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const PAYMENT_STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Paid: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
  Refunded: 'bg-gray-100 text-gray-800',
};

export const ORDER_STEPS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

export const getOrderStepIndex = (status) => {
  if (status === 'Cancelled') return -1;
  return ORDER_STEPS.indexOf(status);
};

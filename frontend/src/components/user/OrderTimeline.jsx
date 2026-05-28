import { ORDER_STEPS, getOrderStepIndex } from '../../utils/orderHelpers';
import { FiCheck } from 'react-icons/fi';

const OrderTimeline = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
        This order has been cancelled.
      </div>
    );
  }

  const currentIndex = getOrderStepIndex(status);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary-500 transition-all duration-500"
          style={{ width: `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
        />
        {ORDER_STEPS.map((step, index) => {
          const completed = index <= currentIndex;
          const active = index === currentIndex;
          return (
            <div key={step} className="relative flex flex-col items-center z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  completed
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                } ${active ? 'ring-4 ring-primary-100' : ''}`}
              >
                {completed ? <FiCheck size={16} /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              <p className={`text-xs mt-2 text-center font-medium ${completed ? 'text-primary-700' : 'text-gray-400'}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;

const steps = ['Seller Type', 'Business', 'Location', 'Shop', 'Review'];

export default function SellerRegistrationStepper({ currentStep }) {
  return (
    <ol className="mb-8 grid grid-cols-5 gap-2">
      {steps.map((label, index) => {
        const step = index + 1;
        return (
          <li key={label} className={`text-center text-xs ${step <= currentStep ? 'font-semibold text-[#75d04b]' : 'text-gray-400'}`}>
            <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full border">{step}</span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

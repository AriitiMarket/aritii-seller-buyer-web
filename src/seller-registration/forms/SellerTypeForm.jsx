import { SELLER_TYPES } from '@/seller-registration/constants/sellerRegistrationConstants';

export default function SellerTypeForm({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-4 text-lg font-semibold">What describes you best?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {SELLER_TYPES.map((type) => (
          <label key={type.value} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
            <input type="radio" name="sellerType" value={type.value} checked={value === type.value} onChange={(event) => onChange(event.target.value)} />
            <span>{type.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

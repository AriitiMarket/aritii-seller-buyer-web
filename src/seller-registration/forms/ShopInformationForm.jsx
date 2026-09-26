const Field = ({ label, value, onChange, type = 'text', required = false }) => (
  <label className="block text-sm font-semibold">
    {label}{required && ' *'}
    <input type={type} value={value || ''} required={required} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded border p-3 font-normal" />
  </label>
);

export default function ShopInformationForm({ value, onChange }) {
  const update = (key, next) => onChange({ ...value, [key]: next });
  return (
    <div className="space-y-4">
      <Field label="Shop name" required value={value.shopName} onChange={(next) => update('shopName', next)} />
      <label className="block text-sm font-semibold">Shop category<input value={value.category || ''} readOnly className="mt-1 w-full rounded border p-3 font-normal bg-gray-50" /></label>
      <label className="block text-sm font-semibold">Shop description<textarea value={value.description || ''} onChange={(event) => update('description', event.target.value)} className="mt-1 w-full rounded border p-3 font-normal" rows={4} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Public phone" value={value.publicPhone} onChange={(next) => update('publicPhone', next)} />
        <Field label="Public email" type="email" value={value.publicEmail} onChange={(next) => update('publicEmail', next)} />
      </div>
    </div>
  );
}

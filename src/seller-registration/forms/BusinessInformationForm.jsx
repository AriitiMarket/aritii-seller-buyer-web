const Field = ({ label, value, onChange, type = 'text', required = false }) => (
  <label className="block text-sm font-semibold">
    {label}{required && ' *'}
    <input type={type} value={value || ''} required={required} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded border p-3 font-normal" />
  </label>
);

export default function BusinessInformationForm({ value, onChange, categories = [] }) {
  const update = (key, next) => onChange({ ...value, [key]: next });
  return (
    <div className="space-y-4">
      <Field label="Business name" required value={value.businessName} onChange={(next) => update('businessName', next)} />
      <label className="block text-sm font-semibold">Business category *<select value={value.businessCategory || ''} onChange={(event) => update('businessCategory', event.target.value)} className="mt-1 w-full rounded border p-3 font-normal"><option value="">Select an active business category</option>{categories.map((category) => <option key={category._id || category.id || category.title} value={category.title}>{category.title}</option>)}</select></label>
      <label className="block text-sm font-semibold">Description<textarea value={value.description || ''} onChange={(event) => update('description', event.target.value)} className="mt-1 w-full rounded border p-3 font-normal" rows={4} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" value={value.phone} onChange={(next) => update('phone', next)} />
        <Field label="Email" type="email" value={value.email} onChange={(next) => update('email', next)} />
      </div>
    </div>
  );
}

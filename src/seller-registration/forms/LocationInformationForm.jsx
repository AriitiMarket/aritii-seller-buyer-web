const fields = [
  ['regionName', 'Region'], ['cityName', 'City'], ['areaName', 'Area'], ['sectorName', 'Sector'],
  ['deliveryZoneName', 'Delivery zone'], ['landmark', 'Landmark'], ['specificPlace', 'Specific place'],
];

export default function LocationInformationForm({ value, onChange }) {
  const update = (key, next) => onChange({ ...value, [key]: next });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([key, label]) => (
        <label key={key} className="text-sm font-semibold">
          {label}{key === 'cityName' && ' *'}
          <input value={value[key] || ''} required={key === 'cityName'} onChange={(event) => update(key, event.target.value)} className="mt-1 w-full rounded border p-3 font-normal" />
        </label>
      ))}
      <label className="text-sm font-semibold sm:col-span-2">Address<textarea value={value.address || ''} onChange={(event) => update('address', event.target.value)} className="mt-1 w-full rounded border p-3 font-normal" rows={3} /></label>
    </div>
  );
}

/**
 * Saved delivery address → the `destination` contract the Commerce Service
 * validates on every order (normal checkout or request → order conversion):
 * `sectorId`, `fullAddress` and `phone` are mandatory, and an id must travel
 * with its display name.
 *
 * Extracted from Checkout.jsx so both order paths flatten an address the same
 * way — a free-text address can never produce a `sectorId`, so only saved
 * addresses (from /my-dashboard/addresses) are usable here.
 */
export function buildDestination(address) {
  if (!address) return null;
  return {
    regionId: address.regionId || null,
    regionName: address.regionName || address.country || '',
    cityId: address.cityId || null,
    cityName: address.cityName || address.city || '',
    areaId: address.areaId || null,
    areaName: address.areaName || '',
    sectorId: address.sectorId,
    sectorName: address.sectorName || '',
    fullAddress: [
      address.address1,
      address.address2,
      address.cityName || address.city,
      address.regionName || address.country,
    ]
      .filter(Boolean)
      .join(', '),
    landmark: address.landmark || '',
    building: address.houseBuilding || '',
    phone: address.phone || '',
  };
}

/** A saved address can only become a destination when it has sector + phone. */
export function isUsableAddress(address) {
  return Boolean(address && address.sectorId && address.phone);
}

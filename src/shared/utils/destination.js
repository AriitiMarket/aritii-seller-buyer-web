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

/**
 * The address an order is going to, rendered for the buyer.
 *
 * Prefers the `destination` snapshot (region → city → area → sector, the full
 * street address and the contact phone) and falls back to the older
 * `shippingAddress` shape. The order detail screen used to read
 * `shippingAddress.state` — a field checkout never writes — so the address
 * always rendered with a blank region and a stray comma.
 *
 * @param {object|null} order
 * @returns {{lines: string[], phone: string}}
 */
export function formatOrderAddress(order) {
  const destination = (order && order.destination) || {};
  const shipping = (order && order.shippingAddress) || {};
  const lines = [];

  const street = destination.fullAddress
    || [shipping.address1, shipping.address2].filter(Boolean).join(', ');
  if (street) lines.push(street);

  // The sector/area are what a rider actually navigates to, and `fullAddress`
  // never carries them.
  const subArea = [destination.sectorName, destination.areaName].filter(Boolean).join(', ');
  if (subArea && !street.includes(subArea)) lines.push(subArea);

  // `fullAddress` already ends with city and region — only add them when the
  // order predates the destination snapshot.
  if (!destination.fullAddress) {
    const city = destination.cityName || shipping.city;
    const region = destination.regionName || shipping.country;
    const tail = [city, region].filter(Boolean).join(', ');
    if (tail) lines.push(tail);
  }

  return { lines, phone: destination.phone || '' };
}

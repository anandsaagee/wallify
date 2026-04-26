export const SIZES = [
  { id: 'A6', label: 'A6', dim: '10.5×14.8 cm', price: 17, strikePrice: 33 },
  { id: 'A5', label: 'A5', dim: '14.8×21 cm', price: 33, strikePrice: 49 },
  { id: 'A4', label: 'A4', dim: '21×29.7 cm', price: 49, strikePrice: 99 },
  { id: 'A3', label: 'A3', dim: '29.7×42 cm', price: 99, strikePrice: 149 },
];

// Buy 5 posters → Get 1 Mystery Poster Free
export const BUNDLE_OFFER = {
  requiredQty: 5,
  freeQty: 1,
  label: 'Buy 5 Get 1 Free',
  description: 'A mystery poster matching your selected size will be automatically added!',
};

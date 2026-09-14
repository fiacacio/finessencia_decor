export type CustomerPopupSettings = { enabled: boolean; image_url: string; title: string; coupon_code: string }
export const defaultCustomerPopup: CustomerPopupSettings = {
  enabled: false,
  image_url: '/essencias_clique/Difusores.webp',
  title: 'Faça parte da nossa essência',
  coupon_code: '',
}
export type CustomerInput = { name: string; email: string; phone: string; birth_date: string; marketing_consent: boolean }
export type Customer = Omit<CustomerInput, 'birth_date'> & { birth_date: string | null; id: string; created_at: string }


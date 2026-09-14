import { createSupabaseClient } from '@/lib/supabase'
import type { Customer, CustomerInput, CustomerPopupSettings } from '@/lib/customer-popup'

export async function getCustomerPopup(): Promise<CustomerPopupSettings> {
  const { data, error } = await createSupabaseClient().from('customer_popup_settings').select('enabled,image_url,title,coupon_code').eq('id', 1).single()
  if (error) throw new Error('Não foi possível carregar o pop-up. Verifique se o SQL de clientes foi executado no Supabase.')
  return data
}
export async function saveCustomerPopup(settings: CustomerPopupSettings) {
  if (!settings.title.trim() || settings.title.length > 120 || settings.coupon_code.length > 60) throw new Error('Verifique o título e o código do cupom.')
  const { error } = await createSupabaseClient().from('customer_popup_settings').update({ ...settings, title: settings.title.trim(), coupon_code: settings.coupon_code.trim() }).eq('id', 1).select('id').single()
  if (error) throw new Error('Não foi possível salvar o pop-up.')
}
export async function registerCustomer(customer: CustomerInput) {
  const { error } = await createSupabaseClient().rpc('register_customer', {
    p_name: customer.name.trim(), p_email: customer.email.trim().toLowerCase(),
    p_phone: customer.phone.replace(/\D/g, ''), p_birth_date: customer.birth_date || null,
    p_marketing_consent: customer.marketing_consent,
  })
  if (error) throw new Error('Não foi possível concluir o cadastro. Confira seus dados e tente novamente.')
}
export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await createSupabaseClient().from('customers').select('id,name,email,phone,birth_date,marketing_consent,created_at').order('created_at', { ascending: false }).limit(100)
  if (error) throw new Error('Não foi possível carregar os clientes.')
  return data
}


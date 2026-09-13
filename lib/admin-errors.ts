export function adminErrorMessage(cause: unknown, fallback = 'Não foi possível concluir a operação.') {
  if (!cause || typeof cause !== 'object') return fallback
  const error = cause as { code?: string; message?: string; status?: number }
  if (error.code === '23505') return 'Já existe um cadastro com esse nome. Escolha outro nome.'
  if (error.code === '23503') return 'Este cadastro está vinculado a outros registros. Revise os vínculos antes de salvar ou excluir.'
  if (error.code === '42501' || error.status === 403) return 'Sua conta não tem permissão para esta alteração. Entre novamente com uma conta administradora.'
  if (['PGRST301', 'PGRST302', 'PGRST303'].includes(error.code || '') || error.status === 401) return 'Sua sessão expirou. Entre novamente no painel.'
  if (['PGRST202','PGRST204','PGRST205','42703','42P01'].includes(error.code || '')) return 'O banco de dados precisa ser atualizado para esta versão do painel. Aplique a atualização SQL de fotos e salvamento.'
  if (error.message?.includes('unaccent')) return 'A função de atualização dos produtos precisa ser corrigida no banco de dados.'
  return error.message || fallback
}

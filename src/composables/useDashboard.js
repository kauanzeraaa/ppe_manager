import { ref } from 'vue'
import { useSupabase } from './useSupabase'

export function useDashboard() {

  const { supabase } = useSupabase()

  const isLoading = ref(true)
  const hasError = ref(false)

  const totalEpis = ref(0)
  const emEstoque = ref(0)
  const itensCriticos = ref(0)
  const caValidos = ref(0)
  const caVencendo = ref(0)
  const caVencidos = ref(0)
  const caSemCadastro = ref(0)
  const conformidadePercentual = ref(0)

  const carregarDashboard = async () => {

    isLoading.value = true
    hasError.value = false

    try {

      const { data: epis, error } = await supabase
        .from('view_estoque_epi')
        .select('*')

      if (error) {
        throw error
      }

      totalEpis.value = epis?.length || 0

      emEstoque.value = epis?.reduce(
        (acc, item) => acc + (item.quantidade_atual || 0),
        0
      ) || 0

      itensCriticos.value = epis?.filter(
        item => (item.quantidade_atual || 0) <= (item.estoque_minimo || 0)
      ).length || 0

      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      const contadores = (epis || []).reduce((acc, item) => {
        const possuiCa = Boolean(item.certificado_autenticacao)
        const validade = item.validade ? new Date(item.validade) : null

        if (!possuiCa) {
          acc.semCadastro += 1
          return acc
        }

        if (!validade || Number.isNaN(validade.getTime())) {
          acc.validos += 1
          return acc
        }

        validade.setHours(0, 0, 0, 0)
        const diferencaDias = Math.ceil(
          (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diferencaDias < 0) {
          acc.vencidos += 1
        } else if (diferencaDias <= 30) {
          acc.vencendo += 1
        } else {
          acc.validos += 1
        }

        return acc
      }, {
        validos: 0,
        vencendo: 0,
        vencidos: 0,
        semCadastro: 0
      })

      caValidos.value = contadores.validos
      caVencendo.value = contadores.vencendo
      caVencidos.value = contadores.vencidos
      caSemCadastro.value = contadores.semCadastro

      const totalConformidade =
        caValidos.value +
        caVencendo.value +
        caVencidos.value +
        caSemCadastro.value

      conformidadePercentual.value = totalConformidade
        ? Math.round((caValidos.value / totalConformidade) * 100)
        : 0

    } catch (error) {

      console.error(error)
      hasError.value = true

    } finally {

      isLoading.value = false

    }

  }

  return {
    isLoading,
    hasError,
    totalEpis,
    emEstoque,
    itensCriticos,
    caValidos,
    caVencendo,
    caVencidos,
    caSemCadastro,
    conformidadePercentual,
    carregarDashboard
  }

}

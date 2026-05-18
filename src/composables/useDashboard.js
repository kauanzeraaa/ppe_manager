import { ref } from 'vue'
import { useSupabase } from './useSupabase'

export function useDashboard() {

  const { supabase } = useSupabase()

  const isLoading = ref(true)
  const hasError = ref(false)

  const totalEpis = ref(0)
  const emEstoque = ref(0)
  const itensCriticos = ref(0)

  const carregarDashboard = async () => {

    isLoading.value = true
    hasError.value = false

    try {

      const { data: epis } = await supabase
        .from('epis')
        .select('*')

      totalEpis.value = epis?.length || 0

      emEstoque.value = epis?.reduce(
        (acc, item) => acc + (item.quantidade || 0),
        0
      ) || 0

      itensCriticos.value = epis?.filter(
        item => (item.quantidade || 0) < (item.quantidade_minima || 0)
      ).length || 0

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
    carregarDashboard
  }

}
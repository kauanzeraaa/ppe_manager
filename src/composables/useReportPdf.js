import { nextTick, ref } from 'vue'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getPrintStyles() {
  return `
    :root {
      --color-orange: #F39C12;
      --color-blue: #0158B5;
      --color-blue-dark: #2B4A69;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 32px;
      background: #ffffff;
      color: #243444;
      font-family: Arial, sans-serif;
    }

    .print-page {
      max-width: 1120px;
      margin: 0 auto;
    }

    .filters-panel {
      display: none !important;
    }

    .print-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;
      margin-bottom: 28px;
      padding-bottom: 18px;
      border-bottom: 2px solid #E6ECF2;
    }

    .print-badge {
      display: inline-block;
      background: #FFF3DE;
      color: var(--color-orange);
      font-size: 13px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .print-title {
      margin: 0;
      font-size: 28px;
      line-height: 1.2;
      color: var(--color-blue-dark);
    }

    .print-meta {
      min-width: 240px;
      padding: 14px 16px;
      border: 1px solid #E6ECF2;
      border-radius: 14px;
      background: #F8FBFD;
    }

    .print-meta-label {
      display: block;
      margin-bottom: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6A7B8C;
    }

    .print-meta-value {
      font-size: 14px;
      color: var(--color-blue-dark);
    }

    .metrics-grid,
    .chart-row {
      display: grid !important;
      gap: 16px;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-bottom: 28px;
    }

    .chart-row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .chart-item.full-width,
    .chart-row > .full-width {
      grid-column: 1 / -1;
    }

    .report-card,
    .chart-container,
    .summary-section {
      background: #ffffff !important;
      border: 1px solid #E6ECF2 !important;
      border-radius: 16px !important;
      box-shadow: none !important;
      break-inside: avoid;
    }

    .report-card { padding: 18px !important; }
    .chart-container { padding: 18px !important; }

    .summary-section {
      padding: 20px !important;
      margin-top: 10px;
    }

    .card-title,
    .summary-title,
    .title {
      color: var(--color-blue-dark) !important;
    }

    .card-subtitle,
    .trend,
    .summary-table td,
    .summary-table th,
    .print-meta-value {
      color: #516374 !important;
    }

    .summary-table {
      width: 100%;
      border-collapse: collapse;
    }

    .summary-table thead {
      background: #F8FBFD !important;
      border-bottom: 2px solid var(--color-orange) !important;
    }

    .summary-table th,
    .summary-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #E6ECF2;
    }

    .status-ok {
      background: #EEF5FB !important;
      color: var(--color-blue-dark) !important;
    }

    .percentage {
      color: var(--color-blue) !important;
    }

    .chart-image {
      display: block;
      width: 100%;
      max-width: 100%;
      height: auto;
    }

    @page {
      size: A4;
      margin: 16mm;
    }
  `
}

export function useReportPdf() {
  const reportContentRef = ref(null)
  const isGeneratingPdf = ref(false)

  async function buildPrintableReport() {
    if (!reportContentRef.value) return ''

    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const clone = reportContentRef.value.cloneNode(true)
    const canvases = reportContentRef.value.querySelectorAll('canvas')
    const clonedCanvases = clone.querySelectorAll('canvas')

    clonedCanvases.forEach((canvas, index) => {
      const sourceCanvas = canvases[index]
      if (!sourceCanvas) return

      const image = document.createElement('img')
      image.src = sourceCanvas.toDataURL('image/png', 1)
      image.alt = 'Grafico do relatorio'
      image.className = 'chart-image'
      image.style.width = '100%'
      image.style.height = 'auto'
      canvas.replaceWith(image)
    })

    return clone.innerHTML
  }

  async function generateReportPdf({ title, generatedAt }) {
    const printableContent = await buildPrintableReport()
    if (!printableContent) return

    isGeneratingPdf.value = true

    const printWindow = window.open('', '_blank', 'width=1280,height=900')
    if (!printWindow) {
      isGeneratingPdf.value = false
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(title)}</title>
          <style>${getPrintStyles()}</style>
        </head>
        <body>
          <main class="print-page">
            <header class="print-header">
              <div>
                <span class="print-badge">Relatorio</span>
                <h1 class="print-title">${escapeHtml(title)}</h1>
              </div>
              <div class="print-meta">
                <span class="print-meta-label">Gerado em</span>
                <span class="print-meta-value">${escapeHtml(generatedAt)}</span>
              </div>
            </header>
            ${printableContent}
          </main>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    const finalize = () => {
      isGeneratingPdf.value = false
      printWindow.close()
    }

    printWindow.onload = () => {
      printWindow.print()
      setTimeout(finalize, 500)
    }
  }

  return {
    reportContentRef,
    isGeneratingPdf,
    generateReportPdf
  }
}

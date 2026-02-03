'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, FileText, Lightbulb, User, Bot } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import consultasDemo from '@/data/consultas-demo.json'
import { PREGUNTAS_SUGERIDAS } from '@/lib/constants'
import { cn, matchKeywords, generateId } from '@/lib/utils'

interface Mensaje {
  id: string
  role: 'user' | 'assistant'
  content: string
  datos?: any[]
  fuentes?: any[]
  insight?: string
}

export default function ConsultasPage() {
  const searchParams = useSearchParams()
  const [input, setInput] = useState('')
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Si viene una query por URL, ejecutarla
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && mensajes.length === 0) {
      handleSubmit(q)
    }
  }, [searchParams])

  const findResponse = (query: string) => {
    // Buscar en consultas demo
    const consulta = consultasDemo.find((c) =>
      matchKeywords(query, c.keywords)
    )

    if (consulta) {
      return {
        content: consulta.respuesta,
        datos: consulta.datos || undefined,
        fuentes: consulta.fuentes || undefined,
        insight: consulta.insight || undefined,
      }
    }

    // Respuesta genérica
    return {
      content:
        'No encontré información específica sobre esa consulta en los convenios cargados. Intentá reformular la pregunta o consultá alguna de las sugerencias.',
      datos: undefined,
      fuentes: undefined,
      insight: undefined,
    }
  }

  const handleSubmit = async (query?: string) => {
    const pregunta = query || input
    if (!pregunta.trim()) return

    // Agregar mensaje del usuario
    const userMessage: Mensaje = {
      id: generateId(),
      role: 'user',
      content: pregunta,
    }
    setMensajes((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simular delay
    await new Promise((r) => setTimeout(r, 800))

    // Buscar respuesta
    const response = findResponse(pregunta)
    const assistantMessage: Mensaje = {
      id: generateId(),
      role: 'assistant',
      content: response.content,
      datos: response.datos ?? undefined,
      fuentes: response.fuentes ?? undefined,
      insight: response.insight ?? undefined,
    }
    setMensajes((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat principal */}
      <div className="flex flex-1 flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-500">
            Preguntá sobre convenios, cláusulas o condiciones
          </p>
        </div>

        {/* Mensajes */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {mensajes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¿En qué puedo ayudarte?
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Podés preguntarme sobre salarios, adicionales, licencias,
                  cláusulas específicas o comparar empresas.
                </p>
              </div>
            ) : (
              mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={cn(
                    'flex gap-3',
                    mensaje.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {mensaje.role === 'assistant' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-4',
                      mensaje.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{mensaje.content}</p>

                    {/* Datos en tabla */}
                    {mensaje.datos && mensaje.datos.length > 0 && (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              {Object.keys(mensaje.datos[0]).map((key) => (
                                <th
                                  key={key}
                                  className="pb-2 text-left font-medium capitalize"
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {mensaje.datos.map((row, i) => (
                              <tr key={i} className="border-b">
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="py-2">
                                    {String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Insight */}
                    {mensaje.insight && (
                      <div className="mt-4 flex items-start gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                        <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{mensaje.insight}</span>
                      </div>
                    )}

                    {/* Fuentes */}
                    {mensaje.fuentes && mensaje.fuentes.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-gray-500">
                          Fuentes:
                        </p>
                        {mensaje.fuentes.map((fuente, i) => (
                          <button
                            key={i}
                            className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                          >
                            <FileText className="h-3 w-3" />
                            {fuente.documento}, {fuente.articulo}, pág.{' '}
                            {fuente.pagina}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {mensaje.role === 'user' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div className="rounded-lg bg-gray-100 p-4">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí tu pregunta..."
                className="flex-1 rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Panel lateral - Sugerencias */}
      <div className="w-80 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Preguntas Sugeridas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PREGUNTAS_SUGERIDAS.map((pregunta, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(pregunta)}
                disabled={isLoading}
                className="w-full text-left rounded-lg border p-3 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {pregunta}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Sobre las respuestas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-500 space-y-2">
            <p>
              Las respuestas se basan en los convenios colectivos cargados en el
              sistema.
            </p>
            <p>
              Cada respuesta incluye la fuente exacta (documento, artículo y
              página) para que puedas verificar la información.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

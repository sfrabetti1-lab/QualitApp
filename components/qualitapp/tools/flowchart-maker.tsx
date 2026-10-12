'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Trash2, Download, Upload, Printer, GitBranch, ArrowLeft, Undo2 } from 'lucide-react'

interface FlowchartMakerProps {
  onBack?: () => void
}

interface ShapeNode {
  id: string
  type: 'start' | 'process' | 'decision' | 'document'
  text: string
  x: number
  y: number
  width: number
  height: number
}

interface ConnectionLine {
  id: string
  from: string
  to: string
  label?: 'Sì' | 'No' | ''
  color?: string
}

export function FlowchartMaker({ onBack }: FlowchartMakerProps) {
  const [nodes, setNodes] = useState<ShapeNode[]>([])
  const [edges, setEdges] = useState<ConnectionLine[]>([])
  const [history, setHistory] = useState<{ nodes: ShapeNode[]; edges: ConnectionLine[] }[]>([])

  const saveToHistory = () => {
    setHistory((prev) => [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }])
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const previousState = history[history.length - 1]
    setNodes(previousState.nodes)
    setEdges(previousState.edges)
    setHistory((prev) => prev.slice(0, prev.length - 1))
  }

  const [nodeType, setNodeType] = useState<'start' | 'process' | 'decision' | 'document'>('process')
  const [nodeText, setNodeText] = useState('')
  const [branchType, setBranchType] = useState<'normal' | 'si' | 'no'>('normal')

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [resizingHandle, setResizingHandle] = useState<string | null>(null)
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const resizeStart = useRef<{ x: number; y: number; w: number; h: number; nodeX: number; nodeY: number }>({ x: 0, y: 0, w: 0, h: 0, nodeX: 0, nodeY: 0 })

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const handleAddNode = () => {
    if (!nodeText.trim()) return
    saveToHistory()

    const id = generateId()
    const newNode: ShapeNode = {
      id,
      type: nodeType,
      text: nodeText,
      x: 500 + (nodes.length * 40) % 300,
      y: 200 + (nodes.length * 40) % 200,
      width: nodeType === 'decision' ? 120 : 180,
      height: nodeType === 'decision' ? 120 : 60,
    }

    setNodes((prev) => [...prev, newNode])
    setSelectedNodeId(id)
    setNodeText('')
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    saveToHistory()
    setDraggingId(id)
    setSelectedNodeId(id)
    setSelectedEdgeId(null)

    const node = nodes.find(n => n.id === id)
    if (node) {
      dragOffset.current = {
        x: e.clientX - node.x,
        y: e.clientY - node.y,
      }
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent, id: string, handle: string) => {
    e.stopPropagation()
    saveToHistory()
    setResizingHandle(handle)
    setSelectedNodeId(id)
    setSelectedEdgeId(null)

    const node = nodes.find(n => n.id === id)
    if (node) {
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        w: node.width,
        h: node.height,
        nodeX: node.x,
        nodeY: node.y,
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === draggingId) {
            return {
              ...node,
              x: Math.max(10, e.clientX - dragOffset.current.x),
              y: Math.max(10, e.clientY - dragOffset.current.y),
            }
          }
          return node
        })
      )
    } else if (resizingHandle && selectedNodeId) {
      const dx = e.clientX - resizeStart.current.x
      const dy = e.clientY - resizeStart.current.y

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === selectedNodeId) {
            let newW = resizeStart.current.w
            let newH = resizeStart.current.h
            let newX = resizeStart.current.nodeX
            let newY = resizeStart.current.nodeY

            if (resizingHandle.includes('r')) newW = Math.max(60, resizeStart.current.w + dx)
            if (resizingHandle.includes('b')) newH = Math.max(40, resizeStart.current.h + dy)
            if (resizingHandle.includes('l')) {
              const potentialW = resizeStart.current.w - dx
              if (potentialW >= 60) {
                newW = potentialW
                newX = resizeStart.current.nodeX + dx
              }
            }
            if (resizingHandle.includes('t')) {
              const potentialH = resizeStart.current.h - dy
              if (potentialH >= 40) {
                newH = potentialH
                newY = resizeStart.current.nodeY + dy
              }
            }

            return { ...node, width: newW, height: newH, x: newX, y: newY }
          }
          return node
        })
      )
    }
  }

  const handleMouseUp = () => {
    setDraggingId(null)
    setResizingHandle(null)
  }

  const handleNodeClickForConnect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!connectingFromId) {
      setConnectingFromId(id)
    } else {
      if (connectingFromId !== id) {
        saveToHistory()
        let labelText: 'Sì' | 'No' | '' = ''
        let strokeColor = '#2563eb'

        if (branchType === 'si') {
          labelText = 'Sì'
          strokeColor = '#16a34a'
        } else if (branchType === 'no') {
          labelText = 'No'
          strokeColor = '#dc2626'
        }

        const newEdge: ConnectionLine = {
          id: generateId(),
          from: connectingFromId,
          to: id,
          label: labelText,
          color: strokeColor,
        }
        setEdges((prev) => [...prev, newEdge])
      }
      setConnectingFromId(null)
    }
  }

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNodeId && !selectedEdgeId) return
    saveToHistory()

    if (selectedNodeId) {
      setNodes((prev) => prev.filter(n => n.id !== selectedNodeId))
      setEdges((prev) => prev.filter(e => e.from !== selectedNodeId && e.to !== selectedNodeId))
      setSelectedNodeId(null)
    }

    if (selectedEdgeId) {
      setEdges((prev) => prev.filter(e => e.id !== selectedEdgeId))
      setSelectedEdgeId(null)
    }
  }, [selectedNodeId, selectedEdgeId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
        handleDeleteSelected()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDeleteSelected])

  // CALCOLO GEOMETRICO RIGOROSO: Innesto sempre centrato sul bordo superiore
  const getConnectionPoints = (n1: ShapeNode, n2: ShapeNode) => {
    const c1X = n1.x + n1.width / 2
    const c1Y = n1.y + n1.height / 2
    const c2X = n2.x + n2.width / 2
    const c2Y = n2.y + n2.height / 2

    let startX = c1X
    let startY = c1Y
    let endX = c2X
    let endY = c2Y

    // 1. Uscita dal nodo di partenza (N1)
    if (n1.type === 'decision') {
      const dx = c2X - c1X
      const dy = c2Y - c1Y
      if (Math.abs(dx) > Math.abs(dy)) {
        startX = dx > 0 ? n1.x + n1.width : n1.x
        startY = c1Y
      } else {
        startX = c1X
        startY = n1.y + n1.height
      }
    } else {
      const dx = c2X - c1X
      const dy = c2Y - c1Y
      if (Math.abs(dx) > Math.abs(dy) + 30) {
        startX = dx > 0 ? n1.x + n1.width : n1.x
        startY = c1Y
      } else {
        startX = c1X
        startY = dy > 0 ? n1.y + n1.height : n1.y
      }
    }

    // 2. Ingresso nel nodo di arrivo (N2)
    if (c2Y > startY) {
      endX = n2.x + n2.width / 2 // Centro orizzontale esatto del bordo superiore
      endY = n2.y                // Bordo superiore
    } else if (c2Y < startY) {
      endX = n2.x + n2.width / 2
      endY = n2.y + n2.height     // Bordo inferiore se sta sopra
    } else {
      endX = c2X > c1X ? n2.x : n2.x + n2.width
      endY = c2Y
    }

    return { startX, startY, endX, endY }
  }

  const getOrthogonalPath = (n1: ShapeNode, n2: ShapeNode) => {
    const { startX, startY, endX, endY } = getConnectionPoints(n1, n2)

    if (Math.abs(endX - startX) < 5 || Math.abs(endY - startY) < 5) {
      return `M ${startX} ${startY} L ${endX} ${endY}`
    }

    const c1X = n1.x + n1.width / 2
    const c2X = n2.x + n2.width / 2

    if (Math.abs(c2X - c1X) > Math.abs(n2.y - n1.y) + 20 || (n1.type === 'decision' && Math.abs(endX - startX) > Math.abs(endY - startY))) {
      const midX = startX + (endX - startX) / 2
      return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`
    }

    const midY = startY + (endY - startY) / 2
    return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`
  }

  const exportProject = () => {
    const projectData = { nodes, edges }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projectData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'qualitapp_diagram_custom.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const importProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (imported.nodes && imported.edges) {
          saveToHistory()
          setNodes(imported.nodes)
          setEdges(imported.edges)
        }
      } catch {
        alert('Errore durante la lettura del file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden select-none" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-canvas { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; background: white !important; z-index: 9999 !important; }
        }
      `}} />

      {/* Header */}
      <div className="no-print h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-xs z-25">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { if (onBack) onBack(); else window.location.href = '/'; }}
            className="flex items-center gap-1.5 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-border"
          >
            <ArrowLeft className="size-4" /> Torna al Menu
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <GitBranch className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground tracking-wide uppercase">QualitApp Custom Diagram Studio</h2>
              <p className="text-[11px] text-muted-foreground">Editor nativo ad alta precisione geometrica</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`flex items-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl border border-border transition-colors ${history.length === 0 ? 'opacity-50 cursor-not-allowed bg-muted/50 text-muted-foreground' : 'bg-muted text-muted-foreground hover:text-foreground cursor-pointer'}`}
          >
            <Undo2 className="size-4" /> Annulla
          </button>
          <button
            type="button"
            onClick={exportProject}
            className="flex items-center gap-1.5 bg-muted text-muted-foreground hover:text-foreground text-xs font-bold py-2 px-3 rounded-xl border border-border transition-colors cursor-pointer"
          >
            <Download className="size-4" /> Salva (.json)
          </button>
          <label className="flex items-center gap-1.5 bg-muted text-muted-foreground hover:text-foreground text-xs font-bold py-2 px-3 rounded-xl border border-border transition-colors cursor-pointer">
            <Upload className="size-4" /> Carica
            <input type="file" accept=".json" onChange={importProject} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Printer className="size-4" /> Stampa / PDF
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="no-print w-96 border-r border-border bg-muted/20 p-6 flex flex-col gap-6 overflow-y-auto z-20">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Aggiungi Figura
            </span>

            <div className="bg-card p-5 rounded-2xl border border-border space-y-4 shadow-xs">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">Tipo di Figura</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value as any)}
                  className="w-full text-sm bg-background border border-input rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-ring font-semibold"
                >
                  <option value="start">🟡 Inizio / Fine (Ovale)</option>
                  <option value="process">🔵 Attività (Rettangolo)</option>
                  <option value="decision">🔴 Bivio Decisionale (Rombo)</option>
                  <option value="document">📄 Documento (Modulo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">Testo nella Figura</label>
                <input
                  type="text"
                  value={nodeText}
                  onChange={(e) => setNodeText(e.target.value)}
                  placeholder="Es. Verifica requisiti..."
                  className="w-full text-sm bg-background border border-input rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-ring font-medium"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddNode() }}
                />
              </div>

              <button
                type="button"
                onClick={handleAddNode}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl transition-all shadow-sm cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="size-4" /> Inserisci nel Canvas
              </button>
            </div>

            {/* Bivi */}
            <div className="bg-card p-5 rounded-2xl border border-border space-y-3 shadow-xs">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Tipo di Connessione (Bivi)
              </span>
              <p className="text-[11px] text-muted-foreground">
                Seleziona il ramo prima di unire due blocchi:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBranchType('normal')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${branchType === 'normal' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-input'}`}
                >
                  Normale
                </button>
                <button
                  type="button"
                  onClick={() => setBranchType('si')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${branchType === 'si' ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-200'}`}
                >
                  Sì 🟢
                </button>
                <button
                  type="button"
                  onClick={() => setBranchType('no')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${branchType === 'no' ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200'}`}
                >
                  No 🔴
                </button>
              </div>
            </div>

            {connectingFromId && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-900 space-y-1">
                <p className="font-bold">🔗 Modalità Connessione attiva:</p>
                <p>Clicca su un secondo blocco per completare la freccia a gomito.</p>
                <button type="button" onClick={() => setConnectingFromId(null)} className="text-xs underline font-bold mt-1 cursor-pointer">Annulla</button>
              </div>
            )}

            {(selectedNodeId || selectedEdgeId) && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all cursor-pointer border border-destructive/20 shadow-xs"
              >
                <Trash2 className="size-4" /> Elimina Selezionato ({selectedEdgeId ? 'Linea' : 'Blocco'})
              </button>
            )}
          </div>
        </div>

        {/* Canvas Interattivo */}
        <div 
          className="print-canvas flex-1 h-full bg-slate-50 relative overflow-auto"
          onClick={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
        >
          <div className="absolute inset-0 min-w-[3000px] min-h-[3000px] pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          {/* SVG Linee */}
          <svg className="absolute inset-0 min-w-[3000px] min-h-[3000px] pointer-events-auto z-0">
            {edges.map((edge) => {
              const fromNode = nodes.find(n => n.id === edge.from)
              const toNode = nodes.find(n => n.id === edge.to)
              if (!fromNode || !toNode) return null

              const pathString = getOrthogonalPath(fromNode, toNode)
              const isSelected = selectedEdgeId === edge.id
              const { startX, startY, endX, endY } = getConnectionPoints(fromNode, toNode)

              return (
                <g key={edge.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedEdgeId(edge.id); setSelectedNodeId(null); }}>
                  <path
                    d={pathString}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                  />
                  <path
                    d={pathString}
                    fill="none"
                    stroke={isSelected ? '#e11d48' : (edge.color || '#2563eb')}
                    strokeWidth={isSelected ? '4' : '2.5'}
                  />
                  {edge.label && (
                    <text
                      x={(startX + endX) / 2}
                      y={(startY + endY) / 2 - 10}
                      fill={edge.color || '#2563eb'}
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="bg-white px-2"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Rendering Nodi */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id
            const isConnecting = connectingFromId === node.id

            return (
              <div
                key={node.id}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                }}
                className={`absolute cursor-move flex items-center justify-center transition-shadow ${isSelected ? 'ring-2 ring-primary ring-offset-2 z-10' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); setSelectedEdgeId(null); }}
              >
                {node.type === 'start' && (
                  <div className="w-full h-full px-4 rounded-full bg-amber-100 border-2 border-amber-600 text-amber-900 font-bold text-xs text-center shadow-md flex items-center justify-center">
                    {node.text}
                  </div>
                )}

                {node.type === 'process' && (
                  <div className="w-full h-full px-4 bg-blue-100 border-2 border-blue-600 text-blue-900 font-semibold text-xs text-center shadow-md rounded-lg flex items-center justify-center">
                    {node.text}
                  </div>
                )}

                {node.type === 'decision' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-full h-full bg-rose-100 border-2 border-rose-600 text-rose-900 font-bold text-xs flex items-center justify-center shadow-md rotate-45">
                      <span className="-rotate-45 p-2 z-10 text-center block">{node.text}</span>
                    </div>
                  </div>
                )}

                {node.type === 'document' && (
                  <div className="w-full h-full px-4 bg-slate-100 border-2 border-slate-600 border-dashed text-slate-900 font-medium text-xs text-center shadow-md rounded-sm flex items-center justify-center">
                    📄 {node.text}
                  </div>
                )}

                {isSelected && (
                  <div className="no-print">
                    <div onMouseDown={(e) => handleResizeMouseDown(e, node.id, 'tl')} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nwse-resize z-30" />
                    <div onMouseDown={(e) => handleResizeMouseDown(e, node.id, 'tr')} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nesw-resize z-30" />
                    <div onMouseDown={(e) => handleResizeMouseDown(e, node.id, 'bl')} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nesw-resize z-30" />
                    <div onMouseDown={(e) => handleResizeMouseDown(e, node.id, 'br')} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nwse-resize z-30" />
                    <div onMouseDown={(e) => handleResizeMouseDown(e, node.id, 'r')} className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-ew-resize z-30" />
                    <div onMouseDown={(e) => handleResizeMouseDown(e, node.id, 'b')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-ns-resize z-30" />
                  </div>
                )}

                <button
                  type="button"
                  title="Clicca per collegare"
                  onClick={(e) => handleNodeClickForConnect(e, node.id)}
                  className={`no-print absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-sm cursor-pointer z-30 transition-transform hover:scale-125 ${isConnecting ? 'bg-green-500 animate-ping' : 'bg-primary'}`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
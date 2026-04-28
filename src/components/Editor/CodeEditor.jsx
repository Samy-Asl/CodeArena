import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightSpecialChars,
} from '@codemirror/view'
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  indentOnInput,
  foldGutter,
} from '@codemirror/language'
import {
  closeBrackets,
  closeBracketsKeymap,
  autocompletion,
  completionKeymap,
} from '@codemirror/autocomplete'
import { useEffect, useRef } from 'react'

const THEME = EditorView.theme({
  '&': { background: '#060a13', height: '100%', minHeight: '300px' },
  '.cm-content': { padding: '16px 0', fontFamily: "Consolas, Monaco, 'Courier New', monospace", fontSize: '0.9rem', lineHeight: '1.75' },
  '.cm-gutters': { background: '#060a13', borderRight: '1px solid #1F2937', color: '#374151' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 8px', minWidth: '32px', color: '#374151' },
  '.cm-cursor': { borderLeftColor: '#7C3AED' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { background: 'rgba(124,58,237,0.2) !important' },
  '.cm-activeLine': { background: 'rgba(124,58,237,0.05)' },
  '.cm-activeLineGutter': { background: 'rgba(124,58,237,0.08)', color: '#9CA3AF' },
  '.cm-matchingBracket': { background: 'rgba(34,211,238,0.2)', outline: '1px solid rgba(34,211,238,0.4)' },
  '.cm-scroller': { overflow: 'auto' },
  '&.cm-focused': { outline: 'none' },
}, { dark: true })

function makeExtensions(lang, readOnly) {
  const base = [
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    keymap.of([
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap,
    ]),
    oneDark,
    THEME,
    lang === 'Python' ? python() : javascript(),
  ]
  if (readOnly) base.push(EditorView.editable.of(false))
  return base
}

export default function CodeEditor({ language = 'JavaScript', value, onChange, readOnly = false }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const isUpdating = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return
    const extensions = [
      ...makeExtensions(language, readOnly),
      ...(!readOnly ? [EditorView.updateListener.of(update => {
        if (update.docChanged && !isUpdating.current) {
          onChange?.(update.state.doc.toString())
        }
      })] : []),
    ]
    const state = EditorState.create({ doc: value || '', extensions })
    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view
    return () => view.destroy()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readOnly])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const cur = view.state.doc.toString()
    if (cur !== value && value !== undefined) {
      isUpdating.current = true
      view.dispatch({ changes: { from: 0, to: cur.length, insert: value || '' } })
      isUpdating.current = false
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflow: 'hidden', background: '#060a13', minHeight: 0, display:'flex', flexDirection:'column' }}
    />
  )
}

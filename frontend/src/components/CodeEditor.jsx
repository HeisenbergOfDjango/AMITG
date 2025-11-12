import { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { Box, Paper, Typography } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'

function CodeEditor({ code, setCode }) {
  const editorRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      // Define editor options
      // Define custom theme for Monaco editor
      monaco.editor.defineTheme('amitgTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955' },
          { token: 'keyword', foreground: 'FF6B6B' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'function', foreground: 'FF8A65' },
          { token: 'variable', foreground: 'DCDCAA' }
        ],
        colors: {
          'editor.background': '#1a1a1a',
          'editor.foreground': '#d4d4d4',
          'editorCursor.foreground': '#f44336',
          'editor.lineHighlightBackground': '#2a2a2a',
          'editorLineNumber.foreground': '#707070',
          'editor.selectionBackground': '#5e5e5e',
          'editor.selectionHighlightBackground': '#333333',
          'editorSuggestWidget.background': '#252525',
          'editorSuggestWidget.border': '#454545',
          'editorSuggestWidget.selectedBackground': '#f44336',
        }
      });

      const editorOptions = {
        value: code,
        language: 'javascript', // Default language
        theme: 'amitgTheme',
        minimap: { enabled: true },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        tabSize: 2,
        fontSize: 14,
        wordWrap: 'on',
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: true,
          verticalHasArrows: true,
          horizontalHasArrows: true
        },
        renderLineHighlight: 'all',
        fontLigatures: true,
        fontFamily: 'Consolas, "Courier New", monospace',
        contextmenu: true,
        rulers: [],
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        roundedSelection: true,
        formatOnPaste: true,
        formatOnType: true,
      };

      // Create editor
      editorRef.current = monaco.editor.create(containerRef.current, editorOptions);

      // Set up language detection
      const detectLanguage = (code) => {
        if (code.includes('def ') || code.includes('import ') || code.startsWith('from ')) {
          return 'python';
        } else if (code.includes('function ') || code.includes('const ') || code.includes('let ') || code.includes('var ')) {
          return 'javascript';
        }
        return 'javascript'; // Default
      };

      // Update model when code changes
      editorRef.current.onDidChangeModelContent(() => {
        const newCode = editorRef.current.getValue();
        setCode(newCode);
        
        // Auto-detect language
        const detectedLang = detectLanguage(newCode);
        const currentModel = editorRef.current.getModel();
        monaco.editor.setModelLanguage(currentModel, detectedLang);
      });

      // Handle window resize
      const handleResize = () => {
        editorRef.current?.layout();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        editorRef.current?.dispose();
      };
    }
  }, [])

  return (
    <Box sx={{ 
      borderRadius: 1, 
      overflow: 'hidden',
      border: '1px solid #e0e0e0',
    }}>
      <Box 
        ref={containerRef}
        sx={{ 
          height: '450px', 
          width: '100%',
          border: 'none'
        }}
      />
      <Box 
        sx={{ 
          bgcolor: '#000000', 
          color: '#f44336', 
          p: 0.75, 
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #333333'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CodeIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption">Auto-detecting language...</Typography>
        </Box>
        <Typography variant="caption">Press Ctrl+Space for suggestions</Typography>
      </Box>
    </Box>
  )
}

export default CodeEditor

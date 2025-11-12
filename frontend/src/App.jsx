import { useState } from 'react'
import CodeEditor from './components/CodeEditor'
import ResultsDisplay from './components/ResultsDisplay'
import axios from 'axios'
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  Paper, 
  Toolbar, 
  Typography, 
  Alert,
  CircularProgress,
  Stack,
  styled
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CodeIcon from '@mui/icons-material/Code'

// Create a theme with red and black color scheme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f44336', // Red
      light: '#ff7961',
      dark: '#ba000d',
    },
    secondary: {
      main: '#212121', // Dark grey/black
      light: '#484848',
      dark: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    error: {
      main: '#ff1744',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#f44336',
          '&:hover': {
            backgroundColor: '#d32f2f',
          },
        },
        outlined: {
          borderColor: '#f44336',
          color: '#f44336',
          '&:hover': {
            borderColor: '#d32f2f',
            backgroundColor: 'rgba(244, 67, 54, 0.04)',
          },
        },
      },
    },
  },
})

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

function App() {
  const [code, setCode] = useState('')
  const [provider, setProvider] = useState('gemini')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)

  // Get API URL from environment variable, fallback to localhost for development
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter code to analyze')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        code
      })
      setResults(response.data.review)
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.py') && !selectedFile.name.endsWith('.js')) {
      setError('Only .py and .js files are supported')
      return
    }

    setFile(selectedFile)

    // Read file contents
    const reader = new FileReader()
    reader.onload = (e) => {
      setCode(e.target.result)
    }
    reader.readAsText(selectedFile)
  }

  const handleFileAnalyze = async () => {
    if (!file) {
      setError('Please upload a file first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_URL}/upload-analyze`, formData)
      setResults(response.data.review)
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppBar position="static" elevation={4}>
          <Toolbar>
            <CodeIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AMITG
            </Typography>
            <Typography variant="subtitle2" color="inherit">
              AI-powered Machine for Intelligent Testing & Guidance
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, mb: 4, borderRadius: 2 }}
          >
            <Typography variant="h6" gutterBottom>
              Paste your code or upload a file
            </Typography>
            
            <Box sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
              <CodeEditor code={code} setCode={setCode} />
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >
                Upload File (.py, .js)
                <VisuallyHiddenInput 
                  type="file" 
                  accept=".py,.js"
                  onChange={handleFileUpload}
                />
              </Button>

              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Analyzing...
                  </>
                ) : 'Analyze Code'}
              </Button>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>

          {results && <ResultsDisplay results={results} />}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App

import { useEffect, useState } from 'react'
import { 
  Box, 
  Paper, 
  Typography, 
  Divider,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Icon
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import ScienceIcon from '@mui/icons-material/Science'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CommentIcon from '@mui/icons-material/Comment'

// Styled Markdown component
const MarkdownContent = ({ children }) => {
  return (
    <Box sx={{ 
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        color: '#f44336',
        fontWeight: 'bold',
        mt: 2,
        mb: 1
      },
      '& h3': {
        fontSize: '1.2rem',
        borderBottom: '1px solid rgba(244, 67, 54, 0.2)',
        pb: 0.5
      },
      '& p': {
        mb: 1.5
      },
      '& a': {
        color: '#ff7961',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& blockquote': {
        borderLeft: '4px solid #f44336',
        pl: 2,
        py: 0.5,
        my: 1,
        bgcolor: 'rgba(244, 67, 54, 0.05)',
        '& p': {
          m: 0
        }
      },
      '& code': {
        bgcolor: 'rgba(0, 0, 0, 0.2)',
        p: 0.5,
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '0.9em'
      },
      '& pre': {
        bgcolor: '#1a1a1a',
        p: 1.5,
        borderRadius: 1,
        overflowX: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '& code': {
          bgcolor: 'transparent',
          p: 0
        }
      },
      '& table': {
        borderCollapse: 'collapse',
        width: '100%',
        mb: 2,
        '& th': {
          bgcolor: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 1,
          textAlign: 'left'
        },
        '& td': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 1
        }
      },
      '& ul, & ol': {
        pl: 3,
        mb: 1.5
      },
      '& li': {
        mb: 0.5
      }
    }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </Box>
  );
};

function ResultsDisplay({ results }) {
  const [sections, setSections] = useState({
    summary: '',
    edgeCases: '',
    testCases: '',
    feedback: '',
    comments: ''
  })

  useEffect(() => {
    if (!results) return

    // Try to parse the results into sections
    const summaryMatch = results.match(/(?:summary|what this code does)[\s\S]*?(?=edge cases|$)/i)
    const edgeCasesMatch = results.match(/edge cases[\s\S]*?(?=suggested test|test cases|$)/i)
    const testCasesMatch = results.match(/(?:suggested test|test cases)[\s\S]*?(?=feedback|code quality|$)/i)
    const feedbackMatch = results.match(/(?:feedback|code quality)[\s\S]*?(?=reviewer comments|line-by-line|$)/i)
    const commentsMatch = results.match(/(?:reviewer comments|line-by-line)[\s\S]*$/i)

    setSections({
      summary: summaryMatch ? summaryMatch[0].trim() : '',
      edgeCases: edgeCasesMatch ? edgeCasesMatch[0].trim() : '',
      testCases: testCasesMatch ? testCasesMatch[0].trim() : '',
      feedback: feedbackMatch ? feedbackMatch[0].trim() : '',
      comments: commentsMatch ? commentsMatch[0].trim() : ''
    })
  }, [results])

  if (!results) return null

  return (
    <Paper elevation={3} sx={{ 
      p: 3, 
      mb: 4, 
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      bgcolor: 'background.paper' 
    }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ 
        pb: 2, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'primary.main',
        fontWeight: 'medium'
      }}>
        Analysis Results
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {sections.summary && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ 
              borderLeft: 5, 
              borderColor: 'primary.main',
              bgcolor: 'rgba(244, 67, 54, 0.05)',
            }}>
              <CardHeader
                avatar={<CheckCircleIcon color="primary" />}
                title="Code Summary"
                titleTypographyProps={{ color: 'primary.main', fontWeight: 'medium' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <MarkdownContent>
                    {sections.summary.replace(/summary|what this code does/i, '').trim()}
                  </MarkdownContent>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {sections.edgeCases && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ 
              borderLeft: 5, 
              borderColor: 'warning.main',
              bgcolor: 'rgba(255, 152, 0, 0.05)',
            }}>
              <CardHeader
                avatar={<WarningIcon color="warning" />}
                title="Edge Cases"
                titleTypographyProps={{ color: 'warning.main', fontWeight: 'medium' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <MarkdownContent>
                    {sections.edgeCases.replace(/edge cases/i, '').trim()}
                  </MarkdownContent>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {sections.testCases && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ 
              borderLeft: 5, 
              borderColor: 'success.main',
              bgcolor: 'rgba(76, 175, 80, 0.05)',
            }}>
              <CardHeader
                avatar={<ScienceIcon color="success" />}
                title="Suggested Test Cases"
                titleTypographyProps={{ color: 'success.main', fontWeight: 'medium' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <MarkdownContent>
                    {sections.testCases.replace(/suggested test cases|test cases/i, '').trim()}
                  </MarkdownContent>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {sections.feedback && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ 
              borderLeft: 5, 
              borderColor: 'secondary.main',
              bgcolor: 'rgba(33, 33, 33, 0.2)',
            }}>
              <CardHeader
                avatar={<AssessmentIcon color="secondary" />}
                title="Code Quality Feedback"
                titleTypographyProps={{ color: 'grey.300', fontWeight: 'medium' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <MarkdownContent>
                    {sections.feedback.replace(/feedback|code quality/i, '').trim()}
                  </MarkdownContent>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {sections.comments && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ 
              borderLeft: 5, 
              borderColor: 'info.main',
              bgcolor: 'rgba(33, 150, 243, 0.05)',
            }}>
              <CardHeader
                avatar={<CommentIcon color="info" />}
                title="Reviewer Comments"
                titleTypographyProps={{ color: 'info.main', fontWeight: 'medium' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <MarkdownContent>
                    {sections.comments.replace(/reviewer comments|line-by-line/i, '').trim()}
                  </MarkdownContent>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

export default ResultsDisplay

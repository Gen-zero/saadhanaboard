import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker with fallback
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
}

const PDFViewer = ({ fileUrl, fileName }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully with pages:', numPages);
    setNumPages(numPages);
    setIsLoading(false);
    setError('');
    toast({
      title: "PDF loaded successfully",
      description: `${fileName} - ${numPages} pages`,
    });
  }, [fileName, toast]);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF loading error:', error);
    setIsLoading(false);
    setError(error.message || 'Failed to load PDF');
    toast({
      title: "Failed to load PDF",
      description: "The PDF file could not be loaded. Please try again.",
      variant: "destructive",
    });
  }, [toast]);

  function goToPrevPage() {
    setPageNumber(prev => Math.max(1, prev - 1));
  }

  function goToNextPage() {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  }

  function zoomIn() {
    setScale(prev => Math.min(3.0, prev + 0.25));
  }

  function zoomOut() {
    setScale(prev => Math.max(0.25, prev - 0.25));
  }

  function resetZoom() {
    setScale(1.0);
  }

  function rotate() {
    setRotation(prev => (prev + 90) % 360);
  }

  function downloadPDF() {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchText.trim()) {
      toast({
        title: "Search functionality",
        description: "Advanced text search will be implemented in future updates.",
      });
    }
  }

  function handlePageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const page = parseInt(e.target.value);
    if (!isNaN(page)) {
      goToPage(page);
    }
  }

  // Create a cross-origin proxy URL for better PDF loading
  const proxyUrl = fileUrl.startsWith('http') ? fileUrl : `${window.location.origin}${fileUrl}`;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOutline(!showOutline)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 text-sm">
              <Input
                type="number"
                value={pageNumber}
                onChange={handlePageInputChange}
                className="w-16 h-8 text-center"
                min={1}
                max={numPages}
              />
              <span className="text-gray-600 dark:text-gray-400">
                / {numPages || 0}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-1">
            <Input
              type="text"
              placeholder="Search in PDF..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-40 h-8"
            />
            <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-3 w-3" />
            </Button>
          </form>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.25}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={resetZoom}
              className="text-sm px-2 h-8 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {Math.round(scale * 100)}%
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={rotate}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={downloadPDF}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Outline sidebar */}
        {showOutline && (
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-4">Pages</h3>
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-full text-left p-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      page === pageNumber ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                    }`}
                  >
                    Page {page}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* PDF viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
          <div className="flex justify-center p-4">
            {error ? (
              <div className="flex items-center justify-center h-96 text-red-500 flex-col">
                <span className="text-lg mb-2">Failed to load PDF</span>
                <span className="text-sm">{error}</span>
                <Button 
                  onClick={() => {
                    setError('');
                    setIsLoading(true);
                  }}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="ml-2">Loading PDF...</span>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-96 text-red-500">
                    <span>Failed to load PDF document</span>
                  </div>
                }
                options={{
                  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                  cMapPacked: true,
                  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
                }}
              >
                {!isLoading && numPages > 0 && (
                  <div className="shadow-lg">
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      loading={
                        <div className="flex items-center justify-center h-96 bg-white">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        </div>
                      }
                      error={
                        <div className="flex items-center justify-center h-96 bg-white text-red-500">
                          <span>Failed to load page</span>
                        </div>
                      }
                    />
                  </div>
                )}
              </Document>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;

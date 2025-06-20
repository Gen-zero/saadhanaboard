
import { useState, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker with reliable CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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

  // Memoize PDF options to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    verbosity: 0,
  }), []);

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

  const handleRetry = useCallback(() => {
    setError('');
    setIsLoading(true);
    setPageNumber(1);
    setNumPages(0);
  }, []);

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-card border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOutline(!showOutline)}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 text-sm">
              <Input
                type="number"
                value={pageNumber}
                onChange={handlePageInputChange}
                className="w-16 h-8 text-center bg-input border-border"
                min={1}
                max={numPages}
              />
              <span className="text-muted-foreground">
                / {numPages || 0}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
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
              className="w-40 h-8 bg-input border-border"
            />
            <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
              <Search className="h-3 w-3" />
            </Button>
          </form>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.25}
              className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={resetZoom}
              className="text-sm px-2 h-8 hover:bg-accent hover:text-accent-foreground min-w-[60px]"
            >
              {Math.round(scale * 100)}%
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={rotate}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={downloadPDF}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Outline sidebar */}
        {showOutline && (
          <div className="w-64 bg-card border-r border-border p-4">
            <h3 className="font-semibold mb-4 text-foreground">Pages</h3>
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      page === pageNumber 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground text-foreground'
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
        <div className="flex-1 overflow-auto bg-muted">
          <div className="flex justify-center p-4">
            {error ? (
              <div className="flex items-center justify-center h-96 text-destructive flex-col">
                <span className="text-lg mb-2">Failed to load PDF</span>
                <span className="text-sm text-muted-foreground">{error}</span>
                <Button 
                  onClick={handleRetry}
                  className="mt-4"
                  variant="outline"
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-foreground">Loading PDF...</span>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-96 text-destructive">
                    <span>Failed to load PDF document</span>
                  </div>
                }
                options={pdfOptions}
              >
                {!isLoading && !error && numPages > 0 && (
                  <div className="shadow-lg border border-border rounded-lg overflow-hidden">
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      loading={
                        <div className="flex items-center justify-center h-96 bg-card">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      }
                      error={
                        <div className="flex items-center justify-center h-96 bg-card text-destructive">
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

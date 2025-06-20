
import { SpiritualBook } from '@/types/books';
import PDFViewer from './PDFViewer';
import TextViewer from './TextViewer';

interface UnifiedViewerProps {
  book: SpiritualBook;
}

const UnifiedViewer = ({ book }: UnifiedViewerProps) => {
  const isPDF = book.is_storage_file || book.storage_url?.toLowerCase().includes('.pdf');
  
  if (isPDF && book.storage_url) {
    return (
      <PDFViewer 
        fileUrl={book.storage_url} 
        fileName={book.title}
      />
    );
  }
  
  return <TextViewer book={book} />;
};

export default UnifiedViewer;

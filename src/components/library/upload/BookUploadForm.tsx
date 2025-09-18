import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import BookFormFields from './BookFormFields';

// Define FormData interface locally to avoid conflicts
interface BookFormData {
  title: string;
  author: string;
  traditions: string[];
  content: string;
  description?: string;
  year?: string;
  language: string;
}

interface BookUploadFormProps {
  onClose: () => void;
  onBookUploaded?: () => void;
}

const BookUploadForm = ({ onClose, onBookUploaded }: BookUploadFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    traditions: [],
    content: '',
    description: '',
    year: '',
    language: 'english',
  });
  const [newTradition, setNewTradition] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormFieldsChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | undefined) => {
    setUploadedFile(file);
  };

  const handleTraditionAdd = () => {
    if (newTradition.trim() && !formData.traditions.includes(newTradition.trim())) {
      setFormData(prev => ({
        ...prev,
        traditions: [...prev.traditions, newTradition.trim()]
      }));
      setNewTradition('');
    }
  };

  const handleTraditionRemove = (tradition: string) => {
    setFormData(prev => ({
      ...prev,
      traditions: prev.traditions.filter(t => t !== tradition)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and author fields.",
        variant: "destructive",
      });
      return;
    }

    // For PDF uploads, either file or content must be provided
    if (!uploadedFile && !formData.content) {
      toast({
        title: "Missing content",
        description: "Please upload a file or enter book content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare book data
      const bookData = {
        title: formData.title,
        author: formData.author,
        traditions: formData.traditions,
        content: formData.content,
        description: formData.description || null,
        year: formData.year ? parseInt(formData.year) : null,
        language: formData.language,
        page_count: formData.content ? formData.content.split('---PAGE---').length : null,
      };

      // Upload book with file if provided, otherwise regular upload
      await api.createBook(bookData, uploadedFile);

      toast({
        title: "Book uploaded",
        description: "Your spiritual book has been successfully uploaded.",
      });

      // Call the onBookUploaded callback if provided
      if (onBookUploaded) {
        onBookUploaded();
      }

      // Reset form
      setFormData({
        title: '',
        author: '',
        traditions: [],
        content: '',
        description: '',
        year: '',
        language: 'english',
      });
      setUploadedFile(undefined);
      
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Upload Spiritual Book</CardTitle>
        <CardDescription>Share your spiritual wisdom with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BookFormFields 
            formData={{
              title: formData.title,
              author: formData.author,
              content: formData.content,
              description: formData.description || '',
              year: formData.year || '',
              language: formData.language
            }} 
            onInputChange={handleFormFieldsChange} 
            onFileChange={handleFileChange}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Traditions</label>
            <div className="flex gap-2">
              <input
                value={newTradition}
                onChange={(e) => setNewTradition(e.target.value)}
                placeholder="Add tradition"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTraditionAdd())}
              />
              <Button type="button" onClick={handleTraditionAdd} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.traditions.map((tradition) => (
                <div key={tradition} className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm">
                  {tradition}
                  <button
                    type="button"
                    onClick={() => handleTraditionRemove(tradition)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <span className="h-4 w-4">✕</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookUploadForm;
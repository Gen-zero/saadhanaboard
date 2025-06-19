
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookFormFields } from "./BookFormFields";
import { TraditionManager } from "./TraditionManager";

interface BookUploadFormProps {
  onBookUploaded?: () => void;
  onClose: () => void;
}

interface FormData {
  title: string;
  author: string;
  traditions: string[];
  content: string;
  description: string;
  year: string;
  language: string;
}

const BookUploadForm = ({ onBookUploaded, onClose }: BookUploadFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    traditions: [],
    content: "",
    description: "",
    year: "",
    language: "english",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTraditionsChange = (traditions: string[]) => {
    setFormData(prev => ({ ...prev, traditions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in title, author, and content fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload books.",
          variant: "destructive",
        });
        return;
      }

      const bookData = {
        user_id: user.id,
        title: formData.title,
        author: formData.author,
        traditions: formData.traditions,
        content: formData.content,
        description: formData.description || null,
        year: formData.year ? parseInt(formData.year) : null,
        language: formData.language,
        page_count: formData.content.split('---PAGE---').length,
      };

      const { error } = await supabase
        .from('spiritual_books')
        .insert([bookData]);

      if (error) throw error;

      toast({
        title: "Book uploaded successfully",
        description: `"${formData.title}" has been added to the spiritual library.`,
      });

      // Reset form
      setFormData({
        title: "",
        author: "",
        traditions: [],
        content: "",
        description: "",
        year: "",
        language: "english",
      });
      
      onClose();
      onBookUploaded?.();
      
    } catch (error) {
      console.error('Error uploading book:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BookFormFields 
        formData={formData}
        onInputChange={handleInputChange}
      />
      
      <TraditionManager
        traditions={formData.traditions}
        onTraditionsChange={handleTraditionsChange}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="btn-cosmic">
          {loading ? "Uploading..." : "Upload Book"}
        </Button>
      </div>
    </form>
  );
};

export default BookUploadForm;

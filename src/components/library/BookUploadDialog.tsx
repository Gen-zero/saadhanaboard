
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BookUploadDialogProps {
  onBookUploaded?: () => void;
}

const BookUploadDialog = ({ onBookUploaded }: BookUploadDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [traditionInput, setTraditionInput] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    traditions: [] as string[],
    content: "",
    description: "",
    year: "",
    language: "english",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTradition = () => {
    if (traditionInput.trim() && !formData.traditions.includes(traditionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        traditions: [...prev.traditions, traditionInput.trim()]
      }));
      setTraditionInput("");
    }
  };

  const removeTradition = (tradition: string) => {
    setFormData(prev => ({
      ...prev,
      traditions: prev.traditions.filter(t => t !== tradition)
    }));
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
      
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="btn-cosmic">
          <Upload className="mr-2 h-4 w-4" />
          Upload Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Spiritual Book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Spiritual Traditions</Label>
            <div className="flex gap-2">
              <Input
                value={traditionInput}
                onChange={(e) => setTraditionInput(e.target.value)}
                placeholder="Add tradition (e.g., Buddhism, Hinduism)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTradition())}
              />
              <Button type="button" onClick={addTradition} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.traditions.map((tradition) => (
                <Badge key={tradition} variant="outline" className="bg-purple-500/10">
                  {tradition}
                  <button
                    type="button"
                    onClick={() => removeTradition(tradition)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year Published</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="e.g., 1950"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                placeholder="e.g., English, Sanskrit"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the book's content and significance"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Book Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Paste the complete text here. Use '---PAGE---' to separate pages/chapters."
              rows={10}
              className="min-h-[200px] font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Tip: Use "---PAGE---" to create page breaks in the book viewer.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="btn-cosmic">
              {loading ? "Uploading..." : "Upload Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookUploadDialog;

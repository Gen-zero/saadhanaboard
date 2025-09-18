import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, BookOpen } from "lucide-react";
import BookRequestForm from "@/components/library/upload/BookRequestForm";

interface BookRequestDialogProps {
  onBookRequested?: () => void;
}

const BookRequestDialog = ({ onBookRequested }: BookRequestDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
          Request Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Request a Sacred Text
          </DialogTitle>
        </DialogHeader>
        
        <BookRequestForm 
          onBookRequested={onBookRequested}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookRequestDialog;
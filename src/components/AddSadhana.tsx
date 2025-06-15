
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Sadhana } from '@/types/sadhana';
import SadhanaForm from './SadhanaForm';

interface AddSadhanaProps {
  onAddSadhana: (newSadhana: Omit<Sadhana, 'id' | 'reflection'>) => boolean;
  triggerButton?: React.ReactNode;
}

const AddSadhana = ({ onAddSadhana, triggerButton }: AddSadhanaProps) => {
  const [open, setOpen] = useState(false);
  const [newSadhana, setNewSadhana] = useState<Omit<Sadhana, 'id' | 'reflection'>>({
    title: '',
    description: '',
    completed: false,
    category: 'daily',
    dueDate: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'medium',
    tags: []
  });

  const handleAdd = () => {
    if (onAddSadhana(newSadhana)) {
      setNewSadhana({
        title: '',
        description: '',
        completed: false,
        category: 'daily',
        dueDate: new Date().toISOString().split('T')[0],
        time: '09:00',
        priority: 'medium',
        tags: []
      });
      setOpen(false);
    }
  };
  
  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Sadhana
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Sadhana</DialogTitle>
          <DialogDescription>
            Create a new sadhana for your spiritual practice or goal.
          </DialogDescription>
        </DialogHeader>
        <SadhanaForm sadhana={newSadhana} setSadhana={setNewSadhana} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add Sadhana</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSadhana;

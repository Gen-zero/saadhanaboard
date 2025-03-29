
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Subject {
  id: string;
  name: string;
}

interface SubjectTabsProps {
  subjects: Subject[];
  currentSubject: string;
  onChange: (subject: string) => void;
}

const SubjectTabs = ({ subjects, currentSubject, onChange }: SubjectTabsProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <Tabs 
        defaultValue={currentSubject} 
        onValueChange={onChange}
        className="w-full"
      >
        <TabsList className="mb-4 overflow-x-auto flex flex-nowrap p-1 w-full">
          {subjects.map((subject) => (
            <TabsTrigger 
              key={subject.id}
              value={subject.id}
              className="whitespace-nowrap"
            >
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SubjectTabs;

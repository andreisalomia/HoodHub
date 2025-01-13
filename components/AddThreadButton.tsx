'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addEventAction, addThreadAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

interface AddThreadButtonProps {
  onAddThread: (newThread: any) => void;
  communityId: number;
}

export default function AddThreadButton({ onAddThread, communityId }: AddThreadButtonProps) {
  const supabase = createClient();
  
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    community_uuid: communityId,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newThread = {
      title: formData.title,
      content: formData.content,
      community_uuid: communityId,
    };

    try {
      const formDataToSend = new FormData();
      Object.entries(newThread).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      console.log("calling addThreadAction", formDataToSend, communityId);
      await addThreadAction(formDataToSend, communityId);
      
      onAddThread(newThread);
    } catch (error) {
      console.error("Error adding thread:", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Dialog Trigger */}
      <DialogTrigger asChild>
      <Button
          variant="outline"
          size="sm"
          className="text-[#0264FA] border-[#0264FA] hover:bg-[#0264FA] hover:text-white transition"
        >
          Start a New Thread
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#F3F6FF] border border-[#EAEDED]">
        <DialogHeader>
          <DialogTitle className="text-[#0264FA] font-bold">Start a New Thread</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-[#0264FA]">Title</Label>
            <Input
              id="title"
              className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-[#0264FA]">Content</Label>
            <Textarea
              id="content"
              className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <Button type="submit" className="bg-[#0264FA] text-white hover:bg-[#0254E4] transition">
            Create Thread
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
"use client"

import React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { EditForm } from "@/components/edit-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SquarePen } from 'lucide-react';

interface PaperDialogProps {
  paper: any;
  children: React.ReactNode;
  listView: boolean;
}

export function PaperDialog({ paper, children, listView}: PaperDialogProps) {
  const [user, setUser] = useState<boolean | null>(null);
  const[isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const supabase = createClient();
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) {
          setUser(!!data.user);
        }
      } catch (error) {
        if (mounted) {
          setUser(false);
        }
      }
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          if (event === "SIGNED_IN") {
            setUser(true);
          } else if (event === "SIGNED_OUT") {
            setUser(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, [supabase]);
  return (
    
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-1/2 h-9/10 sm:h-4/5" onOpenAutoFocus={(event)=>{event.preventDefault()}}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <DialogTitle>{paper.title || "Untitled"}</DialogTitle>
            <DialogDescription className="mt-3">{paper.authors || "Unknown authors"}</DialogDescription>
          </div>
          {user && <Button variant="outline" className="text-bold flex-shrink-0 mr-8" onClick={() => {setIsOpen(false); setIsEditOpen(true);}}><SquarePen/></Button>}
        </div>
        <div className="overflow-y-scroll p-5">
          <FieldSet>
            <FieldGroup>
              {listView && (<Field>
                <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                <p className="text-sm text-foreground">{paper.metaDescription}</p>
              </Field>) }
              <Field>
                <FieldLabel htmlFor="keyFindings">Key Findings</FieldLabel>
                <p className="text-sm text-foreground">{paper.keyFindings}</p>
              </Field>
              <Field>
                <FieldLabel htmlFor="onePageSummary">One-Page Summary</FieldLabel>
                <p className="text-sm text-foreground whitespace-pre-wrap">{paper.onePageSummary}</p>
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Journal</h4>
                <p className="text-sm">{paper.journal || "None"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Organization</h4>
                <p className="text-sm">{paper.organization || "None"}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Primary Author</h4>
                <p className="text-sm">{paper.author1 || "None"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Secondary Author</h4>
                <p className="text-sm">{paper.author2 || "None"}</p>
              </div>
            </div>
          </div>
            {paper.link && (
              <div className="pt-2 border-t">
                <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  View Site →
                </a>
              </div>
            )}
            {paper.file && (
              <div className="pt-2">
                <a href={paper.file} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  View Source File →
                </a>
              </div>
            )}
          
        </div>
      </DialogContent>
      <EditForm key={paper.id} paper={paper} isOpen={isEditOpen} onOpenChange={setIsEditOpen}/>
    </Dialog>
    
    
  );
}

export default PaperDialog;

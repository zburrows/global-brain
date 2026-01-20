"use client"

import React from "react";
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

interface PaperDialogProps {
  paper: any;
  children: React.ReactNode;
  listView: boolean;
}

export function PaperDialog({ paper, children, listView}: PaperDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-1/2 h-4/5">
        <DialogHeader>
          <DialogTitle>{paper.title || "Untitled"}</DialogTitle>
          <DialogDescription>{paper.authors || "Unknown authors"}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-scroll p-5">
          <FieldSet>
            <FieldGroup>
              {listView? (<Field>
                <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                <p className="text-sm text-foreground">{paper.metaDescription}</p>
              </Field>): (<div></div>)}
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
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Year</h4>
                <p className="text-sm">{paper.year || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Journal</h4>
                <p className="text-sm">{paper.journal || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Organization</h4>
                <p className="text-sm">{paper.organization || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Category</h4>
                <p className="text-sm">{paper.solutions || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Primary Author</h4>
                <p className="text-sm">{paper.author1 || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Secondary Author</h4>
                <p className="text-sm">{paper.author2 || "Unknown"}</p>
              </div>
            </div>

            {paper.link && (
              <div className="pt-4 border-t">
                <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  View Source →
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaperDialog;

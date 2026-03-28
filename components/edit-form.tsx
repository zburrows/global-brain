"use client"

import { useState } from "react";
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Trash2, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CategoryState,
  UpdateCategoryState,
  InitCategoryState
} from "@/components/config/category-interface"
import {
  pillars,
  subpillars,
  solutions,
  subcategories
} from "@/components/config/taxonomy-config"
import { FormData } from "@/app/input/page"
const supabase = createClient()

interface EditDialogProps {
  paper: any;
  //children: React.ReactNode;
  onOpenChange: any;
  isOpen?: boolean;
}

export function EditForm({ paper, onOpenChange, isOpen = false}: EditDialogProps) {
  const paperId = paper.id
  const file = paper.file
  const initState: CategoryState = InitCategoryState(paper.pillar, paper.subpillar, paper.solution, paper.subcategory)
  const initPaper = paper
  const [categoryState, setCategoryState] = useState<CategoryState>(initState);
  const [pillar, setPillar] = useState("General");
  const [subpillar, setSubpillar] = useState("None");
  const [solution, setSolution] = useState("None");
  const [subcategory, setSubcategory] = useState("None");
  const [metaValue, setMetaValue] = useState(paper.metaDescription);
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [authorChange, setAuthorChange] = useState(false)
  if (isOpen) {
    console.log(paper)
  }
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting }, watch, clearErrors } = useForm<FormData>();
  const maxMetaLength = 155;
  const onSubmit = async (paper: FormData, del: boolean) => {
    if (del) {
      setIsDeleting(true)
      const { error } = await supabase.from('GlobalBrain').delete().eq('id', paperId)
      onOpenChange(false)
      if (error) {
        toast.error(`Error: ${error.message}`, { position: 'bottom-center'})
      }
      else {
        if (file) {
          console.log(`Removing ${paperId}`)
          const { error } = await supabase.storage.from('Documents').remove([`${file.split('Documents/')[1]}`])
          if (error) {
            toast.error('Error removing associated files', { position: 'bottom-center'})
          }
          else {
            toast.success('Entry successfully deleted from database', { position: 'bottom-center'})
          }
        }
        else {
          toast.success('Entry successfully deleted from database', { position: 'bottom-center'})
        }
      }
      setIsDeleting(false)
    }
    else { // updating records
      setIsSaving(true)
      paper.pillar = pillar // saving tags to state variables instead
      if (subpillar == "None") { paper.subpillar = null } else { paper.subpillar = subpillar };
      if (solution == "None") { paper.solution = null } else { paper.solution = solution };
      if (subcategory == "None") { paper.subcategory = null } else { paper.subcategory = subcategory };
      var tags = [];
      for (const tag of [pillar, subpillar, solution, subcategory]) {
        if (tag != "None") { tags.push(tag) };
      }
      paper.tags = tags
      if (authorChange) { // if authors field has been changed
        if (paper.author1 && initPaper.author1) { // updating author name
          const { data: author1_data } = await supabase.from('authors').select().eq('author', initPaper.author1).single()
          let tagsSet = new Set<string>(author1_data.tags)
          for (const tag of tags) {
            tagsSet.add(tag)
          }
          let tagsToAdd = [...tagsSet]
          let idSet = new Set<string>(author1_data.papers)
          idSet.add(paperId)
          let papersToAdd = [...idSet]
          const { error } = await supabase.from('authors').update({ author: paper.author1, papers: papersToAdd, tags: tagsToAdd }).eq('author', initPaper.author1)
          {error && toast.error(`Error: ${error.message}`, { position: 'bottom-center' })}
        }
        else if (paper.author1 && !initPaper.author1) { // adding author name
          const { error } = await supabase.from('authors').insert({ author: paper.author1, papers: [paperId], tags: tags })
          {error && toast.error(`Error: ${error.message}`, { position: 'bottom-center' })}
        }
        if (paper.author2 && initPaper.author2) { // updating author name
          const { data: author2_data } = await supabase.from('authors').select().eq('author', initPaper.author2).single()
          let tagsSet = new Set<string>(author2_data.tags)
          for (const tag of tags) {
            tagsSet.add(tag)
          }
          let tagsToAdd = [...tagsSet]
          let idSet = new Set<string>(author2_data.papers)
          idSet.add(paperId)
          let papersToAdd = [...idSet]
          const { error } = await supabase.from('authors').update({ author: paper.author2, papers: papersToAdd, tags: tagsToAdd }).eq('author', initPaper.author2)
          {error && toast.error(`Error: ${error.message}`, { position: 'bottom-center' })}
        }
        else if (paper.author2 && !initPaper.author2) { // adding author name
          const { error } = await supabase.from('authors').insert({ author: paper.author2, papers: [paperId], tags: tags })
          {error && toast.error(`Error: ${error.message}`, { position: 'bottom-center' })}
        }
      }
      const { error } = await supabase.from('GlobalBrain').update(paper).eq('id', paperId)
      onOpenChange(false)
      if (error) {
        toast.error(`Error: ${error.message}`, { position: 'bottom-center' })
      }
      else {
        toast.success('Entry successfully saved to database', { position: 'bottom-center'})
      }  
      setIsSaving(false)
    }
    reset()
  }
  return (
    
    <Dialog open={isOpen} onOpenChange={(change)=>{
      onOpenChange(change)
      if (change) {
        onOpenChange?.();
      }
      reset()
      setCategoryState(initState)
    }}>
      

      <DialogContent className="min-w-1/2 pb-3 px-5 h-9/10 sm:h-4/5" onInteractOutside={(event)=>{event.preventDefault()}} onEscapeKeyDown={(event)=>{event.preventDefault()}} onOpenAutoFocus={(event)=>{event.preventDefault()}}>
        <DialogHeader>
          <DialogTitle>
            Edit metadata
          </DialogTitle>
          <DialogDescription>
            Click submit to save changes, or discard to remove the entry from the database.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-scroll px-3 sm:px-5">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input {...register("title")} defaultValue={paper.title} className="text-sm text-foreground"/>
              </Field>
              <Field>
                <FieldLabel htmlFor="author">Citation</FieldLabel>
                <Input {...register("authors")} defaultValue={paper.authors} className="text-sm text-foreground"/>
              </Field>
              <Field>
                <div className="flex">
                <div className="w-1/2"><FieldLabel className="flex justify-start" htmlFor="metaDescription">Meta Description</FieldLabel></div>
                <div className="w-1/2"><div className={`flex justify-end text-xs ${metaValue.length > maxMetaLength ? "text-destructive" : 'text-muted-foreground'}`}>
                      {metaValue.length}/{maxMetaLength}
                    </div></div>
                </div>
                <Textarea {...register("metaDescription")}  defaultValue={paper.metaDescription} className="text-sm text-foreground" onChange={(e) => setMetaValue(e.target.value)}/>
              </Field>
              <Field>
                <FieldLabel htmlFor="keyFindings">Key Findings</FieldLabel>
                <Textarea {...register("keyFindings")}  defaultValue={paper.keyFindings} className="text-sm text-foreground"/>
              </Field>
              <Field>
                <FieldLabel htmlFor="onePageSummary">One-Page Summary</FieldLabel>
                <Textarea {...register("onePageSummary")}  defaultValue={paper.onePageSummary} className="text-sm text-foreground"/>
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Journal</h4>
                <Input {...register("journal")} className="text-sm text-foreground" defaultValue={paper.journal}/>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Organization</h4>
                <Input {...register("organization")} className="text-sm text-foreground" defaultValue={paper.organization}/>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Primary Author</h4>
                <Input {...register("author1")} className="text-sm text-foreground" defaultValue={paper.author1} onChange={(_e) => setAuthorChange(true)}/>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Secondary Author</h4>
                <Input {...register("author2")} className="text-sm text-foreground" defaultValue={paper.author2} onChange={(_e) => setAuthorChange(true)}/>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Link</h4>
                <Input {...register("link")} className="text-sm text-foreground" type="url" defaultValue={paper.link}/>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Year</h4>
                <Input {...register("year")} className="text-sm text-foreground" type="number" defaultValue={paper.year}/>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t pt-4 gap-4">
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Pillar</h4>
                <Select value={categoryState.selectedPillar} onValueChange={(value: string) => {
                  categoryState.selectedPillar = value;
                  const newState = UpdateCategoryState(categoryState, "pillar");
                  setCategoryState(newState);
                  setPillar(value);
                }}>
                  <SelectTrigger>
                    <SelectValue id="pillar"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryState.pillarOpts.map((pillar) => (
                        <SelectItem key={pillar} value={pillar}>
                          {pillar}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Subpillar</h4>
                <Select value={categoryState.selectedSubpillar} onValueChange={(value: string) => {
                  categoryState.selectedSubpillar = value;
                  const newState = UpdateCategoryState(categoryState, "subpillar");
                  setCategoryState(newState);
                  setSubpillar(value);
                }}>
                  <SelectTrigger>
                    <SelectValue id="subpillar"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryState.subpillarOpts.map((subpillar) => (
                        <SelectItem key={subpillar} value={subpillar}>
                          {subpillar}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Solution</h4>
            <Select value={categoryState.selectedSolution} onValueChange={(value: string) => {
              categoryState.selectedSolution = value;
              const newState = UpdateCategoryState(categoryState, "solution");
              setCategoryState(newState);
              setSolution(value);
            }}>
              <SelectTrigger>
                <SelectValue id="solution"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoryState.solutionOpts.map((solution) => (
                    <SelectItem key={solution} value={solution}>
                      {solution}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Subcategory</h4>
            <Select value={categoryState.selectedSubcategory} onValueChange={(value: string) => {
              categoryState.selectedSubcategory = value;
              const newState = UpdateCategoryState(categoryState, "subcategory");
              setCategoryState(newState);
              setSubcategory(value);
            }}>
              <SelectTrigger>
                <SelectValue id="subcategory"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoryState.subcategoryOpts.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2 sm:flex-1 sm:align-start">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto"><Trash2/></Button>
              </PopoverTrigger>
              <PopoverContent align="center" side="top" className="w-fit">
                <PopoverHeader>
                  <PopoverTitle className="flex justify-center">Are you sure?</PopoverTitle>
                  <PopoverDescription className="flex justify-center m-1">
                    <Button className="bg-destructive hover:bg-destructive-light" onClick={handleSubmit(formData => onSubmit(formData, true))} disabled={isDeleting}>
                      {isDeleting ? <div className="flex items-center"><Spinner/><div className="px-1">Deleting</div></div> : "Delete"}
                    </Button>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          
          </div>
          <div className="w-1/2 sm:justify-end sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={handleSubmit(formData => onSubmit(formData, false))} disabled={isSaving}>
            {isSaving ? <div className="flex items-center"><Spinner/><div className="px-1">Saving</div></div> : "Save"}
          </Button>
          </div>
        </div>
      </DialogContent> 
    </Dialog>
  );
}

export default EditForm;

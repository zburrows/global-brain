import { AuthorEntry } from "@/app/people/page"
import { useState } from "react"
import React from "react"
import { Spinner } from "./ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { createClient } from "@/utils/supabase/client";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { pillars, subpillars, solutions, subcategories } from "@/components/config/taxonomy-config"
const supabase = createClient()
subpillars.shift()
solutions.shift()
solutions.splice(solutions.indexOf('Biodiversity Loss'), 1)
subcategories.shift()
const allTags = [...pillars, ...subpillars, ...solutions, ...subcategories]
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
interface AuthorDialogProps {
  author: AuthorEntry;
  children: React.ReactNode;
}
export function AuthorDialog({author, children}: AuthorDialogProps) {
  const[isOpen, setIsOpen] = useState<boolean>(false);
  const[isDeleting, setIsDeleting] = useState<boolean>(false)
  const[deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const anchor = useComboboxAnchor()
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<AuthorEntry>();
  const onSubmit = async (data: AuthorEntry) => {
    const {error} = await supabase.from('authors').update({author: data.author, email: data.email, tags: data.tags}).eq('id', author.id)
    if (error) {
      toast.error(error.message, { position: 'bottom-center'})
    }
    else {
      toast.success(`Saved changes to ${author.author}`, { position: 'bottom-center'})
    }
    reset()
    setIsOpen(false)
  }
  const onDelete = async() => {
    setIsDeleting(true)
    const {error} = await supabase.from('authors').delete().eq('id', author.id)
    if (error) {
      toast.error(error.message, { position: 'bottom-center'})
    }
    else {
      toast.success(`Deleted ${author.author}`, { position: 'bottom-center'})
    }
    setDeleteOpen(false)
    setIsOpen(false)
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="" onOpenAutoFocus={(event)=>{event.preventDefault()}}>
        <DialogTitle>Edit author</DialogTitle>
        <FieldGroup>
          <FieldSet>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...register('author')} defaultValue={author.author}></Input>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...register('email')} type="email" defaultValue={author.email}></Input>
            </Field>
            <Field>
              <FieldLabel>Tags</FieldLabel>
              <Controller control={control} name='tags' render={({ field }) => (
                  <Combobox multiple autoHighlight items={allTags} value={field.value || author.tags} onValueChange={field.onChange}>
                    <ComboboxChips ref={anchor}>
                      <ComboboxValue>
                        {(values) => (
                          <React.Fragment>
                            {values.map((value: string) => (
                              <ComboboxChip key={value}>{value}</ComboboxChip>
                            ))}
                            <ComboboxChipsInput />
                          </React.Fragment>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={anchor}>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}/>
            </Field>
          </FieldSet>
        </FieldGroup>
              
            
                
              
                
        <DialogFooter>
          <Popover open={deleteOpen} onOpenChange={setDeleteOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Delete</Button>
              </PopoverTrigger>
              <PopoverContent align="center" side="top" className="w-fit">
                <PopoverHeader>
                  <PopoverTitle className="flex justify-center">Are you sure?</PopoverTitle>
                  <PopoverDescription className="flex justify-center m-1">
                    <Button className="bg-destructive hover:bg-destructive-light" onClick={onDelete} disabled={isDeleting}>
                      {isDeleting ? <div className="flex items-center"><Spinner/><div className="px-1">Deleting</div></div> : "Delete"}
                    </Button>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>{isSubmitting ? <div className="flex items-center"><Spinner/><div className="px-1">Saving</div></div> : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
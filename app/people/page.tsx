"use client";
import "../globals.css";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Search, List, LayoutGrid } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { columns, Author } from "./columns";
import { DataTable } from "./data-table";
import {
  pillars,
  subpillars,
  solutions,
  subcategories,
  solutionsData,
} from "@/components/config/taxonomy-config"
subpillars.shift();
solutions.shift();
subcategories.shift();
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PaperDialog from "@/components/paper-dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuthorEntry {
  id: string;
  author: string;
  email: string;
  papers: number[];
  tags: string[];
  [key: string]: any;
}

export default function Page() {
  const [authors, setAuthors] = useState<AuthorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const testLoading = true;
  const [error, setError] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorEntry | null>(null);
  const [listView, setListView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [cardPage, setCardPage] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [sortBy, setSortBy] = useState<"name" | "recent">("recent");  
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [selectedSubpillar, setSelectedSubpillar] = useState<string>("all");
  const [selectedSolution, setSelectedSolution] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [subpillarOptions, setSubpillarOptions] = useState(subpillars);
  const [solutionOptions, setSolutionOptions] = useState(solutions);
  const [subcategoryOptions, setSubcategoryOptions] = useState(subcategories);
  const setGeneralSelection = (selection: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (pillars.includes(selection)) {
      setSelectedPillar(selection);
    }
    else if (subpillars.includes(selection)) {
      setSelectedSubpillar(selection);
    }
    else if (solutions.includes(selection)) {
      setSelectedSolution(selection);
    }
    else if (subcategories.includes(selection)) {
      setSelectedSubcategory(selection);
    }
  };
  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error: supabaseError } = await supabase
        .from("authors")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setAuthors(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch papers");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort authors
  const filteredAndSortedAuthors = useMemo(() => {
    let filtered = authors;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (author) =>
          author.author?.toLowerCase().includes(query) ||
          author.email?.toLowerCase().includes(query) ||
          author.tags?.join().toLowerCase().includes(query)
      );
    }

    // Filter by solution/category
    if (selectedPillar !== "all") {
      filtered = filtered.filter((author) => author.tags.includes(selectedPillar));
    }
    if (selectedSubpillar !== "all") {
      filtered = filtered.filter((author) => author.tags.includes(selectedSubpillar));
    }
    if (selectedSolution !== "all") {
      filtered = filtered.filter((author) => author.tags.includes(selectedSolution));
    }
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((author) => author.tags.includes(selectedSubcategory));
    }

    // Sort authors
    const sorted = [...filtered];
    if (sortBy === "name") {
      sorted.sort((a, b) => (a.author || "").localeCompare(b.author || ""));
    } else if (sortBy === "recent") {
      // Already ordered by created_at DESC from database
      sorted.sort((a, b) => {
        const aDate = new Date(a.created_at || 0).getTime();
        const bDate = new Date(b.created_at || 0).getTime();
        return bDate - aDate;
      });
    }
    return sorted;
  }, [authors, searchQuery, sortBy, selectedPillar, selectedSubpillar, selectedSolution, selectedSubcategory]);

  const chunkedPapers = useMemo(() => {
    var chunked = [];
    var j = 0;
    for (let i = 0; i < Math.ceil(filteredAndSortedAuthors.length / Number(pageSize)); i++) {
      chunked.push(filteredAndSortedAuthors.slice(j, j + Number(pageSize)));
      j += Number(pageSize);
    }
    setNumPages(Math.ceil(filteredAndSortedAuthors.length / Number(pageSize)));
    return chunked;
  }, [filteredAndSortedAuthors, pageSize]);
  return (
    <main>
      <h1>Explore authors</h1>
      <div className="flex justify-center">
        <p className="p-3 text-muted-foreground">
          Browse authors, contact info, and associated tags
        </p>
      </div>
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          Error loading authors: {error}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex justify-center">
      <div className="flex flex-col w-5xl gap-4 bg-card p-3 rounded-lg border">
        <div className="flex space-x-4 align-middle">
          <div className="lg:w-3/4 sm:w-1/4 md:w-1/4">
        <InputGroup>
          <InputGroupInput 
            placeholder="Search by name, email, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
          </div>
          
          <div className="flex-1">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "recent")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
            <Select value={pageSize} onValueChange={(value) => {
              setPageSize(value);
              setCardPage(0);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select page size"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 results</SelectItem>
                <SelectItem value="20">20 results</SelectItem>
                <SelectItem value="50">50 results</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-initial">
            <ButtonGroup>
              <Button variant="outline" onClick={() => setListView(true)}><List/></Button>
              <Button variant="outline" onClick={() => setListView(false)}><LayoutGrid/></Button>
            </ButtonGroup>
          </div>
        </div>
        <Separator />
        <div className="flex space-x-4">
          <div className="flex-1">
        <Select value={selectedPillar} onValueChange={(value: string)=>{
          setSelectedPillar(value);
          var subpillarOpts: string[] = [];
          var solutionOpts: string[] = [];
          var subcategoryOpts: string[] = [];
          if (value == "all") {
            subpillarOpts = subpillars;
            solutionOpts = solutions;
            subcategoryOpts = subcategories;
          }
          else {
            for (const subpillar in solutionsData[value]) {
              subpillarOpts.push(subpillar);
              for (const solution in solutionsData[value][subpillar]) {
                solutionOpts.push(solution);
                for (const subcategory of solutionsData[value][subpillar][solution]) {
                  subcategoryOpts.push(subcategory);
                }
              }
            }
          }
          setSubpillarOptions(subpillarOpts);
          setSolutionOptions(solutionOpts);
          setSubcategoryOptions(subcategoryOpts);
          setSelectedSubpillar("all");
          setSelectedSolution("all");
          setSelectedSubcategory("all");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by pillar" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="all">All Pillars</SelectItem>
            {pillars.map((pillar) => (
          <SelectItem key={pillar} value={pillar}>
            {pillar}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
        <Select value={selectedSubpillar} onValueChange={(value:string)=>{
          setSelectedSubpillar(value);
          var solutionOpts: string[] = [];
          var subcategoryOpts: string[] = [];
          var pillar = selectedPillar;
          if (value == "all") {
            solutionOpts = solutions;
            subcategoryOpts = subcategories;
          }
          else {
            if (selectedPillar == "all") {
              for (const pil in solutionsData) {
                if (value in solutionsData[pil]) {
                  pillar = pil;
                }
              }
            }
            for (const sol in solutionsData[pillar][value]) {
              solutionOpts.push(sol);
              for (const subcategory of solutionsData[pillar][value][sol]) {
                subcategoryOpts.push(subcategory);
              }
            }
          }
          setSolutionOptions(solutionOpts);
          setSubcategoryOptions(subcategoryOpts);
          setSelectedSolution("all");
          setSelectedSubcategory("all");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by subpillar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subpillars</SelectItem>
            {subpillarOptions.map((subpillar) => (
          <SelectItem key={subpillar} value={subpillar}>
            {subpillar}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
        <Select value={selectedSolution} onValueChange={(value:string)=>{
          setSelectedSolution(value);
          var subcategoryOpts: string[] = [];
          var pillar = selectedPillar;
          var subpillar = selectedSubpillar;
          if (value == "all") {
            subcategoryOpts = subcategories;
          }
          else {
            if (selectedPillar == "all" && selectedSubpillar != "all") { // figure out what the pillar is
              for (const pil in solutionsData) {
                if (selectedSubpillar in solutionsData[pil]) {
                  pillar = pil;
                  continue;
                }
              }
            }
            else if (selectedPillar != "all" && selectedSubpillar == "all") { // figure out what the subpillar is
              for (const sp in solutionsData[selectedPillar]) {
                if (value in solutionsData[selectedPillar][sp]) {
                  subpillar = sp;
                  continue;
                }
              }
            }
            else if (selectedPillar == selectedSubpillar) { //figure out what the subpillar and pillar are
              for (const pil in solutionsData) {
                for (const sp in solutionsData[pil]) {
                  if (value in solutionsData[pil][sp]) {
                    pillar = pil;
                    subpillar = sp;
                    continue;
                  }
                }
              }
            }
            for (const subcategory of solutionsData[pillar][subpillar][value]) {
              subcategoryOpts.push(subcategory);
            }
          }
          setSubcategoryOptions(subcategoryOpts);
          setSelectedSubcategory("all");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by solution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Solutions</SelectItem>
            {solutionOptions.map((solution) => (
          <SelectItem key={solution} value={solution}>
            {solution}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
        <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subcategories</SelectItem>
            {subcategoryOptions.map((subcategory) => (
          <SelectItem key={subcategory} value={subcategory}>
            {subcategory}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
        </div>
      </div>
      </div>
    <div className="p-6 max-w-7/8 mx-auto">
      {loading ? (
        <div className="w-full overflow-hidden rounded-md border">
          <table className="table-fixed w-full">
            <thead>
              <tr>
                <th >
                  <Skeleton/>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="border-b">
                  <th>
                  <div className="h-9.5 flex gap-8 items-center p-1">
                    <Skeleton className="w-1/8 p-2.5"/>
                    <Skeleton className="w-1/3 p-2.5 justify-center"/>
                    <Skeleton className="w-1/2 p-2.5 justify-end"/>
                  </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      ) : filteredAndSortedAuthors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {authors.length === 0
              ? "No authors found in the database yet."
              : "No authors match your search or filter criteria."}
          </p>
        </div>
      ) : listView == true? (
          <DataTable
            columns={columns}
            data={filteredAndSortedAuthors}
            pageSize={Number(pageSize)}
          />
        
      ) : (
        <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {(chunkedPapers[cardPage]).map((author) => (
              <Card
                className="hover:shadow-lg transition-shadow"
                onClick={() => setSelectedAuthor(author)}
                key={author.id}
              >
                <CardHeader className="">
                  <CardTitle className="">
                    {author.author || "Unknown"}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {author.email ? (<a href={`mailto:${author.email}`} className="hover:underline">{author.email}</a>) : "Unknown email"}
                  </CardDescription>
                </CardHeader>
                
                <CardFooter className="content-end flex-wrap gap-3">
                  {author.tags.map((tag) => (
                    <Button key={tag} className="rounded-full text-xs text-muted-foreground" variant="outline" size="sm" onClick={(event) => {
                      event.stopPropagation();
                      setGeneralSelection(tag, event);
                    }}>
                      {tag}
                    </Button>
                  ))}
                </CardFooter>
              </Card>
          ))}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCardPage(cardPage - 1)}
            disabled={cardPage == 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCardPage(cardPage + 1)}
            disabled={cardPage == numPages - 1}
          >
            Next
          </Button>
        </div>
        </div>
      )}
      </div>
    </main>
  );
}
import {
  pillars,
  subpillars,
  solutions,
  subcategories,
  solutionsData
} from "./taxonomy-config"

type Pillar = typeof pillars[number];
type Subpillar = typeof subpillars[number];
type Solution = typeof solutions[number];
type Subcategory = typeof subcategories[number];

type Category = "pillar" | "subpillar" | "solution" | "subcategory"

export interface CategoryState {
  selectedPillar: Pillar,
  selectedSubpillar: Subpillar,
  selectedSolution: Solution,
  selectedSubcategory: Subcategory,
  pillarOpts: string[],
  subpillarOpts: string[],
  solutionOpts: string[],
  subcategoryOpts: string[]
}

export function InitCategoryState(pillar: Pillar, subpillar: Subpillar, solution: Solution, subcategory: Subcategory) {
  var newState: CategoryState = {
    selectedPillar: pillar,
    selectedSubpillar: subpillar || "None",
    selectedSolution: solution || "None",
    selectedSubcategory: subcategory || "None",
    pillarOpts: pillars,
    subpillarOpts: ['None'],
    solutionOpts: ['None'],
    subcategoryOpts: ['None']
  }
  for (const sp in solutionsData[pillar]) {
    newState.subpillarOpts.push(sp)
    for (const sol in solutionsData[pillar][sp]) {
      newState.solutionOpts.push(sol)
      for (const sc of solutionsData[pillar][sp][sol])
        newState.subcategoryOpts.push(sc)
    }
  }
  return newState
}

export function UpdateCategoryState(initState: CategoryState, changedCategory: Category) {
  var currentState = {...initState};
  if (changedCategory == "pillar") {
    var subpillarOpts = ["None"];
    var solutionOpts = ["None"];
    var subcategoryOpts = ["None"];
    for (const subpillar in solutionsData[currentState.selectedPillar]) {
      subpillarOpts.push(subpillar);
        for (const solution in solutionsData[currentState.selectedPillar][subpillar]) {
        solutionOpts.push(solution);
        for (const subcategory of solutionsData[currentState.selectedPillar][subpillar][solution]) {
          subcategoryOpts.push(subcategory);
        }
      }
    }
    currentState.subpillarOpts = subpillarOpts;
    currentState.solutionOpts = solutionOpts;
    currentState.subcategoryOpts = subcategoryOpts;
    currentState.selectedSubpillar = "None";
    currentState.selectedSolution = "None";
    currentState.selectedSubcategory = "None";
  }
  else if (changedCategory == "subpillar") {
    var solutionOpts = ["None"];
    var subcategoryOpts = ["None"];
    if (currentState.selectedSubpillar == "None") {
      var subpillarOpts = ["None"];
      for (const subpillar in solutionsData[currentState.selectedPillar]) {
        subpillarOpts.push(subpillar);
          for (const solution in solutionsData[currentState.selectedPillar][subpillar]) {
          solutionOpts.push(solution);
          for (const subcategory of solutionsData[currentState.selectedPillar][subpillar][solution]) {
            subcategoryOpts.push(subcategory);
          }
        }
      }
      currentState.subpillarOpts = subpillarOpts;
      currentState.solutionOpts = solutionOpts;
      currentState.subcategoryOpts = subcategoryOpts;
      currentState.selectedSolution = "None";
      currentState.selectedSubcategory = "None";
    }
    else {
      for (const solution in solutionsData[currentState.selectedPillar][currentState.selectedSubpillar]) {
        solutionOpts.push(solution);
        for (const subcategory of solutionsData[currentState.selectedPillar][currentState.selectedSubpillar][solution]) {
          subcategoryOpts.push(subcategory);
        }
      }
      currentState.solutionOpts = solutionOpts;
      currentState.subcategoryOpts = subcategoryOpts;
      currentState.selectedSolution = "None";
      currentState.selectedSubcategory = "None";
    }
  }
  else if (changedCategory == "solution") {
    var subcategoryOpts = ["None"];
    var subpillarToAdd = currentState.selectedSubpillar;
    if (currentState.selectedSubpillar == "None") { // update tree in reverse
      for (const sp in solutionsData[currentState.selectedPillar]) {
        for (const sol in solutionsData[currentState.selectedPillar][sp]) {
          if (sol == currentState.selectedSolution) {
            subpillarToAdd = sp;
            continue;
          }
        };
      };
    };
    if (currentState.selectedSolution != "None") {
      for (const subcategory of solutionsData[currentState.selectedPillar][subpillarToAdd][currentState.selectedSolution]) {
        subcategoryOpts.push(subcategory);
      }
    }
    else { // solution is set to none
      for (const sol in solutionsData[currentState.selectedPillar][subpillarToAdd]) {
        for (const sc of solutionsData[currentState.selectedPillar][subpillarToAdd][sol]) {
          subcategoryOpts.push(sc)
        }
      }
    }
    currentState.selectedSubpillar = subpillarToAdd;
    currentState.subcategoryOpts = subcategoryOpts;
    currentState.selectedSubcategory = "None";
  }
  else {
    var subpillarToAdd = currentState.selectedSubpillar;
    var solutionToAdd = currentState.selectedSolution;
    
    if (currentState.selectedSolution == "None" && currentState.selectedSubpillar == "None") { // update tree in reverse
      var subcategoryOpts: string[] = ["None"];
      var solutionOpts: string[] = ["None"];
      for (const sp in solutionsData[currentState.selectedPillar]) {
        for (const sol in solutionsData[currentState.selectedPillar][sp]) {
          for (const sc of solutionsData[currentState.selectedPillar][sp][sol]) {
            if (sc == currentState.selectedSubcategory) {
              solutionToAdd = sol;
              subpillarToAdd = sp;
              subcategoryOpts = [...["None"], ...solutionsData[currentState.selectedPillar][sp][sol]];
              
            }
          }
        };
      };
      for (const sol in solutionsData[currentState.selectedPillar][subpillarToAdd]) {
        solutionOpts.push(sol);
      }
      currentState.solutionOpts = solutionOpts;
      currentState.subcategoryOpts = subcategoryOpts;
    };
    if (currentState.selectedSolution == "None" && currentState.selectedSubpillar != "None") {
      var subcategoryOpts: string[] = ["None"];
      var solutionOpts: string[] = ["None"];
      for (const sol in solutionsData[currentState.selectedPillar][subpillarToAdd]) {
        for (const sc of solutionsData[currentState.selectedPillar][subpillarToAdd][sol]) {
          if (sc == currentState.selectedSubcategory) {
            solutionToAdd = sol;
            solutionOpts = [sol];
            subcategoryOpts = currentState.subcategoryOpts;
            continue;
          }
        }
      }
      currentState.solutionOpts = solutionOpts;
      currentState.subcategoryOpts = subcategoryOpts;
    }
    currentState.selectedSubpillar = subpillarToAdd;
    currentState.selectedSolution = solutionToAdd;
  }
  return currentState;
}
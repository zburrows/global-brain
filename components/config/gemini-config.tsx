import {
  subpillars,
  solutions,
  subcategories,
  solutionsData,
  solutionDefinitions,

} from "./taxonomy-config";

export const model = "gemini-2.5-flash";

export function getEmailContents(author: string, title: string) {
  return [
    {
      parts: [
        { text: `Search publicly available sources (such as institutional websites, LinkedIn, Google Scholar, or author profiles) to find the email address for ${author}, who wrote ${title}. List the most recently found email address. Leave blank if the email cannot be found. The output should be either ONLY an email address (if found) or blank. Do not generate a paragraph.` 
        }
      ]
    }
  ];
}
export const emailConfig = {
  tools: [{googleSearch: {},}],
}
export const urlContents = [
  `For the authors, generate a shortened description of the authors of the paper. If there are multiple authors, format this field as the first surname et al. (for instance, Blanca et al.). If there is a single author, format this field as the first letter of the first name and the surname (for instance, M. Acreman).
  For the title, list the title of the paper.
  For author 1, list the first author of the paper in the format (lastName, firstName) without parentheses.
  For author 2, list the second author of the paper in the format (lastName, firstName) without parentheses, if a second author exists. If not, leave the field blank.
  For the organization, list the lead organization that sponsored or otherwise supported the writing of the paper. This should not be a paragraph, ONLY the name of the lead organization.
  For the year, list the year the paper was published.
  For the journal, list the academic journal in which the paper was published.
  For the key findings, summarize the paper in about 75 words. Be sure to include the 'key finding', which is typically some numerical element.
  For the meta description of the paper, capture as many keywords as possible in the form of a short sentence. This description is limited to 155 characters. Include the previously generated 'authors' field, enclosed with parenthesis, as a citation at the end. DOUBLE CHECK that this description is under 155 characters before submitting.
  For the one-page summary of the paper, write a 4-6 paragraph, 400-600 word summary. Be sure to separate each paragraph in the generated output with a full line break, and make sure that the output has a total of 400-600 words.
  For the pillar, subpillar, solution, and subcategory, categorize the primary solution presented in the paper.`
]
export const abstractContents = [
    "For the authors, generate a shortened description of the authors of the paper. If there are multiple authors, format this field as the first surname et al. (for instance, Blanca et al.). If there is a single author, format this field as the first letter of the first name and the surname (for instance, M. Acreman).",
    "For the title, list the title of the paper.",
    "For the link, list a web link to the paper, if available.",
    "For author 1, list the first author of the paper in the format (lastName, firstName), without parentheses.",
    "For author 2, list the second author of the paper in the format (lastName, firstName) without parentheses, if a second author exists.",
    "For the organization, list the lead organization that sponsored or otherwise supported the writing of the paper. This should not be a paragraph, ONLY the name of the lead organization.",
    "For the year, list the year the paper was published.",
    "For the journal, list the academic journal in which the paper was published.",
    "For the solutions, categorize the primary solution presented in the paper",
    "For the key findings, summarize the paper in about 75 words. Be sure to include the 'key finding', which is typically some numerical element.",
    "For the meta description of the paper, capture as many keywords as possible in the form of a short sentence. This description is limited to 155 characters. Include the previously generated 'authors' field, enclosed with parenthesis, as a citation at the end.",
    "For the one-page summary of the paper, write a 4-6 paragraph, 400-600 word summary. Be sure to separate each paragraph in the generated output with a newline, and make sure that the output has a total of 400-600 words."
];

export function getPdfContents(base64: string) {
  // Remove data URL prefix if present
  const base64Only = base64.includes(',') ? base64.split(',')[1] : base64;
  return [
    {
      parts: [
        { text: `For the authors, generate a shortened description of the authors of the document. If there are multiple authors, format this field as the first surname et al. (for instance, Blanca et al.). If there is a single author, format this field as the first letter of the first name and the surname (for instance, M. Acreman).
                For the title, list the title of the document.
                For the link, list a web link to the document, if available.
                For author 1, list the first author of the document in the format (lastName, firstName) without parentheses.
                For author 2, list the second author of the document in the format (lastName, firstName) without parentheses, if a second author exists.
                For the organization, list the lead organization that sponsored or otherwise supported the writing of the document. This should not be a paragraph, ONLY the name of the lead organization.
                For the year, list the year the document was published.
                For the journal, list the academic journal in which the journal was published.
                For the key findings, summarize the document in about 75 words. Be sure to include the 'key finding', which is typically some numerical element.
                For the meta description of the document, capture as many keywords as possible in the form of a short sentence. This description is limited to 155 characters. Include the previously generated 'authors' field, enclosed with parenthesis, as a citation at the end.
                For the one-page summary of the document, write a 4-6 paragraph, 400-600 word summary. Be sure to separate each paragraph in the generated output with a full line break, and make sure that the output has a total of 400-600 words.
                For the pillar, subpillar, solution, and subcategory, categorize the primary solution presented in the paper. You must follow the hierarchical structure for this taxonomy provided by the following JSON file: ${JSON.stringify(solutionsData)}` },
        { inlineData: { mimeType: "application/pdf", data: base64Only } }
      ]
    }
  ];
}
export function getUrlConfig(html: string) {
  return {
  responseMimeType: "application/json",
  responseJsonSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        authors: {
          type: "string",
        },
        title: {
          type: "string",
        },
        link: {
          type: "string",
        },
        author1: {
          type: "string",
        },
        author2: {
          type: "string",
        },
        organization: {
          type: "string",
        },
        year: {
          type: "integer",
        },
        journal: {
          type: "string",
        },
        pillar: {
          type: "string",
          enum: ["Energy Transition", "Nature Conservation", "Regenerative Agriculture", "Disputed Solutions", "Climate Change", "Biodiversity Loss", "General"],
        },
        subpillar: {
          type: "string",
          enum: subpillars,
        },
        solution: {
          type: "string",
          enum: solutions,
        },
        subcategory: {
          type: "string",
          enum: subcategories,
        },
        keyFindings: {
          type: "string",
        },
        metaDescription: {
          type: "string",
        },
        onePageSummary: {
          type: "string",
        }
      },
      propertyOrdering: ["authors", "title", "link", "author1", "author2", "organization", "year", "journal", "pillar", "subpillar", "solution", "subcategory", "keyFindings", "metaDescription", "onePageSummary"],
    },
    systemInstruction: `Do not include inline citations or references in responses, except for the meta description. 
    Generate answers to all fields; if unknown or unsure, leave the field blank (that is, do not generate "none" or "null" except for the tagging).
    For the taxonomy, you may only select one tag from each level, and they all must be nested within one another as outlined in the JSON file structure. 
    You do not have to select a tag for every level, if one seems to be too specific for the subject of the paper and the solution that is presented in it. If you have decided not to classify a paper in a certain level of specificity, choose "None". Note that you must choose at least the overarching pillar.
    For reference, here is a dictionary of "leaf" tags in the file structure and specific definitions. Again, you do not have to specify to this level every time - only if appropriate. ${solutionDefinitions}.
    Finally, generate all answers in relation to the following string, representing the full-page HTML content of the website with the paper: ${html}`,
  },
  };
};
export function getAbstractConfig(abstract: string) {
  return {
    responseMimeType: "application/json",
    responseSchema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          authors: {
            type: "string",
          },
          title: {
            type: "string",
          },
          link: {
            type: "string",
          },
          author1: {
            type: "string",
          },
          author2: {
            type: "string",
          },
          organization: {
            type: "string",
          },
          year: {
            type: "integer",
          },
          journal: {
            type: "string",
          },
          solutions: {
            type: "string",
            enum: ["Energy Transition", "Nature Conservation", "Regenerative Agriculture", "Disputed Solutions", "Climate Change", "Biodiversity Loss", "General"],
          },
          keyFindings: {
            type: "string",
          },
          metaDescription: {
            type: "string",
          },
          onePageSummary: {
            type: "string",
          }
        },
        propertyOrdering: ["authors", "title", "link", "author1", "author2", "organization", "year", "journal", "solutions", "keyFindings", "metaDescription", "onePageSummary"],
      },
    },
    systemInstruction: `Do not include inline citations or references in responses, except for the meta description. Generate answers to all 11 questions; if unknown leave blank. To answer the questions, make assumptions about the whole paper from the following abstract: ${abstract}.`,
  };
};

export const pdfConfig = {
  responseMimeType: "application/json",
  responseJsonSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        authors: {
          type: "string",
        },
        title: {
          type: "string",
        },
        link: {
          type: "string",
        },
        author1: {
          type: "string",
        },
        author2: {
          type: "string",
        },
        organization: {
          type: "string",
        },
        year: {
          type: "integer",
        },
        journal: {
          type: "string",
        },
        pillar: {
          type: "string",
          enum: ["Energy Transition", "Nature Conservation", "Regenerative Agriculture", "Disputed Solutions", "Climate Change", "Biodiversity Loss", "General"],
        },
        subpillar: {
          type: "string",
          enum: subpillars,
        },
        solution: {
          type: "string",
          enum: solutions,
        },
        subcategory: {
          type: "string",
          enum: subcategories,
        },
        keyFindings: {
          type: "string",
        },
        metaDescription: {
          type: "string",
        },
        onePageSummary: {
          type: "string",
        }
      },
      propertyOrdering: ["authors", "title", "link", "author1", "author2", "organization", "year", "journal", "pillar", "subpillar", "solution", "subcategory", "keyFindings", "metaDescription", "onePageSummary"],
    },
    systemInstruction: `Do not include inline citations or references in responses, except for the meta description. 
    Generate answers to all fields; if unknown or unsure, leave the field blank (that is, do not generate "none" or "null" except for the tagging).
    For the taxonomy, you may only select one tag from each level, and they all must be nested within one another as outlined in the JSON file structure. 
    You do not have to select a tag for every level, if one seems to be too specific for the subject of the paper and the solution that is presented in it. If you have decided not to classify a paper in a certain level of specificity, choose "None". Note that you must choose at least the overarching pillar.
    For reference, here is a dictionary of "leaf" tags in the file structure and specific definitions. Again, you do not have to specify to this level every time - only if appropriate. ${solutionDefinitions}`,
  },
};



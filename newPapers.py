import csv
import json

input_file = "authorTest.csv"
output_file = "authors.csv"

# Columns you want to combine into an array (0‑based index)
COLUMNS_TO_COMBINE = [11, 12, 13, 14]   # example: combine columns 2, 3, and 4
AUTHOR_COLUMNS = [2, 3]
rows = []
existing_authors = []
author_headers = ["author", "email", "papers", "tags"]
with open(input_file, newline="", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)

    # # Add new column name
    # header.append("tags")

    for row in reader:
        # Extract selected columns
        
        tags = []
        for i in COLUMNS_TO_COMBINE:
          if row[i] != '':
            tags.append(row[i])
        for i in AUTHOR_COLUMNS:
          if row[i] != '' and row[i] not in existing_authors:
            new_row = [row[i], '', [], json.dumps(tags)]
            rows.append(new_row)
            existing_authors.append(row[i])

# Write output CSV
with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(author_headers)
    writer.writerows(rows)
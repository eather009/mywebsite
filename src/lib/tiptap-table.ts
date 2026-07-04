import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

export const tableExtensions = [
  Table.configure({
    resizable: false,
    HTMLAttributes: { class: "blog-table" },
  }),
  TableRow,
  TableHeader,
  TableCell,
];

type TableCellContent = {
  type: "tableHeader" | "tableCell";
  content: { type: "paragraph"; content: { type: "text"; text: string }[] }[];
};

function cell(text: string, header = false): TableCellContent {
  return {
    type: header ? "tableHeader" : "tableCell",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  };
}

function row(cells: string[], header = false) {
  return {
    type: "tableRow",
    content: cells.map((text) => cell(text, header)),
  };
}

/** Build a TipTap table node from header + body rows. */
export function buildTableNode(headers: string[], rows: string[][]) {
  return {
    type: "table",
    content: [
      {
        type: "tableRow",
        content: headers.map((text) => cell(text, true)),
      },
      ...rows.map((cells) => row(cells)),
    ],
  };
}

/** Pre-built: Developer Skill → Leadership Application table. */
export function developerSkillsTableNode() {
  return buildTableNode(
    ["Developer Skill", "Leadership Application"],
    [
      ["Debugging", "Root-cause analysis for team/process issues"],
      ["Code review", "Mentoring through constructive feedback"],
      ["System design", "Architecture decisions and technical strategy"],
      ["Estimation", "Sprint planning and project scoping"],
    ]
  );
}

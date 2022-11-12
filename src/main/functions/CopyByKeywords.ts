import ExcelJS from "exceljs";
import xlsx from "node-xlsx";

import type { Rule, Task, TaskList } from "@@/common/types/CopyByKeywords";
import type * as NodeXlsx from "node-xlsx";
import type * as ExcelJs from "exceljs";

export enum ExcelType {
  "Null",
  "Merge",
  "Number",
  "String",
  "Date",
  "Hyperlink",
  "Formula",
  "SharedString",
  "RichText",
  "Boolean",
  "Error",
}

export interface fromValue {
  row: number;
  value: any;
  sourceFile: string;
}

export interface CombineRule {
  from: string;
  to: string;
  fromValues: fromValue[];
  fromSet: Set<any>;
}

export interface matchCell {
  sourceFile: string;
  row: number;
  accord?: number;
}

export default async (taskList: TaskList) =>
  Promise.all(
    taskList.map(async (task: Task) => {
      await executeOneTask(task);
    })
  );

const executeOneTask = async (task: Task) => {
  const {
    rules,
    sourceFiles,
    targetFiles,
    sourceFilesStartLine,
    targetFilesStartLine
  } = task;
  // 分类 rules，生成三种类型事务：定位、复制、填充
  const affairs = rules.reduce(
    (pre: CombineRule[][], rule: Rule) => {
      pre[rule.type].push({
        from: rule.from,
        to: rule.to,
        fromValues: [],
        fromSet: new Set()
      });
      return pre;
    },
    [[], [], []] as CombineRule[][]
  );

  // 获取值
  for (const filePath of sourceFiles) {
    const workbook = new ExcelJS.Workbook();
    await readFile(workbook, filePath);

    const worksheet = workbook.getWorksheet(1);
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber < sourceFilesStartLine) return;
      affairs.forEach((rules, index) => {
        if (index < 2) {
          rules.forEach((rule) => {
            if (row.getCell(Number(rule.from)).type === 1) return;
            const cellValue = row.getCell(Number(rule.from)).text;
            rule.fromValues.push({
              row: rowNumber,
              value: cellValue,
              sourceFile: filePath
            });
            rule.fromSet.add(cellValue);
          });
        }
      });
    });
  }

  // 确定以及比对值
  for (const filePath of targetFiles) {
    const workbook = new ExcelJS.Workbook();
    await readFile(workbook, filePath);

    const worksheet = workbook.getWorksheet(1);
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber < targetFilesStartLine) return;
      const sourceRows: matchCell[] = [];
      affairs.forEach((rules, index) => {
        switch (index) {
          case 0: {
            // 匹配当前行定位到的来源行
            locationRows(sourceRows, rules, row);
            break;
          }
          case 1: {
            // 复制值
            copyCells(sourceRows, rules, row);
            break;
          }
          case 2: {
            // 填充值
            fillCells(sourceRows, rules, row);
          }
        }
      });
    });

    await workbook.xlsx.writeFile(parseFilePath(filePath));
  }
};

const readFile = async (workbook: ExcelJs.Workbook, filePath: string) => {
  if (/\.xls$/.test(filePath)) {
    const xlsFileWorkSheets = xlsx.parse(filePath);
    const buffer = xlsx.build(
      xlsFileWorkSheets as NodeXlsx.WorkSheet<unknown>[]
    );
    await workbook.xlsx.load(buffer);
  } else {
    await workbook.xlsx.readFile(filePath);
  }
};

const locationRows = (
  sourceRows: matchCell[],
  rules: CombineRule[],
  row: ExcelJs.Row
) => {
  let matchCells: matchCell[] = [];
  rules.forEach((rule, index) => {
    if (row.getCell(Number(rule.to)).type === 1) return;
    const cellValue = row.getCell(Number(rule.to)).text;
    if (rule.fromSet.has(cellValue)) {
      rule.fromValues.forEach((cell) => {
        if (cell.value === cellValue) {
          if (index === 0) {
            matchCells.push({
              row: cell.row,
              sourceFile: cell.sourceFile,
              accord: 0
            });
          } else {
            const matchCell = matchCells.find(
              (item) =>
                item.row === cell.row && item.sourceFile === cell.sourceFile
            );
            if (matchCell) matchCell.accord++;
          }
        }
      });
    }
    matchCells = matchCells.filter((item) => index === item.accord);
  });
  matchCells.forEach((item) =>
    sourceRows.push({ row: item.row, sourceFile: item.sourceFile })
  );
};

const copyCells = (
  sourceRows: matchCell[],
  rules: CombineRule[],
  row: ExcelJs.Row
) => {
  const lastMatchSourceRow = sourceRows[sourceRows.length - 1];
  if (!lastMatchSourceRow) return;
  rules.forEach((rule) => {
    rule.fromValues.forEach((cell) => {
      if (
        lastMatchSourceRow.row === cell.row &&
        lastMatchSourceRow.sourceFile === cell.sourceFile
      ) {
        row.getCell(Number(rule.to)).value = cell.value;
      }
    });
  });
};

const fillCells = (
  sourceRows: matchCell[],
  rules: CombineRule[],
  row: ExcelJs.Row
) => {
  const lastMatchSourceRow = sourceRows[sourceRows.length - 1];
  if (!lastMatchSourceRow) return;
  rules.forEach((rule) => {
    row.getCell(Number(rule.to)).value = rule.from;
  });
};

const parseFilePath = (filePath: string) => {
  return filePath.replace(/(\.xls(x)?)$/, "(合并文件).xlsx");
};

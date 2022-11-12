export interface Rule {
  type: number;
  from: string;
  to: string;
}

export type FileMap = { [K: string]: string };

export type Task = {
  sourceFiles: string[];
  targetFiles: string[];
  sourceFilesStartLine: number;
  targetFilesStartLine: number;
  rules: Rule[];
};

export type TaskList = Task[];

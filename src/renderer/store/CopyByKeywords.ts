import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileMap, Rule, Task, TaskList } from "@@/common/types/CopyByKeywords";

export interface initialState {
  fileMap: FileMap;
  taskList: TaskList;
}

const initialState: initialState = {
  fileMap: {},
  taskList: []
};

export const CopyByKeywordsSlice = createSlice({
  name: "CopyByKeywords",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.taskList.push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.taskList.splice(action.payload, 1);
    },
    updateTask: (
      state,
      action: PayloadAction<{ index: number; task: Task }>
    ) => {
      state.taskList[action.payload.index] = action.payload.task;
    },
    updateTaskList: (state, action: PayloadAction<TaskList>) => {
      state.taskList = action.payload;
    },
    addTaskRule: (
      state,
      action: PayloadAction<{ index: number; rule: Rule }>
    ) => {
      state.taskList[action.payload.index].rules.push(action.payload.rule);
    },
    deleteTaskRule: (
      state,
      action: PayloadAction<{ taskIndex: number; ruleIndex: number }>
    ) => {
      state.taskList[action.payload.taskIndex].rules.splice(
        action.payload.ruleIndex,
        1
      );
    },
    updateTaskRule: (
      state,
      action: PayloadAction<{
        taskIndex: number;
        ruleIndex: number;
        rule: Rule;
      }>
    ) => {
      state.taskList[action.payload.taskIndex].rules[action.payload.ruleIndex] =
        action.payload.rule;
    },
    setFile: (state, action: PayloadAction<{ path: string; name: string }>) => {
      state.fileMap[action.payload.path] = action.payload.name;
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.fileMap[action.payload] = undefined;
    }
  }
});

export const {
  addTask,
  deleteTask,
  updateTask,
  updateTaskList,
  addTaskRule,
  deleteTaskRule,
  updateTaskRule,
  setFile,
  removeFile
} = CopyByKeywordsSlice.actions;

export default CopyByKeywordsSlice.reducer;

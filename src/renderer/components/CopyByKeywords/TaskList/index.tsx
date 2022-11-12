import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTask as addTaskAction,
  deleteTask as deleteTaskAction
} from "@/store/CopyByKeywords";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Task from "@/components/CopyByKeywords/TaskList/Task";
import styles from "./index.module.scss";

const index: React.FC = () => {
  const taskList = useAppSelector((state) => state.CopyByKeywords.taskList);
  const dispatch = useAppDispatch();

  const addTask = () => {
    dispatch(
      addTaskAction({
        sourceFiles: [],
        targetFiles: [],
        sourceFilesStartLine: 1,
        targetFilesStartLine: 1,
        rules: []
      })
    );
  };
  const deleteTask = (index: number) => {
    dispatch(deleteTaskAction(index));
  };

  return (
    <>
      {taskList.map((val, index) => (
        <Task key={index} index={index} task={val} deleteTask={deleteTask} />
      ))}
      <div className={styles["button-container"]}>
        <Button
          className={styles["center-button"]}
          type="primary"
          icon={<PlusOutlined />}
          onClick={addTask}
          ghost
        >
          添加任务
        </Button>
      </div>
    </>
  );
};

export default index;

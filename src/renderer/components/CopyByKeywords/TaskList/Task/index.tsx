import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTaskRule,
  deleteTaskRule,
  updateTask
} from "@/store/CopyByKeywords";
import { Card, Col, Dropdown, Row, Select, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Rule from "@/components/CopyByKeywords/TaskList/Task/Rule";
import styles from "./index.module.scss";

import type { MenuInfo } from "rc-menu/lib/interface";
import type { Task as TaskType } from "@@/common/types/CopyByKeywords";

export interface IProps {
  index: number;
  task: TaskType;
  deleteTask: (index: number) => void;
}

const Task: React.FC<IProps> = (props: IProps) => {
  const { index, task, deleteTask } = props;
  const fileMap = useAppSelector((state) => state.CopyByKeywords.fileMap);
  const taskList = useAppSelector((state) => state.CopyByKeywords.taskList);
  const dispatch = useAppDispatch();
  const ruleTypes = [
    {
      key: "0",
      label: "定位"
    },
    {
      key: "1",
      label: "复制"
    },
    {
      key: "2",
      label: "填充"
    }
  ];
  const [currentRuleType, setCurrentRuleType] = useState<number>(0);
  const [sourceFilesStartLine, setSourceFilesStartLine] = useState<number>(1);
  const [targetFilesStartLine, setTargetFilesStartLine] = useState<number>(1);

  const selectFile = (val: string[], index: number, type: number) => {
    dispatch(
      updateTask({
        index,
        task: {
          ...taskList[index],
          [type === 0 ? "sourceFiles" : "targetFiles"]: val
        }
      })
    );
  };
  const addRule = (index: number, type: number) => {
    dispatch(
      addTaskRule({
        index,
        rule: {
          type: type,
          from: "",
          to: ""
        }
      })
    );
  };
  const deleteRule = (taskIndex: number, ruleIndex: number) => {
    console.log(taskIndex, ruleIndex);
    dispatch(deleteTaskRule({ taskIndex, ruleIndex }));
  };
  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: number
  ) => {
    let value = Number(e.target.value);
    if (value < 1) value = 1;
    dispatch(
      updateTask({
        index,
        task: {
          ...taskList[index],
          [type === 0 ? "sourceFilesStartLine" : "targetFilesStartLine"]: value
        }
      })
    );
    (type === 0 ? setSourceFilesStartLine : setTargetFilesStartLine)(value);
  };

  return (
    <>
      <Card className={styles["task-container"]}>
        <DeleteOutlined
          className={styles.delete}
          onClick={() => deleteTask(index)}
        />
        <Row gutter={[0, 0]}>
          {[task.sourceFiles, task.targetFiles].map((val, type) => (
            <Col span={12} key={type}>
              <div className={styles.title}>
                {type === 0 ? "信息来源" : "目标文件"}
              </div>
              <Select
                mode="multiple"
                style={{ width: "98%" }}
                value={val}
                onChange={(val) => selectFile(val, index, type)}
                options={Object.entries(fileMap).map((val) => ({
                  label: val[1],
                  value: val[0]
                }))}
                showArrow
                showSearch={false}
              />
            </Col>
          ))}
        </Row>
        <Row gutter={[0, 0]}>
          {[task.sourceFilesStartLine, task.targetFilesStartLine].map(
            (val, type) => (
              <Col span={12} key={type}>
                <div className={styles.title} style={{ marginTop: "10px" }}>
                  起始行
                </div>
                <Input
                  style={{ width: "98%" }}
                  type="number"
                  defaultValue={val}
                  value={
                    type === 0 ? sourceFilesStartLine : targetFilesStartLine
                  }
                  addonAfter="行"
                  min="1"
                  onChange={(e) => inputHandler(e, type)}
                />
              </Col>
            )
          )}
        </Row>
        {task.rules.length ? (
          <div style={{ marginTop: "10px" }}>规则：</div>
        ) : (
          ""
        )}
        {task.rules.map((val, ruleIndex) => (
          <Rule
            rule={val}
            taskIndex={index}
            ruleIndex={ruleIndex}
            key={ruleIndex}
            deleteRule={deleteRule}
          />
        ))}
        <Dropdown.Button
          className={styles.rule}
          menu={{
            items: ruleTypes,
            onClick: (e: MenuInfo) => setCurrentRuleType(Number(e.key))
          }}
          onClick={() => addRule(index, currentRuleType)}
        >
          {ruleTypes[currentRuleType].label}
        </Dropdown.Button>
      </Card>
    </>
  );
};

export default Task;

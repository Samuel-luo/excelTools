import React, { Fragment, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateTaskRule } from "@/store/CopyByKeywords";
import { Col, Input, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

import { Rule } from "@@/common/types/CopyByKeywords";
import {
  RuleTypeEnum,
  RuleTypeTagColorEnum
} from "@@/common/enums/CopyByKeywords";

export interface IProps {
  rule: Rule;
  taskIndex: number;
  ruleIndex: number;
  deleteRule: (taskIndex: number, ruleIndex: number) => void;
}

const Rule: React.FC<IProps> = (props: IProps) => {
  const { rule, taskIndex, ruleIndex, deleteRule } = props;
  const type = rule.type;
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const dispatch = useAppDispatch();

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputType: number
  ) => {
    let value = e.target.value;
    if ((type < 2 || inputType === 1) && Number(value) < 1) {
      value = "1";
    }
    dispatch(
      updateTaskRule({
        taskIndex,
        ruleIndex,
        rule: { ...rule, [inputType === 0 ? "from" : "to"]: value }
      })
    );
    (inputType === 0 ? setFrom : setTo)(value);
  };

  return (
    <>
      <Row className={styles.rule} gutter={[0, 0]}>
        <div
          className={styles.tag}
          style={{ backgroundColor: RuleTypeTagColorEnum[type] }}
        >
          {RuleTypeEnum[type]}
        </div>
        {[rule.from, rule.to].map((val, index) => (
          <Fragment key={index}>
            <Col span={1} className={styles.text}>
              {index === 1 ? "到" : type < 2 ? "从" : "内容"}
            </Col>
            <Col span={11}>
              <Input
                type={type < 2 || index === 1 ? "number" : "text"}
                defaultValue={val}
                value={index === 0 ? from : to}
                style={{ width: "98%" }}
                addonAfter={type < 2 || index === 1 ? "列" : ""}
                min="1"
                onChange={(e) => inputHandler(e, index)}
              />
            </Col>
          </Fragment>
        ))}
        {/*<Col span={1} className={styles.text}>*/}
        {/*  到*/}
        {/*</Col>*/}
        {/*<Col span={11}>*/}
        {/*  <Input*/}
        {/*    type="number"*/}
        {/*    defaultValue={rule.to}*/}
        {/*    style={{ width: "98%" }}*/}
        {/*    addonAfter="列"*/}
        {/*    min="1"*/}
        {/*    onChange={(e) => inputHandler(e, 1)}*/}
        {/*  />*/}
        {/*</Col>*/}
        <DeleteOutlined
          className={styles.delete}
          onClick={() => deleteRule(taskIndex, ruleIndex)}
        />
      </Row>
    </>
  );
};

export default Rule;

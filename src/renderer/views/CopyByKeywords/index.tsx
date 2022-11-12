import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Button, Spin, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import BackButton from "@/components/BackButton";
import FileSelectList from "@/components/CopyByKeywords/FileSelectList";
import TaskList from "@/components/CopyByKeywords/TaskList";
import styles from "./index.module.scss";

const CopyByKeywords: React.FC = () => {
  const taskList = useAppSelector((state) => state.CopyByKeywords.taskList);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    window.electronAPI.executeCopyByKeywordsCallback((_e, res) => {
      setIsProcessing(false);
      if (res) {
        Modal.success({
          title: "文件合并成功",
          content: (
            <div>
              <p>合并的文件以保存到目标文件所属的文件夹中</p>
              <p>并且命名以 (合并文件).xlsx 结尾</p>
            </div>
          )
        });
      } else {
        Modal.error({
          title: "文件合并失败",
          content: (
            <div>
              <p>可能出现了意料之外的故障</p>
              <p>请联系开发人员 1319433916@qq.com</p>
            </div>
          )
        });
      }
    });
  }, []);

  const execute = () => {
    setIsProcessing(true);
    window.electronAPI.executeCopyByKeywords(taskList);
  };

  return (
    <>
      <Spin
        style={{ position: "fixed", maxHeight: "unset" }}
        spinning={isProcessing}
        indicator={<LoadingOutlined />}
      >
        <div className={styles["app_container"]}>
          <BackButton />
          <FileSelectList />
          <TaskList />
          <Button
            className={styles["center-button"]}
            type="primary"
            onClick={execute}
            block
          >
            执行
          </Button>
        </div>
      </Spin>
    </>
  );
};

export default CopyByKeywords;

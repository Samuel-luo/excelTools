import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFile } from "@/store/CopyByKeywords";
import { Button, Card, Col, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileSelectList: React.FC = () => {
  const fileMap = useAppSelector((state) => state.CopyByKeywords.fileMap);
  const dispatch = useAppDispatch();

  const getFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.multiple = true;
    input.onchange = () => {
      let len = input.files.length;
      while (--len > -1) {
        const path: string = input.files[len].path;
        const name: string = input.files[len].name;
        if (!fileMap[path]) {
          dispatch(setFile({ path, name }));
        }
      }
    };
    input.click();
  };

  return (
    <>
      <Card>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <Button type="primary" icon={<UploadOutlined />} onClick={getFile}>
              选择文件
            </Button>
            <div style={{ marginTop: "14px" }}>已选文件列表：</div>
            {[...Object.values(fileMap)].map((item, index) => (
              <div
                key={index}
                style={{
                  marginTop: !index ? "10px" : "",
                  textDecoration: "underline"
                }}
              >
                {item}
              </div>
            ))}
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default FileSelectList;

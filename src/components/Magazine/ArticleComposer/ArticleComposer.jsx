import React, { useState } from "react";
import { Form, Input, Button, Upload, App as AntdApp } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { resizeImage } from "../../../utils/utils";
import {
  Wrap,
  ToggleBtn,
  Panel,
  PanelTitle,
  Preview,
} from "./styled";
import { createArticle } from "./utils";

export const ArticleComposer = ({ articles, onSaveArticles }) => {
  const { message } = AntdApp.useApp();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageData, setImageData] = useState("");

  const resetAll = () => {
    form.resetFields();
    setImageData("");
  };

  const handleBeforeUpload = async (file) => {
    try {
      const dataUrl = await resizeImage(file, 1000, 0.82);
      setImageData(dataUrl);
    } catch (e) {
      message.error("Non sono riuscito a leggere questa immagine");
    }
    return false; // impedisce l'upload automatico di antd, gestiamo il file noi
  };

  const handleSubmit = async (values) => {
    const newArticle = createArticle(values, imageData);
    const ok = await onSaveArticles([newArticle, ...articles]);
    if (ok) {
      setOpen(false);
      resetAll();
      message.success("Articolo pubblicato");
    } else {
      message.error("Errore nel salvataggio");
    }
  };

  return (
    <Wrap>
      <ToggleBtn icon={<PlusOutlined />} onClick={() => setOpen((o) => !o)}>
        Scrivi un articolo
      </ToggleBtn>

      {open && (
        <Panel>
          <PanelTitle>Nuovo articolo</PanelTitle>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{ author: "Admin" }}
          >
            <Form.Item
              label="Titolo"
              name="title"
              rules={[{ required: true, message: "Inserisci un titolo" }]}
            >
              <Input placeholder="Es. Colpo di scena in vetta alla classifica" />
            </Form.Item>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Form.Item label="Firma" name="author">
                <Input placeholder="Admin" />
              </Form.Item>
              <Form.Item label="Sommario (una riga)" name="excerpt">
                <Input placeholder="Riassunto breve dell'articolo" />
              </Form.Item>
            </div>

            <Form.Item
              label="Testo dell'articolo"
              name="body"
              rules={[
                {
                  required: true,
                  message: "Scrivi il contenuto dell\u2019articolo",
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Scrivi qui il contenuto..."
              />
            </Form.Item>

            <Form.Item label="Foto">
              <Upload
                beforeUpload={handleBeforeUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Carica immagine</Button>
              </Upload>
              {imageData && (
                <Preview>
                  <img src={imageData} alt="Anteprima" />
                </Preview>
              )}
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 10 }}
              >
                Pubblica articolo
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  resetAll();
                }}
              >
                Annulla
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      )}
    </Wrap>
  );
};

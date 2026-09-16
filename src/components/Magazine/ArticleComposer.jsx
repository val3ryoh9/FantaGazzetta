import React, { useState } from "react";
import styled from "styled-components";
import { Form, Input, Button, Upload, App as AntdApp } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { uid, resizeImage } from "../../utils";
import { theme } from '../../GlobalStyle'

const Wrap = styled.div`
  margin-bottom: 26px;
`;

const ToggleBtn = styled(Button)`
  && {
    background: ${theme.colors.pitch};
    border-color: ${theme.colors.pitch};
    color: ${theme.colors.paper};
    font-family: ${theme.fonts.display};
    font-weight: 600;
    height: auto;
    padding: 9px 18px;
    &:hover {
      background: ${theme.colors.pitchDark} !important;
      color: ${theme.colors.paper} !important;
    }
  }
`;

const Panel = styled.div`
  margin-top: 14px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.line};
  border-top: 3px solid ${theme.colors.gold};
  padding: 22px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.pitchDark};
`;

const Preview = styled.div`
  margin-top: 10px;
  max-height: 180px;
  overflow: hidden;
  border: 1px solid ${theme.colors.line};
  img {
    width: 100%;
    object-fit: cover;
  }
`;

export default function ArticleComposer({ articles, onSaveArticles }) {
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
    const excerpt = (values.excerpt || "").trim() || values.body.slice(0, 140);
    const newArticle = {
      id: uid(),
      title: values.title.trim(),
      author: (values.author || "Admin").trim() || "Admin",
      excerpt,
      body: values.body.trim(),
      image: imageData,
      date: new Date().toISOString(),
    };
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
}

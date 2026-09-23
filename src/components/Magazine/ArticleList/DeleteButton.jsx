import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const DeleteButton = ({ onConfirm }) => (
  <Popconfirm
    title="Eliminare questo articolo?"
    okText="Elimina"
    cancelText="Annulla"
    onConfirm={onConfirm}
  >
    <Button
      size="small"
      danger
      type="text"
      icon={<DeleteOutlined />}
      onClick={(e) => e.stopPropagation()}
    >
      Elimina
    </Button>
  </Popconfirm>
);

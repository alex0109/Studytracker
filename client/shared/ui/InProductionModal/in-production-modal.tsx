import React, { FC } from "react";
import { Modal } from "../Modal";
import { Button } from "@/shared/radix-ui";

interface InProductionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const InProductionModal: FC<InProductionModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="In development"
      description="Unfortunately, this feature in development right now"
      footer={
        <Button size="lg" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      }
    />
  );
};

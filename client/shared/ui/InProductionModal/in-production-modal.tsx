import React, { FC } from "react";
import { Title } from "../Title";
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
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="w-[400px]">
        <Title text="In development" />
        <div className="w-full">
          <p>Unfortunately, this feature in development right now</p>
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
        <Button
          size="lg"
          className="w-30 my-5"
          onClick={() => setIsOpen(false)}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

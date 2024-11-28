import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Image,
  Box,
} from "@chakra-ui/react";
const ActivityImageModal = ({ imageUrl, isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"4xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="95%" m="auto">
              <Image
                src={imageUrl}
                alt="Activity Image"
                boxSize="100%"
                objectFit="contain"
                borderRadius="lg"
                shadow="md"
                w="50rem"
                h="30rem"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActivityImageModal;

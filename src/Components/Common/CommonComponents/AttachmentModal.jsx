import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Wrap,
  WrapItem,
  Box,
  Image,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
const AttachmentModal = ({
  isOpen,
  onClose,
  data,
  selectedImage,
  setSelectedImage,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const imagesPerPage = 4;
  const totalImages = data?.attachment?.length || 0;
  const visibleImages = data?.attachment?.slice(
    startIndex,
    startIndex + imagesPerPage
  );
  const handleNext = () => {
    if (startIndex + imagesPerPage < totalImages) {
      setStartIndex(startIndex + imagesPerPage);
    }
  };
  const handlePrev = () => {
    if (startIndex - imagesPerPage >= 0) {
      setStartIndex(startIndex - imagesPerPage);
    }
  };
  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose} size={"4xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attachments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Box w="95%" m="auto">
                <Image
                  src={selectedImage?.url}
                  alt="Selected Attachment"
                  boxSize="100%"
                  objectFit="contain"
                  borderRadius="lg"
                  shadow="md"
                  w="50rem"
                  h="30rem"
                />
              </Box>
              <HStack justify={"center"} mt="2rem" align={"center"} spacing={6}>
                <IconButton
                  icon={<ArrowBackIcon />}
                  onClick={handlePrev}
                  isDisabled={startIndex === 0}
                  aria-label="Previous"
                />
                <Wrap mt="2rem" spacing={6} justify={"center"}>
                  {visibleImages?.map((el, i) => (
                    <WrapItem key={i}>
                      <Box
                        borderRadius="md"
                        overflow="hidden"
                        boxSize="80px"
                        border={
                          el?.url === selectedImage?.url
                            ? "3px solid #0065ff"
                            : "2px solid transparent"
                        }
                        _hover={{
                          cursor: "pointer",
                          border: "2px solid #0065ff",
                        }}
                        onClick={() => setSelectedImage(el)}
                        shadow={el?.url === selectedImage?.url ? "md" : "sm"}
                      >
                        <Image
                          src={el?.url}
                          alt={`attachment-${i}`}
                          boxSize="100%"
                          objectFit="cover"
                        />
                      </Box>
                    </WrapItem>
                  ))}
                </Wrap>
                <IconButton
                  icon={<ArrowForwardIcon />}
                  onClick={handleNext}
                  isDisabled={startIndex + imagesPerPage >= totalImages}
                  aria-label="Next"
                />
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AttachmentModal;

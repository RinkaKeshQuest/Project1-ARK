import {
    Box,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { SprintsAtom } from "../../Atoms/AtomStores";
import { useAtom } from "jotai";
import { generalFunction } from "../../assets/Config/generalFunction";
import axios from "axios";

const CreateSprint = ({ isOpen, onClose }) => {
    const [sprintsAtom, setSprintsAtom] = useAtom(SprintsAtom);
    const [data, setData] = useState({
        startDate: "",
        endDate: "",
    });

    // ---------------------------------------- Normal functions ----------------------------------------

    //---------------------------------------- Api calls ----------------------------------------
    const handleSubmit = () => {
        generalFunction.showLoader();
        let request = generalFunction.createUrl(`sprints`);
        axios
            .post(request.url, data, { headers: request.headers })
            .then((res) => {
                generalFunction.hideLoader();
                if (res.data.success) {
                    setSprintsAtom([...sprintsAtom, res.data.data]);
                    onClose();
                }
            })
            .catch((err) => {
                generalFunction.hideLoader();
                console.log(err);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xs">
            <ModalOverlay />
            <ModalContent borderRadius="20px">
                <ModalHeader px="20px" pt="20px">
                    <p>Create Sprint</p>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px="28px">
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            base: "repeat(1, 1fr)",
                            // md: "repeat(2, 1fr)",
                        }}
                        fontSize="14px"
                    >
                        <Box
                            display="flex"
                            w="100%"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Text color="#979797">Start Date</Text>
                            <Input
                                type="date"
                                w="fit-content"
                                p="12px 8px"
                                border="none"
                                appearance="none"
                                fontSize="14px"
                                color="#696969"
                                fontWeight="bold"
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        startDate: e.target.value,
                                    })
                                }
                            />
                        </Box>
                        <Box
                            display="flex"
                            w="100%"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Text color="#979797">End Date</Text>
                            <Input
                                type="date"
                                w="fit-content"
                                p="12px 8px"
                                border="none"
                                appearance="none"
                                fontSize="14px"
                                color="#696969"
                                fontWeight="bold"
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        endDate: e.target.value,
                                    })
                                }
                            />
                        </Box>
                    </Box>
                </ModalBody>
                <ModalFooter pb="40px" px="56px">
                    <Button mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Create Sprint
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateSprint;

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
} from "@chakra-ui/react";
import ReactECharts from "echarts-for-react";
import { importConfig } from "../../assets/Config/importConfig";
import { Link } from "react-router-dom";
const headerStyles = {
  TO_DO: {
    bg: "#0D0D0D14",
    text: "#535353",
    textColor: "#535353",
  },
  IN_PROGRESS: {
    bg: "#E1E1FB",
    text: "#0065FF",
    textColor: "#0065FF",
  },
  CLOSED: {
    bg: "#C2F0D9",
    text: "#098849",
    textColor: "#098849",
  },
};
const PieChartDetailModal = ({
  isOpen,
  onClose,
  content,
  pieChartOptions,
  memoizedPieChartData,
}) => {
  const [modalContent, setModalContent] = useState(content);
  
  useEffect(() => {
    if (content?.data?.name) {
      setModalContent(content);
    }
  }, [content]);
  const onChartClick = useCallback(
    (params) => {
      if (modalContent?.data?.name !== params.name) {
        setModalContent({
          data: {
            name: params.name,
          },
        });
      }
    },
    [modalContent]
  );

  const onChartEvents = useMemo(
    () => ({
      click: onChartClick,
    }),
    [onChartClick]
  );
  const selectedUser = useMemo(() => {
    if (modalContent?.data?.name) {
      return memoizedPieChartData.find(
        (user) => user.name === modalContent.data.name
      );
    }
    return content ? memoizedPieChartData.find(
      (user) => user.name === content.data.name
    ) : null;
  }, [modalContent, memoizedPieChartData, content]);
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent
          mt="10rem"
          maxW="74rem"
          h="auto"
          p="2.5rem"
          borderRadius={"1.25rem"}
        >
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w="100%"
              justifyContent="space-between"
              align={"center"}
              h="100%"
            >
              <Box
                w="47%"
                h="100%"
                boxShadow="2px 2px 4px 0px rgba(200, 200, 200, 0.20)"
                display={"flex"}
                justifyContent={"center"}
                alignItems={"start"}
              >
                <ReactECharts
                  option={pieChartOptions}
                  style={{ height: "400px", width: "100%" }}
                  notMerge={true}
                  lazyUpdate={true}
                  onEvents={onChartEvents}
                />
              </Box>
              <Flex direction={"column"} gap={"1rem"} w="47%" h="400px">
                <Box h="2.75rem" w="100%">
                  <Text
                    color="#181818"
                    fontSize={"2.25rem"}
                    fontWeight={600}
                    lineHeight={"2.75rem"}
                    letterSpacing={"-0.045rem"}
                  >
                    {/* {modalContent
                      ? modalContent.data.name
                      : content?.data?.name} */}
                    {selectedUser
                      ? selectedUser.name
                      : content?.data?.name || "Select a User"}
                  </Text>
                </Box>
                <Box boxShadow="2px 2px 4px 0px rgba(200, 200, 200, 0.16)">
                  <TableContainer
                    fontFamily={"Figtree"}
                    overflowY="auto"
                    maxHeight="calc(24rem - 48px)"
                  >
                    <Table size="sm" variant='simple'>
                      <Thead
                        position="sticky"
                        top="0"
                        bg="white"
                        zIndex="docked"
                      >
                        <Tr>
                          <Th
                            color={"#2C2C2C"}
                            lineHeight={"1.25rem"}
                            fontWeight={600}
                            fontSize={"0.875rem"}
                            py="12px"
                            px="16px"
                            fontFamily={"Figtree"}
                          >
                            Task Name
                          </Th>
                          <Th
                            color={"#2C2C2C"}
                            lineHeight={"1.25rem"}
                            fontWeight={600}
                            fontSize={"0.875rem"}
                            py="12px"
                            px="16px"
                            fontFamily={"Figtree"}
                            textAlign={"center"}
                          >
                            Status
                          </Th>
                          <Th
                            color={"#2C2C2C"}
                            lineHeight={"1.25rem"}
                            fontWeight={600}
                            fontSize={"0.875rem"}
                            py="12px"
                            px="16px"
                            fontFamily={"Figtree"}
                          >
                            Sprint Point
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody overflowY={"scroll"}>
                        {selectedUser && selectedUser.tasks.length > 0 ? (
                          selectedUser.tasks.map((el) => (
                            <Tr
                              h="2.75rem"
                              key={`${selectedUser._id}-${el._id}`}
                            >
                              <Td
                                color="#3E3E3E"
                                fontSize={"0.875rem"}
                                fontWeight={400}
                                lineHeight={"1.25rem"}
                                py="12px"
                                px="16px"
                                fontFamily={"Figtree"}
                                display={"flex"}
                                alignItems={"center"}
                                gap={"0.5rem"}
                                borderBottom="none"
                              >
                                <Box>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="9"
                                    viewBox="0 0 8 9"
                                    fill="none"
                                  >
                                    <path
                                      d="M3.9974 1.1665C2.15406 1.1665 0.664062 2.6565 0.664062 4.49984C0.664062 6.34317 2.15406 7.83317 3.9974 7.83317C5.84073 7.83317 7.33073 6.34317 7.33073 4.49984C7.33073 2.6565 5.84073 1.1665 3.9974 1.1665Z"
                                      fill={headerStyles[el.status]?.textColor}
                                    />
                                  </svg>
                                </Box>
                                <Link to={`/sprints/${el.sprintId}?type=view&taskId=${el.taskId}`} className="hover:underline hover:text-[#0065FF]">{el.title}</Link>
                              </Td>
                              <Td
                                fontSize={"0.75rem"}
                                fontWeight={600}
                                lineHeight={"1rem"}
                                fontFamily={"Figtree"}
                                w={"fit-content"}
                                py="12px"
                                px="16px"
                                borderBottom="none"
                              >
                                <Box
                                  display={"flex"}
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  borderRadius={"0.25rem"}
                                  bg={headerStyles[el.status]?.bg}
                                  color={headerStyles[el.status]?.text}
                                  px="12px"
                                  py="4px"
                                >
                                  {el.status}
                                </Box>
                              </Td>
                              <Td
                                color="#3E3E3E"
                                fontSize={"0.875rem"}
                                fontWeight={400}
                                lineHeight={"1.25rem"}
                                py="12px"
                                px="16px"
                                fontFamily={"Figtree"}
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                gap={"0.5rem"}
                                borderBottom="none"
                              >
                                <Image
                                  src={importConfig.project.sprintPoint}
                                  alt="Sprint Point"
                                  w="1.25rem"
                                />
                                <Text>
                                  {el.sprintPoints?el.sprintPoints:"-"}
                                </Text>
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          // <Tr>
                          //   <Td colSpan={3}>
                          //     <Text
                          //       color="#808080"
                          //       fontSize={"0.875rem"}
                          //       fontWeight={400}
                          //       lineHeight={"1.25rem"}
                          //       fontFamily={"Figtree"}
                          //       textAlign="center"
                          //     >
                          //       Select User to Check the Tasks
                          //     </Text>
                          //   </Td>
                          // </Tr>
                          null
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PieChartDetailModal;

import React, { useRef, useState, useEffect } from "react";
import {
    Avatar,
    AvatarGroup,
    Box,
    Image,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { PlusSVG, StarSVG } from "../Common/SideBarSvg";
import DescriptionEditor from "../Tasks/DescriptionEditor";
import { importConfig } from "../../assets/Config/importConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, set } from "date-fns";
import AttachmentModal from "../Common/CommonComponents/AttachmentModal";
const AllController = ({
    data,
    setData,
    dataForStyle,
    setDataForStyle,
    allUsersAtom,
    status,
    priority,
    tag,
    handleAssigneeChange,
    handleFileChange,
    fileInputRef,
    imageData,
    setImageData,
    discardChanges,
    handleUpdate,
    openConditionalSave,
    initialConfig,
}) => {
    const descriptionEditorRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(
        data?.dueDate ? new Date(data.dueDate) : null
    );
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null)
    useEffect(() => {
        if (data?.dueDate) {
            setSelectedDate(new Date(data.dueDate));
        }
    }, [data?.dueDate]);
    const handleDateChange = (date) => {
        if (date) {
            const adjustedDate = new Date(date.setHours(0, 0, 0, 0)); 
            setSelectedDate(adjustedDate);
    
            setData({
                ...data,
                dueDate: adjustedDate,
            });
        } else {
            setSelectedDate(null);
            setData({
                ...data,
                dueDate: "",
            });
        }
        // setSelectedDate(date);
        // setData({
        //     ...data,
        //     dueDate: date ? date.toISOString().split("T")[0] : "",
        // });
    };
    const dateConverter = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return "-";
        const day = date.getDate().toString().padStart(2, "0");
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const month = monthNames[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        const formattedDate = `${day} ${month} ${year}`;

        return formattedDate;
    };
function modalOpen(){
    setModalIsOpen(true);
}
function handleAttachmentClick(attachment){
    setSelectedImage(attachment);
    setModalIsOpen(true);
}
function modalClose(){
    setModalIsOpen(false);
    setSelectedImage(null);
}

    return (
        <Box>
            <Box
                display="grid"
                gridTemplateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                }}
                w={{
                    base: "100%",
                    md: "70%",
                }}
                columnGap="40px"
                fontSize="14px"
            >
                <Box
                    display="flex"
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Status</Text>
                    <Box w="120px" padding={"12px 8px"}>
                        <Menu closeOnSelect={true}>
                            <MenuButton
                                backgroundColor={
                                    dataForStyle?.status?.background
                                }
                                border={`1px solid ${dataForStyle?.status?.borderColor}`}
                                color={dataForStyle?.status?.color}
                                padding="4px 12px"
                                fontWeight="bold"
                                fontSize="12px"
                                borderRadius="4px"
                                w="fit-content"
                            >
                                {dataForStyle?.status?.title}
                            </MenuButton>
                            <MenuList minWidth="100px">
                                {status?.map((el, i) => (
                                    <MenuItem
                                        key={i}
                                        value={el.value}
                                        backgroundColor={el.background}
                                        border={`1px solid ${el.borderColor}`}
                                        color={el.color}
                                        m="auto"
                                        marginY="10px"
                                        borderRadius="4px"
                                        w="fit-content"
                                        fontSize="12px"
                                        fontWeight="bold"
                                        padding="4px 12px"
                                        onClick={() => {
                                            setData({
                                                ...data,
                                                status: el.value,
                                            });
                                            setDataForStyle({
                                                ...dataForStyle,
                                                status: el,
                                            });
                                        }}
                                    >
                                        {el.title}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Assignee</Text>
                    <Box w="120px">
                        <Menu closeOnSelect={false}>
                            <MenuButton>
                                {dataForStyle?.assignee?.length ? (
                                    <AvatarGroup size="xs" max={4}>
                                        {dataForStyle?.assignee?.map(
                                            (el, i) => (
                                                <Avatar
                                                    key={i}
                                                    name={el.name}
                                                    src={el.avatar}
                                                />
                                            )
                                        )}
                                    </AvatarGroup>
                                ) : (
                                    <Text
                                        fontSize="12px"
                                        fontWeight="bold"
                                        color="#979797"
                                    >
                                        Select assignee
                                    </Text>
                                )}
                            </MenuButton>
                            <MenuList minWidth="240px">
                                <MenuOptionGroup
                                    type="checkbox"
                                    onChange={(e) => handleAssigneeChange(e)}
                                    value={dataForStyle?.assignee}
                                >
                                    {allUsersAtom?.map((el, i) => (
                                        <MenuItemOption
                                            key={i}
                                            value={el}
                                            // onClick={() => {
                                            //     setData({...data, assignee: el.firstname})
                                            // }}
                                        >
                                            <Box className="flex items-center gap-2">
                                                {!!el?.avatar ? (
                                                    <Image
                                                        src={el.avatar}
                                                        alt="avatar"
                                                        width="24px"
                                                        height="24px"
                                                        borderRadius="100%"
                                                    />
                                                ) : (
                                                    <Avatar
                                                        name={el?.name}
                                                        avatar={el?.avatar}
                                                        size="xs"
                                                    />
                                                )}
                                                <p>{el.name}</p>
                                            </Box>
                                        </MenuItemOption>
                                    ))}
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Sprint Point</Text>
                    <Box
                        display="flex"
                        w="120px"
                        alignItems="center"
                        gap="4px"
                        padding="12px 8px"
                        cursor={"pointer"}
                    >
                        <StarSVG />
                        <Menu closeOnSelect={true}>
                            <MenuButton
                                fontWeight="bold"
                                fontSize="14px"
                                color="#696969"
                                w="100%"
                            >
                                <p>
                                    {data?.sprintPoints
                                        ? data?.sprintPoints
                                        : "-"}
                                </p>
                            </MenuButton>
                            <MenuList minWidth="240px">
                                <MenuOptionGroup
                                    type="radio"
                                    value={Number(data?.sprintPoints)}
                                >
                                    <MenuItemOption
                                        value=""
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                sprintPoints: "",
                                            })
                                        }
                                    >
                                        -
                                    </MenuItemOption>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                        (el, i) => (
                                            <MenuItemOption
                                                key={i}
                                                value={el}
                                                onClick={() =>
                                                    setData({
                                                        ...data,
                                                        sprintPoints: el,
                                                    })
                                                }
                                            >
                                                {el}
                                            </MenuItemOption>
                                        )
                                    )}
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Priority</Text>
                    <Box
                        display="flex"
                        w="120px"
                        alignItems="center"
                        gap="4px"
                        padding="12px 8px"
                        cursor={"pointer"}
                    >
                        {dataForStyle?.priority?.icon}
                        <Menu closeOnSelect={true}>
                            <MenuButton
                                fontWeight="bold"
                                fontSize="14px"
                                color="#696969"
                                w="100%"
                            >
                                <p>
                                    {dataForStyle?.priority?.title
                                        ? dataForStyle?.priority?.title
                                        : "-"}
                                </p>
                            </MenuButton>
                            <MenuList minWidth="120px">
                                {priority?.map((el, i) => (
                                    <MenuItem
                                        key={i}
                                        value={el.value}
                                        onClick={() => {
                                            setData({
                                                ...data,
                                                priority: el.value,
                                            });
                                            setDataForStyle({
                                                ...dataForStyle,
                                                priority: el,
                                            });
                                        }}
                                        display={"flex"}
                                        alignItems="center"
                                        gap="4px"
                                    >
                                        {el.icon}
                                        <Text>{el.title}</Text>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Due Date</Text>
                    <Box>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            customInput={
                                <Box
                                    p="12px 8px"
                                    borderRadius="md"
                                    cursor="pointer"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    bg="#fff"
                                    gap={"8px"}
                                >
                                    <Image
                                        src={importConfig.project.calenderSvg}
                                    />
                                    <Text
                                        fontSize="14px"
                                        color="#696969"
                                        fontWeight="bold"
                                    >
                                        {selectedDate
                                            ? format(
                                                  selectedDate,
                                                  "dd MMM yyyy"
                                              )
                                            : "Select Date"}
                                    </Text>
                                </Box>
                            }
                            popperPlacement="bottom"
                        />
                    </Box>
                </Box>
                <Box
                    display="flex"
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Tag</Text>
                    <Box w="120px">
                        <Box
                            display="flex"
                            w="fit-content"
                            alignItems="center"
                            gap="4px"
                            padding="4px 12px"
                            cursor={"pointer"}
                            borderRadius="4px"
                            bg={dataForStyle?.tag?.background}
                            color={dataForStyle?.tag?.color}
                        >
                            <Box w="12px" h="12px">
                                {dataForStyle?.tag?.icon}
                            </Box>
                            <Menu closeOnSelect={true}>
                                <MenuButton
                                    fontWeight="bold"
                                    fontSize="14px"
                                    w="100%"
                                >
                                    <p>
                                        {dataForStyle?.tag?.title
                                            ? dataForStyle?.tag?.title
                                            : "-"}
                                    </p>
                                </MenuButton>
                                <MenuList minWidth="120px">
                                    {tag?.map((el, i) => (
                                        <MenuItem
                                            key={i}
                                            value={el.value}
                                            backgroundColor={el.background}
                                            color={el.color}
                                            m="auto"
                                            marginY="10px"
                                            borderRadius="4px"
                                            w="fit-content"
                                            fontSize="12px"
                                            fontWeight="bold"
                                            padding="4px 12px"
                                            onClick={() => {
                                                setData({
                                                    ...data,
                                                    tag: el.value,
                                                });
                                                setDataForStyle({
                                                    ...dataForStyle,
                                                    tag: el,
                                                });
                                            }}
                                        >
                                            {el.title}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box mt="16px" position={"relative"}>
                <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>
                    Description
                </Text>
                <Box
                    fontSize="14px"
                    mt="2px"
                    // fontWeight="bold"
                    color="#696969"
                    border="1px solid #C9C9C9"
                    borderRadius="12px"
                    height="150px"
                    _hover={{
                        border: "1px solid #C9C9C9",
                    }}
                    p="8px 16px"
                    position="relative"
                >
                    <DescriptionEditor
                        ref={descriptionEditorRef}
                        onChange={(e) =>
                            setData({
                                ...data,
                                description: e.target.value,
                            })
                        }
                        value={data?.description}
                    />
                </Box>
            </Box>
            <Box border="1px solid #C9C9C9" borderRadius="12px" mt="16px">
                <Text
                    p="12px 16px"
                    color="#2C2C2C"
                    fontSize="14px"
                    fontWeight={600}
                    lineHeight={"1.25rem"}
                >
                    Attachments
                </Text>
                <Box className="flex flex-col w-full px-2">
                    {data?.attachment?.map((el, i) => (
                        <Box
                            key={i}
                            width="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            gap="8px"
                            cursor={"pointer"}
                            color="#808080"
                            padding={"8px"}
                            onClick={()=>handleAttachmentClick(el)}
                        >
                            <p>{el?.name}</p>
                            <Box
                                onClick={(e) =>{
                                    e.stopPropagation();
                                    setData({
                                        ...data,
                                        attachment: data.attachment.filter(
                                            (el, index) => index != i
                                        ),
                                    })
                                }
                                }
                            >
                                <Image
                                    src={importConfig.project.deleteIcon}
                                    alt="deleteIcon"
                                />
                            </Box>
                        </Box>
                    ))}
                    {imageData?.map((el, i) => (
                        <Box
                            key={i}
                            width="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            gap="8px"
                            cursor={"pointer"}
                            color="#808080"
                            padding={"8px"}
                        >
                            <p>{el?.name}</p>
                            <Box
                                onClick={() =>
                                    setImageData(
                                        imageData.filter(
                                            (el, index) => index != i
                                        )
                                    )
                                }
                            >
                                <Image
                                    src={importConfig.project.deleteIcon}
                                    alt="deleteIcon"
                                />
                            </Box>
                        </Box>
                    ))}
                    {/* {initialConfig?.type === "view" && openConditionalSave && (
                        <Box className="flex justify-end mt-8">
                            <Button mr={3} onClick={discardChanges}>
                                Discard
                            </Button>
                            <Button colorScheme="blue" onClick={handleUpdate}>
                                Save Changes
                            </Button>
                        </Box>
                    )} */}
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    gap="8px"
                    w="fit-content"
                    cursor={"pointer"}
                    color="#808080"
                    padding={"12px 16px"}
                    onClick={() => fileInputRef.current.click()}
                >
                    <PlusSVG />
                    <p>Add Attachment</p>
                </Box>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    multiple
                />
            </Box>
            <AttachmentModal isOpen={modalIsOpen} onClose={modalClose} data={data} selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
        </Box>
    );
};

export default AllController;

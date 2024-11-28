import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Divider,
    Image,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
    Textarea,
} from "@chakra-ui/react";
import {
    AttachmentSVG,
    CrossSVG,
    EmojiSVG,
    PlusSVG,
    PrioritySVG,
    SendSVG,
    StarSVG,
    TagSVG,
    ThreeDotSVG,
} from "../Common/SideBarSvg";
import { useEffect, useRef, useState } from "react";
import {
    ActivitiesAtom,
    AllUserAtom,
    ProjectsAtom,
    SprintsAtom,
    TasksAtom,
} from "../../Atoms/AtomStores";
import { useAtom } from "jotai";
import { generalFunction } from "../../assets/Config/generalFunction";
import axios from "axios";
import {
    priorityConfig,
    statusConfig,
    tagConfig,
} from "../Common/commonConfig";
import TextEditorInput from "./TextEditorInput";
import { Toast } from "@questlabs/react-sdk";
import DescriptionEditor from "./DescriptionEditor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { importConfig } from "../../assets/Config/importConfig";
import AttachmentModal from "../Common/CommonComponents/AttachmentModal";
import ActivityImageModal from "./ActivityImageModal";
const convertDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");

    return `${formattedDay}/${formattedMonth}`;
};

const findStatus = (status) => {
    return statusConfig.find((el) => el.value == status);
};

const CreateTask = ({ isOpen, onClose, initialConfig, setSearchParams }) => {
    const fileInputRef = useRef(null);
    const textEditorRef = useRef(null);
    const descriptionEditorRef = useRef(null);
    const searchAsigneeRef = useRef(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
    const [projectsAtom, setProjectsAtom] = useAtom(ProjectsAtom);
    const [sprintsAtom, setSprintsAtom] = useAtom(SprintsAtom);
    const [tasksAtom, setTasksAtom] = useAtom(TasksAtom);
    const [dataForStyle, setDataForStyle] = useState({
        status: {
            title: "To Do",
            value: "TO_DO",
            background: "#C9C9C9",
            borderColor: "#808080",
            color: "#535353",
        },
        priority: {
            title: "Normal",
            value: "NORMAL",
            icon: <PrioritySVG state={"normal"} />,
        },
        tag: {
            title: "Task",
            value: "TASK",
            background: "#E1E1FB",
            color: "#8090FF",
            icon: <TagSVG color={"#8090FF"} />,
        },
        assignee: [],
        project: {},
        sprint: {},
    });
    const [data, setData] = useState({
        title: "",
        status: "TO_DO",
        sprintPoints: "",
        dueDate: "",
        assignee: [],
        priority: "NORMAL",
        tag: "TASK",
        projectId: "",
        sprintId: "",
        attachment: [],
    });
    const [openConditionalSave, setOpenConditionalSave] = useState(false);
    const [apiCallComplete, setApiCallComplete] = useState(false);
    const [oldData, setOldData] = useState({});
    const [activitiesAtom, setActivitiesAtom] = useAtom(ActivitiesAtom);
    const [comment, setComment] = useState("");
    const bottomRef = useRef(null);
    const attachmentRef = useRef(null);
    const [imageData, setImageData] = useState([]);
    const [commentFiles, setCommentFiles] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        data?.dueDate ? new Date(data.dueDate) : null
    );
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedActivityImage, setSelectedActivityImage] = useState(null)
    const [activityImageModal, setActivityImageModal] = useState(false)
    const [userAsignee, setUserAsignee] = useState([])
    const [searchAsignee, setSearchAsignee] = useState("")
    const [editActivityData, setEditActivityData] = useState(null)






    //---------------------------------------- Api calls ----------------------------------------
    const handleSubmit = async () => {
        generalFunction.showLoader();
        let imageLink = [];
        if (imageData.length) {
            let links = await Promise.all(
                imageData.map((el) => {
                    return generalFunction.uploadImageToBackend(el);
                })
            );
            imageLink = links.map((el, i) => {
                return { url: el.data.imageUrl, name: imageData[i].name };
            });
        }

        let request = generalFunction.createUrl(`tasks`);
        axios
            .post(
                request.url,
                { ...data, attachment: imageLink },
                { headers: request.headers }
            )
            .then((res) => {
                generalFunction.hideLoader();
                if (res.data.success) {
                    setTasksAtom([...tasksAtom, res.data.data]);
                    closeModal();
                    Toast.success({
                        text: "Task Created Successfully",
                      });
                }
            })
            .catch((err) => {
                generalFunction.hideLoader();
                Toast.error({
                    text: "Error Occurred" + "\n" + err.message,
                  });
                console.log(err);
            });
    };

    const getTaskData = (taskId) => {
        generalFunction.showLoader();
        let request = generalFunction.createUrl(`tasks/${taskId}`);
        axios
            .get(request.url, { headers: request.headers })
            .then((res) => {
                generalFunction.hideLoader();
                if (res.data.success) {
                    setData(res.data.data);
                    setOldData(res.data.data);
                    setActivitiesAtom(res.data.data.activities);
                    setDataForStyle({
                        ...dataForStyle,
                        status: findStatus(res.data.data.status),
                        priority: priorityConfig.find(
                            (el) => el.value === res.data.data.priority
                        ),
                        tag: tagConfig.find(
                            (el) => el.value === res.data.data.tag
                        ),
                        assignee: allUsersAtom.filter((ele) =>
                            res.data.data.assignee.includes(ele.userId)
                        ),
                        project: projectsAtom.find(
                            (el) => el.projectId === res.data.data.projectId
                        ),
                        sprint: sprintsAtom.find(
                            (el) => el.sprintId === res.data.data.sprintId
                        ),
                    });
                    setApiCallComplete(true);
                }
            })
            .catch((err) => {
                generalFunction.hideLoader();
                console.log(err);
            });
    };

    const updateTask = async () => {
        generalFunction.showLoader();
        let imageLink = [];
        if (imageData.length) {
            let links = await Promise.all(
                imageData.map((el) => {
                    return generalFunction.uploadImageToBackend(el);
                })
            );
            imageLink = links.map((el, i) => {
                return { url: el.data.imageUrl, name: imageData[i].name };
            });
        }

        let request = generalFunction.createUrl(
            `tasks/${initialConfig?.taskId}`
        );
        axios
            .patch(
                request.url,
                { ...data, attachment: [...data.attachment, ...imageLink] },
                { headers: request.headers }
            )
            .then((res) => {
                generalFunction.hideLoader();
                if (res.data.success) {
                    let tasks = tasksAtom.map((el) => {
                        if (el.taskId == initialConfig?.taskId) {
                            return res.data.data;
                        } else {
                            return el;
                        }
                    });
                    setTasksAtom([...tasks]);
                    setOldData(res.data.data);
                    if (res?.data?.activities?.length) {
                        setActivitiesAtom([
                            ...activitiesAtom,
                            ...res?.data?.activities,
                        ]);
                    }
                    setOpenConditionalSave(false);
                    setImageData([]);
                    Toast.success({
                        text: "Task Updated Successfully",
                      });
                }
            })
            .catch((err) => {
                generalFunction.hideLoader();
                console.log(err);
                Toast.error({
                    text: "Error Occurred" + "\n" + err.message,
                  });
            });
    };

    const removeEmptyTags = (html) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        const elements = wrapper.querySelectorAll("p, ol, ul");

        elements.forEach((element) => {
            if (!element.textContent.trim()) {
                element.remove();
            }
        });

        return wrapper.innerHTML;
    };

    const uploadImages = async () => {
        if (commentFiles.length) {
            generalFunction.showLoader();
            let links = await Promise.all(
                commentFiles.map((el) => {
                    return generalFunction.uploadImageToBackend(el);
                })
            );
            return links.map((el, i) => {
                return { url: el.data.imageUrl, name: commentFiles[i].name };
            });
        }
        return [];
    };

    const sendActivity = async () => {
        let cleanHtml = removeEmptyTags(comment);
        let images = await uploadImages();
        if (cleanHtml.trim() == "" && images.length == 0) {
            return;
        }

        generalFunction.showLoader();
        let request = generalFunction.createUrl(`activities`);
        axios
            .post(
                request.url,
                {
                    activityType: "TASK_COMMENTED",
                    activityValue: {
                        comment: cleanHtml,
                        ...(images.length && { attachment: images }),
                    },
                    taskId: initialConfig?.taskId,
                },
                { headers: request.headers }
            )
            .then((res) => {
                generalFunction.hideLoader();
                if (res.data.success) {
                    setActivitiesAtom([...activitiesAtom, ...res.data.data]);
                }
                setComment("");
                setCommentFiles([]);
                textEditorRef.current?.resetEditor();
            })
            .catch((err) => {
                generalFunction.hideLoader();
                console.log(err);
                Toast.error({
                    text: "Error Occurred" + "\n" + err.message,
                  });
            });
    };

    const editActivity = async (activityId, comment) => {
        setEditActivityData(activitiesAtom.find(el => el._id === activityId))
        setComment(comment)
        textEditorRef.current?.insertEditor(comment)
    }

    const updateActivity = async () => {
        generalFunction.showLoader();
        const clearComment = removeEmptyTags(comment)
        let updatedBody = {...editActivityData, activityValue: {...editActivityData.activityValue, comment: clearComment}}
        let request = generalFunction.createUrl(`activities/${editActivityData._id}`);
        axios
            .patch(
                request.url,
                updatedBody,
                { headers: request.headers }
            )
            .then((res) => {
                generalFunction.hideLoader();
                if (res.data.success) {
                    setActivitiesAtom(activitiesAtom.map(el => el._id === editActivityData._id ? res.data.data : el))
                    setEditActivityData(null)
                }
            })
            .catch((err) => {
                generalFunction.hideLoader();
                console.log(err);
                Toast.error({
                    text: "Error Occurred" + "\n" + err.message,
                  });
            });
        setComment("")
        setCommentFiles([])
        textEditorRef.current?.resetEditor()
        setEditActivityData(null)
    }

    const deleteActivity = async (activityId) => {
        generalFunction.showLoader();
        let request = generalFunction.createUrl(`activities/${activityId}`);
        axios
            .delete(request.url, { headers: request.headers })
            .then((res) => {
                generalFunction.hideLoader();
                if (res.data.success) {
                    setActivitiesAtom(activitiesAtom.filter(el => el._id !== activityId))
                }
            })
            .catch((err) => {
                generalFunction.hideLoader();
                console.log(err);
                Toast.error({
                    text: "Error Occurred" + "\n" + err.message,
                });
            });

            setComment("")
            setCommentFiles([])
            textEditorRef.current?.resetEditor()
            setEditActivityData(null)
    }





    // ---------------------------------------- Normal functions ----------------------------------------
    useEffect(() => {
        if (searchAsignee) {
            setUserAsignee(allUsersAtom.filter(el => el.name.toLowerCase().includes(searchAsignee.toLowerCase())))
        } else {
            setUserAsignee(allUsersAtom)
        }
    }, [searchAsignee, allUsersAtom])

    useEffect(() => {
        searchAsigneeRef.current?.focus()
    }, [searchAsignee, userAsignee]);

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
    const handleFileChange = (event, type) => {
        let maxSize = 1024 * 1024;
        let files = [];

        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];

            if (file && file.size > maxSize) {
                Toast.error({
                    text: "File is too large. Please select a file smaller than 1MB.",
                });
            } else {
                files.push(file);
            }
        }
        if (type == "comment") {
            setCommentFiles([...commentFiles, ...files]);
        } else {
            setImageData([...imageData, ...files]);
        }
        event.target.value = null;
    };

    const handleAssigneeChange = (selectedAssignees) => {
        setData({
            ...data,
            assignee: selectedAssignees.map((ele) => ele.userId),
        });
        setDataForStyle({ ...dataForStyle, assignee: selectedAssignees });
    };

    const closeModal = () => {
        setSearchParams({});
        onClose();
        setOpenConditionalSave(false);
        setApiCallComplete(false);
        setShowEmojiPicker(false);
        setSelectedDate(null);
        setImageData([]);
        setData({
            title: "",
            status: "TO_DO",
            sprintPoints: "",
            dueDate: "",
            assignee: [],
            priority: "NORMAL",
            tag: "TASK",
            projectId: "",
            sprintId: "",
        });
        setDataForStyle({
            status: {
                title: "To Do",
                value: "TO_DO",
                background: "#C9C9C9",
                borderColor: "#808080",
                color: "#535353",
            },
            priority: {
                title: "Normal",
                value: "NORMAL",
                icon: <PrioritySVG state={"normal"} />,
            },
            tag: {
                title: "Task",
                value: "TASK",
                background: "#E1E1FB",
                color: "#8090FF",
                icon: <TagSVG color={"#8090FF"} />,
            },
            assignee: [],
            project: {},
            sprint: {},
        });
    };

    const discardChanges = () => {
        setData({ ...data, ...oldData });
        setDataForStyle({
            ...dataForStyle,
            status: findStatus(oldData.status),
            priority: priorityConfig.find(
                (el) => el.value === oldData.priority
            ),
            tag: tagConfig.find((el) => el.value === oldData.tag),
            assignee: allUsersAtom.filter((ele) =>
                oldData.assignee.includes(ele.userId)
            ),
            project: projectsAtom.find(
                (el) => el.projectId === oldData.projectId
            ),
            sprint: sprintsAtom.find((el) => el.sprintId === oldData.sprintId),
        });
        setOpenConditionalSave(false);
    };

    const dateConverter = (dateStr) => {
        const date = new Date(dateStr);
      
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

    useEffect(() => {
        if (initialConfig?.projectId || initialConfig?.sprintId) {
            setData({
                ...data,
                ...(initialConfig?.projectId && {
                    projectId: initialConfig?.projectId,
                }),
                ...(initialConfig?.sprintId && {
                    sprintId: initialConfig?.sprintId,
                }),
            });

            setDataForStyle({
                ...dataForStyle,
                ...(initialConfig?.projectId && {
                    project: projectsAtom.find(
                        (el) => el.projectId === initialConfig?.projectId
                    ),
                }),
                ...(initialConfig?.sprintId && {
                    sprint: sprintsAtom.find(
                        (el) => el.sprintId === initialConfig?.sprintId
                    ),
                }),
            });
        }

        if (initialConfig?.status) {
            setData({ ...data, status: initialConfig?.status });
            setDataForStyle({
                ...dataForStyle,
                status: statusConfig.find(
                    (el) =>
                        el.value.toLowerCase() ===
                        initialConfig?.status?.toLowerCase()
                ),
            });
        }

        if (initialConfig?.type === "view") {
            getTaskData(initialConfig?.taskId);
        }
    }, [initialConfig]);

    useEffect(() => {
        if (
            (apiCallComplete &&
                JSON.stringify(oldData) != JSON.stringify(data)) ||
            imageData.length
        ) {
            setOpenConditionalSave(true);
        } else {
            setOpenConditionalSave(false);
        }
    }, [data, imageData]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activitiesAtom]);

    const handleCommentChange = (content) => {
        setComment(content);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const closeEmojiPicker = (e) => {
        if (document.getElementById("emoji-picker")?.contains(e.target)) {
        } else if (
            document.getElementById("emoji-button")?.contains(e.target)
        ) {
        } else {
            setShowEmojiPicker(false);
        }
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
    const handleOpen = (url) => {
        setSelectedActivityImage(url)
        setActivityImageModal(true)
      };
      const handleCloseActivityModal = () => {
        setSelectedActivityImage(null)
        setActivityImageModal(false)
      }
    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            size={initialConfig?.type === "view" ? "6xl" : "4xl"}
        >
            <ModalOverlay />
            <ModalContent borderRadius="20px">
                {/* <ModalHeader px="40px" pt="40px">
                </ModalHeader> */}
                <ModalCloseButton />
                <ModalBody
                    px="40px"
                    display="flex"
                    onClick={(e) => closeEmojiPicker(e)}
                >
                    <Box
                        className={`${
                            initialConfig?.type === "view" ? "w-3/5" : "w-full"
                        } pb-10 max-h-[640px] overflow-y-auto`}
                    >
                        <Box className="py-5">
                            <input
                                placeholder="Add a title"
                                className="text-[36px] font-bold text-[#181818] border-none outline-none p-0 w-full"
                                value={data.title}
                                onChange={(e) =>
                                    setData({ ...data, title: e.target.value })
                                }
                            />
                        </Box>
                        <Box
                            display="grid"
                            gridTemplateColumns={{
                                base: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                            }}
                            w={{
                                base: "100%",
                                md:
                                    initialConfig?.type === "view"
                                        ? "80%"
                                        : "70%",
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
                                        <MenuList minWidth="120px">
                                            {statusConfig.map((el, i) => (
                                                <MenuItem
                                                    key={i}
                                                    value={el?.value}
                                                    backgroundColor={
                                                        el?.background
                                                    }
                                                    border={`1px solid ${el?.borderColor}`}
                                                    color={el?.color}
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
                                                            status: el?.value,
                                                        });
                                                        setDataForStyle({
                                                            ...dataForStyle,
                                                            status: el,
                                                        });
                                                    }}
                                                >
                                                    {el?.title}
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
                                            {dataForStyle.assignee.length ? (
                                                <AvatarGroup size="xs" max={4}>
                                                    {dataForStyle.assignee.map(
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
                                        <MenuList minWidth="240px" maxHeight={"200px"} overflowY={"auto"}>
                                            <input 
                                                placeholder="Search Assignee" 
                                                type="text" 
                                                value={searchAsignee} 
                                                ref={searchAsigneeRef} 
                                                className="w-full border-none outline-none py-2 px-4 rounded-lg" 
                                                onChange={(e) => setSearchAsignee(e.target.value)}
                                            />
                                            <Divider/>
                                            <MenuOptionGroup
                                                type="checkbox"
                                                onChange={(e) =>
                                                    handleAssigneeChange(e)
                                                }
                                                value={dataForStyle.assignee}
                                            >
                                                {userAsignee?.map((el, i) => (
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
                                                                    src={
                                                                        el.avatar
                                                                    }
                                                                    alt="avatar"
                                                                    width="24px"
                                                                    height="24px"
                                                                    borderRadius="100%"
                                                                />
                                                            ) : (
                                                                <Avatar
                                                                    name={
                                                                        el?.name
                                                                    }
                                                                    avatar={
                                                                        el?.avatar
                                                                    }
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
                                                    ? data.sprintPoints
                                                    : "-"}
                                            </p>
                                        </MenuButton>
                                        <MenuList minWidth="240px">
                                            <MenuOptionGroup
                                                type="radio"
                                                value={Number(
                                                    data.sprintPoints
                                                )}
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
                                                {[
                                                    1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                    10,
                                                ].map((el, i) => (
                                                    <MenuItemOption
                                                        key={i}
                                                        value={el}
                                                        onClick={() =>
                                                            setData({
                                                                ...data,
                                                                sprintPoints:
                                                                    el,
                                                            })
                                                        }
                                                    >
                                                        {el}
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
                                <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Priority</Text>
                                <Box
                                    display="flex"
                                    w="120px"
                                    alignItems="center"
                                    gap="4px"
                                    padding="12px 8px"
                                    cursor={"pointer"}
                                >
                                    {dataForStyle.priority.icon}
                                    <Menu closeOnSelect={true}>
                                        <MenuButton
                                            fontWeight="bold"
                                            fontSize="14px"
                                            color="#696969"
                                            w="100%"
                                        >
                                            <p>
                                                {dataForStyle?.priority?.title
                                                    ? dataForStyle?.priority
                                                          ?.title
                                                    : "-"}
                                            </p>
                                        </MenuButton>
                                        <MenuList minWidth="120px">
                                            {priorityConfig.map((el, i) => (
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
                                <Box w="120px">
                                    <DatePicker
                                        selected={data?.dueDate}
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
                                                    src={
                                                        importConfig.project
                                                            .calenderSvg
                                                    }
                                                />
                                                <Text
                                                    fontSize="12px"
                                                    color="#696969"
                                                    fontWeight="bold"
                                                >
                                                    {data?.dueDate
                                                        ? dateConverter(data?.dueDate)
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
                                        bg={dataForStyle.tag.background}
                                        color={dataForStyle.tag.color}
                                    >
                                        <Box w="12px" h="12px">
                                            {dataForStyle.tag.icon}
                                        </Box>
                                        <Menu closeOnSelect={true}>
                                            <MenuButton
                                                fontWeight="bold"
                                                fontSize="14px"
                                                w="100%"
                                            >
                                                <p>
                                                    {dataForStyle?.tag?.title
                                                        ? dataForStyle?.tag
                                                              ?.title
                                                        : "-"}
                                                </p>
                                            </MenuButton>
                                            <MenuList minWidth="120px">
                                                {tagConfig.map((el, i) => (
                                                    <MenuItem
                                                        key={i}
                                                        value={el.value}
                                                        backgroundColor={
                                                            el.background
                                                        }
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
                            <Box
                                display="flex"
                                w="100%"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Project</Text>
                                <Box
                                    display="flex"
                                    w="120px"
                                    alignItems="center"
                                    gap="4px"
                                    padding="12px 8px"
                                    cursor={"pointer"}
                                >
                                    <Menu closeOnSelect={true}>
                                        <MenuButton
                                            fontWeight="bold"
                                            fontSize="14px"
                                            color="#696969"
                                            w="100%"
                                        >
                                            <p>
                                                {dataForStyle?.project?.title
                                                    ? dataForStyle?.project
                                                          ?.title
                                                    : "-"}
                                            </p>
                                        </MenuButton>
                                        {!!initialConfig?.disable &&
                                        !!initialConfig?.disable?.includes(
                                            "project"
                                        ) ? null : (
                                            <MenuList minWidth="240px">
                                                <MenuOptionGroup
                                                    type="radio"
                                                    value={data.projectId}
                                                >
                                                    <MenuItemOption
                                                        value=""
                                                        onClick={() => {
                                                            setData({
                                                                ...data,
                                                                projectId: "",
                                                            });
                                                            setDataForStyle({
                                                                ...dataForStyle,
                                                                project: {},
                                                            });
                                                        }}
                                                    >
                                                        -
                                                    </MenuItemOption>
                                                    {projectsAtom?.map(
                                                        (el, i) => (
                                                            <MenuItemOption
                                                                key={i}
                                                                value={
                                                                    el.projectId
                                                                }
                                                                onClick={() => {
                                                                    setData({
                                                                        ...data,
                                                                        projectId:
                                                                            el.projectId,
                                                                    });
                                                                    setDataForStyle(
                                                                        {
                                                                            ...dataForStyle,
                                                                            project:
                                                                                el,
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                {el.title}
                                                            </MenuItemOption>
                                                        )
                                                    )}
                                                </MenuOptionGroup>
                                            </MenuList>
                                        )}
                                    </Menu>
                                </Box>
                            </Box>
                            <Box
                                display="flex"
                                w="100%"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>Sprint</Text>
                                <Box
                                    display="flex"
                                    w="120px"
                                    alignItems="center"
                                    gap="4px"
                                    padding="12px 8px"
                                    cursor={"pointer"}
                                >
                                    <Menu closeOnSelect={true}>
                                        <MenuButton
                                            fontWeight="bold"
                                            fontSize="14px"
                                            color="#696969"
                                            w="100%"
                                        >
                                            <p>
                                                {dataForStyle?.sprint?.startDate
                                                    ? convertDate(
                                                          dataForStyle?.sprint
                                                              ?.startDate
                                                      ) +
                                                      " - " +
                                                      convertDate(
                                                          dataForStyle?.sprint
                                                              ?.endDate
                                                      )
                                                    : "-"}
                                            </p>
                                        </MenuButton>
                                        {!!initialConfig?.disable &&
                                        !!initialConfig?.disable?.includes(
                                            "sprint"
                                        ) ? null : (
                                            <MenuList minWidth="240px">
                                                <MenuOptionGroup
                                                    type="radio"
                                                    value={data.sprintId}
                                                >
                                                    <MenuItemOption
                                                        value=""
                                                        onClick={() => {
                                                            setData({
                                                                ...data,
                                                                sprintId: "",
                                                            });
                                                            setDataForStyle({
                                                                ...dataForStyle,
                                                                sprint: {},
                                                            });
                                                        }}
                                                    >
                                                        -
                                                    </MenuItemOption>
                                                    {sprintsAtom.map(
                                                        (el, i) => (
                                                            <MenuItemOption
                                                                key={i}
                                                                value={
                                                                    el.sprintId
                                                                }
                                                                onClick={() => {
                                                                    setData({
                                                                        ...data,
                                                                        sprintId:
                                                                            el.sprintId,
                                                                    });
                                                                    setDataForStyle(
                                                                        {
                                                                            ...dataForStyle,
                                                                            sprint: el,
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                {convertDate(
                                                                    el.startDate
                                                                ) +
                                                                    " - " +
                                                                    convertDate(
                                                                        el.endDate
                                                                    )}
                                                            </MenuItemOption>
                                                        )
                                                    )}
                                                </MenuOptionGroup>
                                            </MenuList>
                                        )}
                                    </Menu>
                                </Box>
                            </Box>
                        </Box>
                        <Box mt="16px">
                            <Text color="#979797" fontSize={"0.875rem"} lineHeight={"1.25rem"} fontWeight={500}>
                                Description
                            </Text>
                            {/* <Textarea
                                placeholder="Write your Task Description.."
                                fontSize="14px"
                                mt="2px"
                                fontWeight="bold"
                                color="#696969"
                                value={data.description}
                                border="1px solid #C9C9C9"
                                borderRadius="12px"
                                minHeight="150px"
                                _hover={{
                                    border: "1px solid #C9C9C9",
                                }}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        description: e.target.value,
                                    })
                                }
                            /> */}
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
                                position={"relative"}
                                p="8px 16px"
                            >
                                <DescriptionEditor
                                    ref={descriptionEditorRef}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            description: e.target.value,
                                        })
                                    }
                                    value={data.description}
                                />
                            </Box>
                        </Box>
                        <Box
                            border="1px solid #C9C9C9"
                            borderRadius="12px"
                            mt="16px"
                        >
                            <Text
                                p="12px 16px"
                                color="#2C2C2C"
                                fontSize="14px"
                                fontWeight={600}
                                lineHeight={"1.25rem"}
                            >
                                Attachments
                            </Text>
                            <Box className="flex flex-col w-full px-2 min-h-10">
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
                                        <p className="text-[#696969] text-sm font-medium">
                                            {el.name}
                                        </p>
                                        <Box
                                            onClick={(e) =>{
                                                e.stopPropagation();
                                                setData({
                                                    ...data,
                                                    attachment:
                                                    data.attachment.filter(
                                                        (el, index) =>
                                                            index != i
                                                    ),
                                                })
                                            }
                                            }
                                        >
                                            {/* <ThreeDotSVG /> */}
                                            <Image
                                                src={
                                                    importConfig.project
                                                        .deleteIcon
                                                }
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
                                        <p className="text-[#696969] text-sm font-medium">
                                            {el.name}
                                        </p>
                                        <Box
                                            onClick={() =>{
                                                e.stopPropagation();
                                                setImageData(
                                                    imageData.filter(
                                                        (el, index) =>
                                                            index != i
                                                    )
                                                )
                                            }
                                            }
                                        >
                                            {/* <ThreeDotSVG /> */}
                                            <Image
                                                src={
                                                    importConfig.project
                                                        .deleteIcon
                                                }
                                                alt="deleteIcon"
                                            />
                                        </Box>
                                    </Box>
                                ))}
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
                                multiple
                                ref={fileInputRef}
                            />
                        </Box>
                        {initialConfig?.type !== "view" && (
                            <Box className="flex justify-end mt-8">
                                <Button mr={3} onClick={closeModal}>
                                    Close
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    onClick={handleSubmit}
                                >
                                    Create Task
                                </Button>
                            </Box>
                        )}
                        {initialConfig?.type === "view" &&
                            openConditionalSave && (
                                <Box className="flex justify-end mt-8">
                                    <Button mr={3} onClick={discardChanges}>
                                        Discard
                                    </Button>
                                    <Button
                                        colorScheme="blue"
                                        onClick={updateTask}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                    </Box>
                    {initialConfig?.type === "view" && (
                        <Box className="w-2/5 ml-5 mr-3 my-5 max-h-[590px] ">
                            <Box className="px-4 pt-4 pb-2 flex gap-2 items-center bg-[#1c1c1c]/5 rounded-t-lg">
                                <Box className="activity-round"></Box>
                                <Text className="text-[#696969] text-base font-semibold">
                                    Activity
                                </Text>
                            </Box>
                            <Box
                                className={`${
                                    (commentFiles.length || editActivityData?.activityValue?.attachment?.length)
                                        ? "h-[calc(100%-285px)]"
                                        : "h-[calc(100%-215px)]"
                                } overflow-y-auto py-2 text-xs bg-[#1c1c1c]/5`}
                            >
                                {!activitiesAtom.length ? (
                                    <Box className="flex justify-center items-center h-full">
                                        <Text>No activity available</Text>
                                    </Box>
                                ) : (
                                    <Box className="flex flex-col gap-2 w-full h-full">
                                        {generalFunction
                                            .createActivityMessage({
                                                activities: activitiesAtom,
                                                users: allUsersAtom,
                                                handleOpen,
                                                editActivity,
                                                deleteActivity,
                                            })
                                            .map((el, i) => (
                                                <Box key={i} ref={bottomRef}>
                                                    {el}
                                                </Box>
                                            ))}
                                            <ActivityImageModal isOpen={activityImageModal} onClose={handleCloseActivityModal} imageUrl={selectedActivityImage}/>
                                    </Box>
                                )}
                            </Box>
                            <Box className="p-2 bg-[#1c1c1c]/5 rounded-b-lg relative">
                                <Box
                                    className={`px-2 py-1 border ${
                                        (commentFiles.length || editActivityData?.activityValue?.attachment?.length)
                                            ? "h-[230px]"
                                            : "h-[160px]"
                                    } border-[#C9C9C9] rounded-lg bg-white`}
                                >
                                    <div
                                        className={
                                            (commentFiles.length || editActivityData?.activityValue?.attachment?.length)
                                                ? "h-[calc(100%-110px)]"
                                                : "h-[calc(100%-40px)]"
                                        }
                                    >
                                        <TextEditorInput
                                            ref={textEditorRef}
                                            onChange={handleCommentChange}
                                            showEmojiPicker={showEmojiPicker}
                                            value={comment}
                                        />
                                    </div>
                                    {editActivityData?.activityValue?.attachment?.length ? (
                                        <Box className="flex gap-2 items-center h-[70px] overflow-x-auto">
                                            {editActivityData?.activityValue?.attachment.map((el, i) => (
                                                <Box
                                                    key={i}
                                                    className="flex gap-2 items-center relative group justify-center"
                                                >
                                                    <img
                                                        src={el?.url}
                                                        className="w-fit h-[70px]"
                                                        alt="attachment"
                                                    />
                                                    <div
                                                        className="text-[#696969] text-sm font-medium hidden w-5 h-5 cursor-pointer items-center justify-center rounded-full bg-gray-200 absolute group-hover:flex"
                                                        onClick={() => {
                                                            setEditActivityData({
                                                                ...editActivityData,
                                                                activityValue: {
                                                                    ...editActivityData?.activityValue,
                                                                    attachment: editActivityData?.activityValue?.attachment.filter(
                                                                        (
                                                                            el,
                                                                            index
                                                                        ) =>
                                                                            index !=
                                                                            i
                                                                    ),
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        <CrossSVG />
                                                    </div>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : null}
                                    {commentFiles.length ? (
                                        <Box className="flex gap-2 items-center h-[70px] overflow-x-auto">
                                            {commentFiles.map((el, i) => (
                                                <Box
                                                    key={i}
                                                    className="flex gap-2 items-center relative group justify-center"
                                                >
                                                    <img
                                                        src={URL.createObjectURL(
                                                            el
                                                        )}
                                                        className="w-fit h-[70px]"
                                                        alt="attachment"
                                                    />
                                                    <div
                                                        className="text-[#696969] text-sm font-medium hidden w-5 h-5 cursor-pointer items-center justify-center rounded-full bg-gray-200 absolute group-hover:flex"
                                                        onClick={() => {
                                                            setCommentFiles(
                                                                commentFiles.filter(
                                                                    (
                                                                        el,
                                                                        index
                                                                    ) =>
                                                                        index !=
                                                                        i
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        <CrossSVG />
                                                    </div>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : null}
                                    <Box className="flex items-center justify-between">
                                        <Box className="flex gap-2 items-center">
                                            <div
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    attachmentRef.current.click()
                                                }
                                            >
                                                <AttachmentSVG />
                                                <input
                                                    type="file"
                                                    accept="image/*,.doc,.docx,.xml,.pdf"
                                                    className="hidden"
                                                    ref={attachmentRef}
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            "comment"
                                                        )
                                                    }
                                                    multiple
                                                />
                                            </div>
                                            <button
                                                onClick={toggleEmojiPicker}
                                                id="emoji-button"
                                            >
                                                <EmojiSVG />
                                            </button>
                                        </Box>
                                        <button
                                            className="flex gap-1 items-center px-3 py-2 rounded-md disabled:opacity-50"
                                            style={{
                                                background:
                                                    "var(--button-background)",
                                            }}
                                            onClick={() => {editActivityData != null ? updateActivity() : sendActivity()}}
                                            disabled={removeEmptyTags(comment) == "" && commentFiles.length == 0 && editActivityData?.activityValue?.attachment?.length == 0}
                                        >
                                            <Text className="text-white text-sm font-semibold">
                                                {editActivityData != null ? "Update" : "Send"}
                                            </Text>
                                            <SendSVG />
                                        </button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
            <AttachmentModal isOpen={modalIsOpen} onClose={modalClose} data={data} selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
        </Modal>
    );
};

export default CreateTask;

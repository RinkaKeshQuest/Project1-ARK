import React, { useEffect, useState } from "react";
import DashboardWrapper from "../Common/DashboardWrapper";
import { AsigneeSVG, CalenderSVG, MeModeSVG } from "../Common/SideBarSvg";
import {
    Avatar,
    AvatarGroup,
    Box,
    Divider,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Text,
} from "@chakra-ui/react";
import { AllUserAtom, SprintsAtom, TasksAtom } from "../../Atoms/AtomStores";
import { useAtom } from "jotai";
import CreateTask from "../Tasks/CreateTask";
import { useParams, useSearchParams } from "react-router-dom";
import { generalFunction } from "../../assets/Config/generalFunction";
import axios from "axios";
import { priorityConfig, tagConfig } from "../Common/commonConfig";
import SprintTable from "./SprintTable";
import SprintReport from "./SprintReport";
import { motion } from "framer-motion";
import { containerVariant } from "../../assets/Config/animationVariants";
import { useRef } from "react";
import { Toast } from "@questlabs/react-sdk";
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

const findTag = (tag) => {
    return tagConfig.find((el) => el.value == tag);
};

const findPriority = (priority) => {
    return priorityConfig.find((el) => el.value == priority);
};

const SprintDashboard = () => {
    const { sprintId } = useParams();
    const asigneeRef = useRef(null)
    const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
    const [taskAtom, setTaskAtom] = useAtom(TasksAtom);
    const [filterData, setFilterData] = useState([]);
    const [sprintsAtom, setSprintsAtom] = useAtom(SprintsAtom);
    const [option, setOption] = useState("Sprint Planning");
    const [meMode, setMeMode] = useState(false);
    const [assignees, setAssignees] = useState([]);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [sprintData, setSprintData] = useState({});
    const [userAsignee, setUserAsignee] = useState([])
    const [searchAsignee, setSearchAsignee] = useState("")


    useEffect(() => {
        if (searchAsignee) {
            setUserAsignee(allUsersAtom.filter(el => el.name.toLowerCase().includes(searchAsignee.toLowerCase())))
        } else {
            setUserAsignee(allUsersAtom)
        }
    }, [searchAsignee, allUsersAtom])

    useEffect(() => {
        asigneeRef.current?.focus()
    }, [searchAsignee, userAsignee]);

    useEffect(() => {
        if (meMode && assignees.length) {
            setAssignees([]);
        }
    }, [meMode]);

    useEffect(() => {
        if (assignees.length) {
            setMeMode(false);
        }
    }, [assignees]);

    useEffect(() => {
        fetchAllTasks(sprintId);
    }, [sprintId]);

    useEffect(() => {
        if (!!searchParams.get("type")) {
            setOpenTaskModal(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (sprintsAtom.length) {
            setSprintData(sprintsAtom.find((el) => el.sprintId === sprintId));
        }
    }, [sprintsAtom]);

    useEffect(() => {
        if (taskAtom.length > 0) {
            if (meMode) {
                setFilterData(
                    taskAtom.filter(
                        (el) =>
                            el.assignee.includes(generalFunction.getUserId()) ||
                            el.createdBy === generalFunction.getUserId()
                    )
                );
            } else if (assignees.length) {
                setFilterData(
                    taskAtom.filter((el) => {
                        return assignees.some((assignee) => {
                            return (
                                el.assignee.includes(assignee.userId) ||
                                el.createdBy === assignee.userId
                            );
                        });
                    })
                );
            } else {
                setFilterData(taskAtom);
            }
        } else {
            setFilterData([]);
        }
    }, [taskAtom, meMode, assignees]);

    const openTask = (taskId) => {
        setSearchParams({
            type: "view",
            taskId: taskId,
        });
    };

    const filterUser = (userIds) => {
        return allUsersAtom.filter((el) => userIds.includes(el.userId));
    };

    const fetchAllTasks = async (sprintId) => {
        try {
            generalFunction.showLoader();
            const request = generalFunction.createUrl(
                `sprints/${sprintId}/tasks`
            );
            const response = await axios.get(request.url, {
                headers: request.headers,
            });
            if (response.data.success) {
                setTaskAtom(response.data.data);
            }
            generalFunction.hideLoader();
        } catch (error) {
            console.log(error);
        }
    };

    async function handleDelete(taskId){
        generalFunction.showLoader();
        try {
            let request = generalFunction.createUrl(
                `tasks/${taskId}`
            );
        let res = await axios.delete(request.url, { headers: request.headers });
            if (res.data.success) {
                generalFunction.hideLoader();
                Toast.success({
                    text: "Task Deleted Successfully",
                });
                setTaskAtom(taskAtom.filter((el) => el.taskId !== taskId));
                setFilterData(filterData.filter((el) => el.taskId !== taskId));
            }
        } catch (error) {
            generalFunction.hideLoader();
            console.log(error);
            Toast.error({
                text: "Error Occurred" + "\n" + err.message,
            });
        }
    }
    

    return (
        <DashboardWrapper>
            <motion.div className="w-full h-full p-6"
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            >
                <div className="border-b border-[rgba(38, 50, 56, 0.10)] flex">
                    <p
                        className={`text-[#2c2c2c] text-base font-semibold p-[10px_15px] rounded-t-[10px] cursor-pointer ${
                            option === "Sprint Planning"
                                ? "text-[#0065ff] bg-[#f9f9f9] border-b border-[#004dc7]"
                                : ""
                        }`}
                        onClick={() => setOption("Sprint Planning")}
                    >
                        Sprint Planning
                    </p>
                    <p
                        className={`text-[#2c2c2c] text-base font-semibold p-[10px_15px] rounded-t-[10px] cursor-pointer ${
                            option === "Sprint Report"
                                ? "text-[#0065ff] bg-[#f9f9f9] border-b border-[#004dc7]"
                                : ""
                        }`}
                        onClick={() => setOption("Sprint Report")}
                    >
                        Sprint Report
                    </p>
                </div>
                {option === "Sprint Planning" ? (
                    <motion.div
                    variants={containerVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    >
                        <div className="px-2 py-4 flex items-center gap-2">
                            <div
                                onClick={() => setMeMode(!meMode)}
                                className={`border rounded-full cursor-pointer p-[8px_12px] flex items-center gap-1 w-fit ${
                                    !meMode
                                        ? "bg-[rgba(28, 28, 28, 0.05)] border-[#979797] text-[#979797]"
                                        : "bg-[#E1E1FB] border-[#0065FF] text-[#0065FF]"
                                }`}
                            >
                                <MeModeSVG state={meMode ? "selected" : ""} />
                                <p className="text-xs font-medium">Me Mode</p>
                            </div>
                            <Box w="120px">
                                <Menu closeOnSelect={false}>
                                    <MenuButton>
                                        <Box
                                            className={`border rounded-full cursor-pointer flex items-center gap-1 w-[107px] ${
                                                !assignees.length
                                                    ? "bg-[rgba(28, 28, 28, 0.05)] border-[#979797] text-[#979797] p-[7px_12px]"
                                                    : "bg-[#E1E1FB] border-[#0065FF] text-[#0065FF] p-[5px_12px]"
                                            }`}
                                        >
                                            <AsigneeSVG
                                                state={
                                                    assignees?.length
                                                        ? "selected"
                                                        : ""
                                                }
                                            />
                                            {assignees.length ? (
                                                <AvatarGroup size="xs" max={4}>
                                                    {assignees.map((el, i) => (
                                                        <Avatar
                                                            key={i}
                                                            name={el.name}
                                                            src={el.avatar}
                                                        />
                                                    ))}
                                                </AvatarGroup>
                                            ) : (
                                                <Text
                                                    fontSize="12px"
                                                    fontWeight="bold"
                                                    color="#979797"
                                                >
                                                    Assignees
                                                </Text>
                                            )}
                                        </Box>
                                    </MenuButton>
                                    <MenuList minWidth="240px" maxHeight={"200px"} overflowY={"auto"}>
                                        <input 
                                            placeholder="Search Assignee" 
                                            type="text" 
                                            value={searchAsignee} 
                                            ref={asigneeRef} 
                                            className="w-full border-none outline-none py-2 px-4 rounded-lg" 
                                            onChange={(e) => setSearchAsignee(e.target.value)}
                                        />
                                        <Divider/>
                                        <MenuOptionGroup
                                            type="checkbox"
                                            onChange={(e) => setAssignees(e)}
                                            value={assignees}
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
                                                                src={el.avatar}
                                                                alt="avatar"
                                                                width="24px"
                                                                height="24px"
                                                                borderRadius="100%"
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                name={el?.name}
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
                        </div>
                        <div className="flex gap-10 items-center px-4 py-3">
                            <div className="flex items-center">
                                <p className="text-[#979797] text-sm font-medium w-[110px]">
                                    Start Date
                                </p>
                                <div className="flex items-center gap-2">
                                    <CalenderSVG />
                                    <p className="text-[#696969] text-sm font-medium">
                                        {dateConverter(sprintData?.startDate)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className="text-[#979797] text-sm font-medium w-[110px]">
                                    End Date
                                </p>
                                <div className="flex items-center gap-2">
                                    <CalenderSVG />
                                    <p className="text-[#696969] text-sm font-medium">
                                        {dateConverter(sprintData?.endDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <SprintTable
                            tableType={"TO_DO"}
                            filterData={filterData}
                            setSearchParams={setSearchParams}
                            openTask={openTask}
                            filterUser={filterUser}
                            findTag={findTag}
                            findPriority={findPriority}
                            handleDelete={handleDelete}
                        />
                        <SprintTable
                            tableType={"IN_PROGRESS"}
                            filterData={filterData}
                            setSearchParams={setSearchParams}
                            openTask={openTask}
                            filterUser={filterUser}
                            findTag={findTag}
                            findPriority={findPriority}
                            handleDelete={handleDelete}
                        />
                        <SprintTable
                            tableType={"CLOSED"}
                            filterData={filterData}
                            setSearchParams={setSearchParams}
                            openTask={openTask}
                            filterUser={filterUser}
                            findTag={findTag}
                            findPriority={findPriority}
                            handleDelete={handleDelete}
                        />
                    </motion.div>
                ) : (
                    <SprintReport filterData={filterData} />
                )}
                <CreateTask
                    isOpen={openTaskModal}
                    onClose={() => setOpenTaskModal(false)}
                    setSearchParams={(e) => setSearchParams(e)}
                    initialConfig={{
                        sprintId: sprintId,
                        disable: ["sprint"],
                        type: searchParams.get("type"),
                        status: searchParams.get("status"),
                        ...(searchParams.get("taskId") && {
                            taskId: searchParams.get("taskId"),
                        }),
                    }}
                />
            </motion.div>
        </DashboardWrapper>
    );
};

export default SprintDashboard;

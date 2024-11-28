import React, { useEffect, useRef, useState } from "react";
import { AllUserAtom } from "../../Atoms/AtomStores";
import { useParams, useSearchParams } from "react-router-dom";
import { useAtom } from "jotai";
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
import {
  AsigneeSVG,
  CalenderSVG,
  DeleteSVG,
  DropdownSVG,
  EditSVG,
  PrioritySVG,
  StarSVG,
  ThreeDotSVG,
  PlusSVG,
} from "../Common/SideBarSvg";
import { priorityConfig, tagConfig } from "../Common/commonConfig";
import CreateTask from "../Tasks/CreateTask";
import { motion } from "framer-motion";
import { containerVariant } from "../../assets/Config/animationVariants";
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

const findPriority = (priority) => {
  return priorityConfig.find((el) => el.value == priority);
};

const findTag = (tag) => {
  return tagConfig.find((el) => el.value == tag);
};

const AllTasks = ({ filterData, assignees, setAssignees, handleDelete }) => {
  const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const { projectId } = useParams();
  const [userAsignee, setUserAsignee] = useState([])
  const [searchAsignee, setSearchAsignee] = useState("")
  const projectAsigneeRef = useRef(null)

  const openTask = (e, taskId) => {
    if (document.getElementById("edit-controller").contains(e.target)) {
    } else {
      setSearchParams({
        type: "view",
        taskId: taskId,
      });
    }
  };

  const openTask_two = (e, taskId) => {
    if (document.getElementById("edit-controller_two").contains(e.target)) {
    } else {
      setSearchParams({
        type: "view",
        taskId: taskId,
      });
    }
  };

  const openTask_three = (e, taskId) => {
    if (document.getElementById("edit-controller_three").contains(e.target)) {
    } else {
      setSearchParams({
        type: "view",
        taskId: taskId,
      });
    }
  };

  const filterUser = (userIds) => {
    return allUsersAtom.filter((el) => userIds.includes(el.userId));
  };

  useEffect(() => {
    if (!!searchParams.get("type")) {
      setOpenTaskModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchAsignee) {
        setUserAsignee(allUsersAtom.filter(el => el.name.toLowerCase().includes(searchAsignee.toLowerCase())))
    } else {
        setUserAsignee(allUsersAtom)
    }
  }, [searchAsignee, allUsersAtom])

  useEffect(() => {
      projectAsigneeRef.current?.focus()
  }, [searchAsignee, userAsignee]);

    return (
        <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        >
            <div className='px-2 py-4 flex items-center gap-2'>
                <Box
                    w="120px"
                >
                    <Menu closeOnSelect={false}>
                        <MenuButton>
                            <Box className={`border rounded-full cursor-pointer flex items-center gap-1 w-[107px] ${!assignees.length ? "bg-[rgba(28, 28, 28, 0.05)] border-[#979797] text-[#979797] p-[7px_12px]" : "bg-[#E1E1FB] border-[#0065FF] text-[#0065FF] p-[5px_12px]"}`}>
                                <AsigneeSVG state={assignees?.length ? "selected" : ""}/>
                                {assignees.length ?
                                    <AvatarGroup size='xs' max={4}>
                                        {
                                            assignees.map((el, i) => (
                                                <Avatar key={i} name={el.name} src={el.avatar}/>
                                            ))
                                        }
                                    </AvatarGroup>
                                    :
                                    <Text
                                        fontSize="12px"
                                        fontWeight="bold"
                                        color="#979797"
                                    >
                                        Assignees
                                    </Text>
                                }
                            </Box>
                        </MenuButton>
                        <MenuList minWidth='240px' maxHeight={"200px"} overflowY={"auto"}>
                            <input 
                                placeholder="Search Assignee" 
                                type="text" 
                                value={searchAsignee} 
                                ref={projectAsigneeRef} 
                                className="w-full border-none outline-none py-2 px-4 rounded-lg" 
                                onChange={(e) => setSearchAsignee(e.target.value)}
                            />
                            <Divider/>
                            <MenuOptionGroup type='checkbox' onChange={(e) => setAssignees(e)}>
                            {
                                userAsignee?.map((el, i) => (
                                    <MenuItemOption
                                        key={i}
                                        value={el}
                                        // onClick={() => {
                                        //     setData({...data, assignee: el.firstname})
                                        // }}
                                    >
                                        <Box className="flex items-center gap-2">
                                            {
                                                !!el?.avatar ?
                                                <Image src={el.avatar} alt="avatar" width="24px" height="24px" borderRadius="100%"/> :
                                                <Avatar name={el?.name} avatar={el?.avatar} size="xs"/>
                                            }
                                            <p>{el.name}</p>
                                        </Box>
                                    </MenuItemOption>
                                ))
                            }
                            </MenuOptionGroup>
                        </MenuList>
                    </Menu>
                </Box>
            </div>
            <div className='mt-2 rounded-lg overflow-hidden border border-[#e2e2e2]'>
                <div className='flex items-center gap-2 px-2 py-3 w-full bg-[#0d0d0d]/10 text-[#535353] text-sm font-semibold'>
                    <DropdownSVG/>
                    <p>To Do</p>
                    <p>{filterData.filter(el => el.status == "TO_DO")?.length}</p>
                </div>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_16px] text-left w-[33%]'>Task Name</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Assignee</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Due Date</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Priority</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Sprint Points</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Tag</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[7%]'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterData?.map((el, i) => (
                            el.status == "TO_DO" &&
                            <tr className='*:text-sm *:font-normal *:text-left cursor-pointer' key={i} onClick={(e) => openTask(e, el?.taskId)}>
                                <td className='text-[#3e3e3e] text-sm font-normal p-[12px_16px] text-left w-[33%]'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-2 h-2 rounded-full bg-[#808080]'></div>
                                        <p>{el?.title}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[10px_8px] w-[15%]'>
                                    <AvatarGroup size='xs' max={4}>
                                        {
                                            filterUser(el?.assignee).map((el, i) => (
                                                <Avatar key={i} name={el.name} src={el.avatar}/>
                                            ))
                                        }
                                    </AvatarGroup>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        <CalenderSVG/>
                                        <p>{el?.dueDate ? dateConverter(el?.dueDate) : "-"}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        <PrioritySVG state={el?.priority?.toLowerCase()}/>
                                        <p>{findPriority(el.priority)?.title}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        <StarSVG/>
                                        <p>{el?.sprintPoints || "-"}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        {findTag(el.tag)?.icon}
                                        <p>{findTag(el?.tag)?.title}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[7%]' id='edit-controller'>
                                    <Menu>
                                        <MenuButton mt="5px">
                                            <ThreeDotSVG/>
                                        </MenuButton>
                                        <MenuList minWidth={"100px"}>
                                            <MenuItem>
                                                <Box className='flex items-center gap-2' onClick={()=>handleDelete(el?.taskId)}>
                                                    <DeleteSVG/>
                                                    <Text>Delete</Text>
                                                </Box>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='flex items-center gap-2 px-4 py-3 w-fit cursor-pointer' onClick={() => {
                    setSearchParams({
                        type: "create",
                        status: "TO_DO",
                    })
                }}>
                    <PlusSVG/>
                    <p className='text-[#808080] text-sm font-normal'>Add Task</p>
                </div>
            </div>
            <div className='mt-4 rounded-lg overflow-hidden border border-[#e2e2e2]'>
                <div className='flex items-center gap-2 px-2 py-3 w-full bg-[#E1E1FB] text-[#0065FF] text-sm font-semibold'>
                    <DropdownSVG color={"#0065FF"}/>
                    <p>In Progress</p>
                    <p>{filterData.filter(el => el.status == "IN_PROGRESS")?.length}</p>
                </div>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_16px] text-left w-[33%]'>Task Name</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Assignee</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Due Date</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Priority</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Sprint Points</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]'>Tag</th>
                            <th className='text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[7%]'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterData?.map((el, i) => (
                            el.status == "IN_PROGRESS" &&
                            <tr className='*:text-sm *:font-normal *:text-left cursor-pointer' key={i} onClick={(e) => openTask_two(e, el?.taskId)}>
                                <td className='text-[#3e3e3e] text-sm font-normal p-[12px_16px] text-left w-[33%]'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-2 h-2 rounded-full bg-[#808080]'></div>
                                        <p>{el?.title}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[10px_8px] w-[15%]'>
                                    <AvatarGroup size='xs' max={4}>
                                        {
                                            filterUser(el?.assignee).map((el, i) => (
                                                <Avatar key={i} name={el.name} src={el.avatar}/>
                                            ))
                                        }
                                    </AvatarGroup>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        <CalenderSVG/>
                                        <p>{el?.dueDate ? dateConverter(el?.dueDate) : "-"}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        <PrioritySVG state={el?.priority?.toLowerCase()}/>
                                        <p>{findPriority(el.priority)?.title}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        <StarSVG/>
                                        <p>{el?.sprintPoints || "-"}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[15%]'>
                                    <div className='flex items-center gap-2'>
                                        {findTag(el.tag)?.icon}
                                        <p>{findTag(el?.tag)?.title}</p>
                                    </div>
                                </td>
                                <td className='text-[#808080] p-[12px_8px] w-[7%]' id='edit-controller_two'>
                                    <Menu>
                                        <MenuButton mt="5px">
                                            <ThreeDotSVG/>
                                        </MenuButton>
                                        <MenuList minWidth={"100px"}>
                          <MenuItem>
                            <Box className="flex items-center gap-2" onClick={()=>handleDelete(el?.taskId)}>
                              <DeleteSVG />
                              <Text>Delete</Text>
                            </Box>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
        <div
          className="flex items-center gap-2 px-4 py-3 cursor-pointer w-fit"
          onClick={() => {
            setSearchParams({
              type: "create",
              status: "IN_PROGRESS",
            });
          }}
        >
          <PlusSVG />
          <p className="text-[#808080] text-sm font-normal">Add Task</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg overflow-hidden border border-[#e2e2e2]">
        <div className="flex items-center gap-2 px-2 py-3 w-full bg-[#C2F0D9] text-[#098849] text-sm font-semibold">
          <DropdownSVG color={"#098849"} />
          <p>CLOSED</p>
          <p>{filterData.filter((el) => el.status == "CLOSED")?.length}</p>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-[#2c2c2c] text-sm font-semibold p-[12px_16px] text-left w-[33%]">
                Task Name
              </th>
              <th className="text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]">
                Assignee
              </th>
              <th className="text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]">
                Due Date
              </th>
              <th className="text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]">
                Priority
              </th>
              <th className="text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]">
                Sprint Points
              </th>
              <th className="text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[15%]">
                Tag
              </th>
              <th className="text-[#2c2c2c] text-sm font-semibold p-[12px_8px] text-left w-[7%]"></th>
            </tr>
          </thead>
          <tbody>
            {filterData?.map(
              (el, i) =>
                el.status == "CLOSED" && (
                  <tr
                    className="*:text-sm *:font-normal *:text-left cursor-pointer"
                    key={i}
                    onClick={(e) => openTask_three(e, el?.taskId)}
                  >
                    <td className="text-[#3e3e3e] text-sm font-normal p-[12px_16px] text-left w-[33%]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#808080]"></div>
                        <p>{el?.title}</p>
                      </div>
                    </td>
                    <td className="text-[#808080] p-[10px_8px] w-[15%]">
                      <AvatarGroup size="xs" max={4}>
                        {filterUser(el?.assignee).map((el, i) => (
                          <Avatar key={i} name={el.name} src={el.avatar} />
                        ))}
                      </AvatarGroup>
                    </td>
                    <td className="text-[#808080] p-[12px_8px] w-[15%]">
                      <div className="flex items-center gap-2">
                        <CalenderSVG />
                        <p>{dateConverter(el?.dueDate)}</p>
                      </div>
                    </td>
                    <td className="text-[#808080] p-[12px_8px] w-[15%]">
                      <div className="flex items-center gap-2">
                        <PrioritySVG state={el?.priority?.toLowerCase()} />
                        <p>{findPriority(el.priority)?.title}</p>
                      </div>
                    </td>
                    <td className="text-[#808080] p-[12px_8px] w-[15%]">
                      <div className="flex items-center gap-2">
                        <StarSVG />
                        <p>{el?.sprintPoints}</p>
                      </div>
                    </td>
                    <td className="text-[#808080] p-[12px_8px] w-[15%]">
                      <div className="flex items-center gap-2">
                        {findTag(el.tag)?.icon}
                        <p>{findTag(el?.tag)?.title}</p>
                      </div>
                    </td>
                    <td
                      className="text-[#808080] p-[12px_8px] w-[7%]"
                      id="edit-controller_three"
                    >
                      <Menu>
                        <MenuButton mt="5px">
                          <ThreeDotSVG />
                        </MenuButton>
                        <MenuList minWidth={"100px"}>
                          <MenuItem>
                            <Box className="flex items-center gap-2" onClick={()=>handleDelete(el?.taskId)}>
                              <DeleteSVG />
                              <Text>Delete</Text>
                            </Box>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
        <CreateTask
          isOpen={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          setSearchParams={(e) => setSearchParams(e)}
          initialConfig={{
            projectId: projectId,
            disable: ["project"],
            type: searchParams.get("type"),
            status: searchParams.get("status"),
            ...(searchParams.get("taskId") && {
              taskId: searchParams.get("taskId"),
            }),
          }}
        />
        <div
          className="flex items-center gap-2 px-4 py-3 cursor-pointer w-fit"
          onClick={() => {
            setSearchParams({
              type: "create",
              status: "CLOSED",
            });
          }}
        >
          <PlusSVG />
          <p className="text-[#808080] text-sm font-normal">Add Task</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AllTasks;

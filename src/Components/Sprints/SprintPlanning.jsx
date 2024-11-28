import React, { useEffect, useState } from "react";
import DashboardWrapper from "../Common/DashboardWrapper";
import {
  AsigneeSVG,
  CalenderSVG,
  DeleteSVG,
  DropdownSVG,
  EditSVG,
  MeModeSVG,
  PlusSVG,
  PrioritySVG,
  SprintSVG,
  StarSVG,
  TagSVG,
  ThreeDotSVG,
} from "../Common/SideBarSvg";
import {
  Avatar,
  AvatarGroup,
  Box,
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

const SprintPlanning = () => {
  const { sprintId } = useParams();
  const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
  const [taskAtom, setTaskAtom] = useAtom(TasksAtom);
  const [filterData, setFilterData] = useState([]);
  const [sprintsAtom, setSprintsAtom] = useAtom(SprintsAtom);
  const [meMode, setMeMode] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sprintData, setSprintData] = useState({});
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
    if (taskAtom.length) {
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

  const openTask = (e, taskId) => {
    if (document.getElementById("edit-controller").contains(e.target)) {
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

  const fetchAllTasks = async (sprintId) => {
    try {
      generalFunction.showLoader();
      const request = generalFunction.createUrl(`sprints/${sprintId}/tasks`);
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
  return (
    <div>
      <div className="mt-2 rounded-lg overflow-hidden border border-[#e2e2e2]">
        <div className="flex items-center gap-2 px-2 py-3 w-full bg-[#0d0d0d]/10 text-[#535353] text-sm font-semibold">
          <DropdownSVG />
          <p>To Do</p>
          <p>{filterData.filter((el) => el.status == "TO_DO")?.length}</p>
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
                el.status == "TO_DO" && (
                  <tr
                    className="*:text-sm *:font-normal *:text-left cursor-pointer"
                    key={i}
                    onClick={(e) => openTask(e, el?.taskId)}
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
                      id="edit-controller"
                    >
                      <Menu>
                        <MenuButton mt="5px">
                          <ThreeDotSVG />
                        </MenuButton>
                        <MenuList minWidth={"100px"}>
                          <MenuItem>
                            <Box className="flex items-center gap-2">
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
          className="flex items-center gap-2 px-4 py-3 w-fit cursor-pointer"
          onClick={() => {
            setSearchParams({
              type: "create",
              status: "TO_DO",
            });
          }}
        >
          <PlusSVG />
          <p className="text-[#808080] text-sm font-normal">Add Task</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg overflow-hidden border border-[#e2e2e2]">
        <div className="flex items-center gap-2 px-2 py-3 w-full bg-[#E1E1FB] text-[#0065FF] text-sm font-semibold">
          <DropdownSVG color={"#0065FF"} />
          <p>In Progress</p>
          <p>{filterData.filter((el) => el.status == "IN_PROGRESS")?.length}</p>
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
                el.status == "IN_PROGRESS" && (
                  <tr
                    className="*:text-sm *:font-normal *:text-left cursor-pointer"
                    key={i}
                    onClick={(e) => openTask(e, el?.taskId)}
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
                      id="edit-controller"
                    >
                      <Menu>
                        <MenuButton mt="5px">
                          <ThreeDotSVG />
                        </MenuButton>
                        <MenuList minWidth={"100px"}>
                          <MenuItem>
                            <Box className="flex items-center gap-2">
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
                    onClick={(e) => openTask(e, el?.taskId)}
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
                      id="edit-controller"
                    >
                      <Menu>
                        <MenuButton mt="5px">
                          <ThreeDotSVG />
                        </MenuButton>
                        <MenuList minWidth={"100px"}>
                          <MenuItem>
                            <Box className="flex items-center gap-2">
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
              status: "CLOSED",
            });
          }}
        >
          <PlusSVG />
          <p className="text-[#808080] text-sm font-normal">Add Task</p>
        </div>
      </div>
    </div>
  );
};

export default SprintPlanning;

import React, { useState } from "react";
import {
  CalenderSVG,
  DeleteSVG,
  DropdownSVG,
  PlusSVG,
  PrioritySVG,
  StarSVG,
  ThreeDotSVG,
} from "../Common/SideBarSvg";
import {
  Avatar,
  AvatarGroup,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { generalFunction } from "../../assets/Config/generalFunction";
import { Toast } from "@questlabs/react-sdk";
import axios from "axios";
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
const headerStyles = {
  TO_DO: {
    bg: "bg-[#0D0D0D14]",
    text: "text-[#535353]",
    textColor: "#535353",
  },
  IN_PROGRESS: {
    bg: "bg-[#E1E1FB]",
    text: "text-[#0065FF]",
    textColor: "#0065FF",
  },
  CLOSED: {
    bg: "bg-[#C2F0D9]",
    text: "text-[#098849]",
    textColor: "#098849",
  },
};
const SprintTable = ({
  tableType,
  filterData,
  setSearchParams,
  openTask,
  filterUser,
  findTag,
  findPriority,
  handleDelete
}) => {
  const [open, setOpen] = useState(true);
  

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-[#e2e2e2]">
      <div
        className={`flex items-center gap-2 px-2 py-3 w-full text-sm font-semibold ${
          headerStyles[tableType]?.bg || "bg-default-bg"
        } ${headerStyles[tableType]?.text || "text-default-text"}`}
        onClick={() => setOpen(!open)}
      >
        <div
          className={`flex items-center justify-center duration-300 transition-all ${
            open ? "" : "rotate-180"
          }`}
        >
          <DropdownSVG
            color={headerStyles[tableType]?.textColor || "#535353"}
          />
        </div>
        <p>{tableType}</p>
        <p>{filterData.filter((el) => el.status == tableType)?.length}</p>
      </div>
      <div
        className={`transition-all duration-700 overflow-hidden w-full ${
          open ? "h-fit opacity-100" : "h-0 opacity-0"
        }`}
      >
        <table className={`w-full`}>
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
                el.status == tableType && (
                  <tr
                    className="*:text-sm *:font-normal *:text-left cursor-pointer"
                    key={i}
                  >
                    <td
                      className="text-[#3e3e3e] text-sm font-normal p-[12px_16px] text-left w-[33%]"
                      onClick={(e) => openTask(el?.taskId)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#808080]"></div>
                        <p>{el?.title}</p>
                      </div>
                    </td>
                    <td
                      className="text-[#808080] p-[10px_8px] w-[15%]"
                      onClick={(e) => openTask(el?.taskId)}
                    >
                      <AvatarGroup size="xs" max={4}>
                        {filterUser(el?.assignee).map((el, i) => (
                          <Avatar key={i} name={el.name} src={el.avatar} />
                        ))}
                      </AvatarGroup>
                    </td>
                    <td
                      className="text-[#808080] p-[12px_8px] w-[15%]"
                      onClick={(e) => openTask(el?.taskId)}
                    >
                      <div className="flex items-center gap-2">
                        <CalenderSVG />
                        <p>{el?.dueDate ? dateConverter(el?.dueDate) : "-"}</p>
                      </div>
                    </td>
                    <td
                      className="text-[#808080] p-[12px_8px] w-[15%]"
                      onClick={(e) => openTask(el?.taskId)}
                    >
                      <div className="flex items-center gap-2">
                        <PrioritySVG state={el?.priority?.toLowerCase()} />
                        <p>{findPriority(el.priority)?.title}</p>
                      </div>
                    </td>
                    <td
                      className="text-[#808080] p-[12px_8px] w-[15%]"
                      onClick={(e) => openTask(el?.taskId)}
                    >
                      <div className="flex items-center gap-2">
                        <StarSVG />
                        <p>{el?.sprintPoints || "-"}</p>
                      </div>
                    </td>
                    <td
                      className="text-[#808080] p-[12px_8px] w-[15%]"
                      onClick={(e) => openTask(el?.taskId)}
                    >
                      <div className="flex items-center gap-2">
                        {findTag(el.tag)?.icon}
                        <p>{findTag(el?.tag)?.title}</p>
                      </div>
                    </td>
                    <td className="text-[#808080] p-[12px_8px] w-[7%]">
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
          <div
            className="flex items-center gap-2 px-4 py-3 cursor-pointer w-fit"
            onClick={() => {
              setSearchParams({
                type: "create",
                status: tableType,
              });
            }}
          >
            <PlusSVG />
            <p className="text-[#808080] text-sm font-normal">Add Task</p>
          </div>
        </table>
      </div>
    </div>
  );
};

export default SprintTable;

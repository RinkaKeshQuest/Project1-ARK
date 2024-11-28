import { useEffect, useState } from "react";
import { importConfig } from "../../assets/Config/importConfig";
import {
  Dropdown,
  HelpSVG,
  HomeSVG,
  LogOutSVG,
  PlusSVG,
  ProjectsSVG,
  SettingSVG,
  SprintSVG,
} from "./SideBarSvg";
import { useAtom } from "jotai";
import {
  AllUserAtom,
  ProjectsAtom,
  SprintsAtom,
  TasksAtom,
  UserAtom,
} from "../../Atoms/AtomStores";
import { generalFunction } from "../../assets/Config/generalFunction";
import axios from "axios";
import CreateProject from "../Projects/CreateProject";
import CreateSprint from "../Sprints/CreateSprints";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { sideBarVariant, accordionVariant } from "../../assets/Config/animationVariants";
const convertDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = month.toString().padStart(2, "0");

  return `${formattedDay}/${formattedMonth}`;
};

const DashboardWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Get Started");
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [sprintsAtom, setSprintsAtom] = useAtom(SprintsAtom);
  const [projectAtom, setProjectAtom] = useAtom(ProjectsAtom);
  const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
  const [tasksAtom, setTasksAtom] = useAtom(TasksAtom);
  const [sprintModal, setSprintModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [userAtom, setUserAtom] = useAtom(UserAtom);
  const MotionLink = motion(Link)

  useEffect(() => {
    getInitialData();
    if (generalFunction.getUserRecords()) {
      setUserAtom(generalFunction.getUserRecords());
    }
  }, []);

  useEffect(() => {
    let link = window.location.pathname;

    if (link.includes("/sprints")) {
      setSelected("Sprints");
      setSelectedSprintId(link.split("/")[2]);
    }

    if (link.includes("/project")) {
      setSelected("Projects");
      setSelectedProjectId(link.split("/")[2]);
    }

    if (link == "/") {
      setSelected("Get Started");
    }

    if (link.includes("/settings")) {
      setSelected("Settings");
    }
  }, []);

  const getInitialData = async () => {
    try {
      const request = generalFunction.createUrl(
        `users/${generalFunction.getUserId()}/initial-data?entityId=${generalFunction.getOrganizationId()}`
      );
      axios(request.url, { headers: request.headers }).then((response) => {
        setSprintsAtom(response?.data?.data?.sprints);
        setProjectAtom(response?.data?.data?.projects);
        setAllUsersAtom(response?.data?.data?.users);
      });
    } catch (error) {
      console.log("error", error.message);
    }
  };


  return (
    <div className="flex">
      <div className="w-60 h-screen p-6 border-r border-[rgba(0, 0, 0, 0.10)] flex flex-col">
        <div className="py-6">
          <img
            src={importConfig.dashboard.flatLogo}
            className="w-32 m-auto"
            alt=""
          />
        </div>

        <div className="h-[calc(100vh-200px)] flex flex-col gap-2 overflow-auto">
          <MotionLink
            to="/"
            className={`py-2.5 px-[0.5rem] cursor-pointer flex items-center gap-3 ${
              selected === "Get Started" ? "bg-[#F4F4FF]" : ""
            }`}
            onClick={() => setSelected("Get Started")}
            variants={sideBarVariant}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <HomeSVG state={selected === "Get Started" ? "selected" : "na"} />
            <p
              className={`${
                selected === "Get Started"
                  ? "text-[#0065ff] leading-[1.5rem] font-[500] text-[1rem]"
                  : "text-[#696969] font-[400] leading-[1.5rem] text-[1rem]"
              }`}
            >
              Get Started
            </p>
          </MotionLink>
          <div className="w-full">
            <motion.div
              className={`py-2.5 px-3 cursor-pointer flex items-center justify-between rounded-[4px] ${
                selected === "Sprints" ? "bg-[#F4F4FF]" : ""
              }`}
              onClick={() =>
                setSelected(selected == "Sprints" ? "" : "Sprints")
              }
              variants={sideBarVariant}
              whileHover="whileHover"
              whileTap="whileTap"
            >
              <div className="flex items-center gap-3">
                <SprintSVG state={selected === "Sprints" ? "selected" : "na"} />
                <p
                  className={`${
                    selected === "Sprints"
                      ? "text-[#0065ff] leading-[1.5rem] font-[500] text-[1rem]"
                      : "text-[#696969] font-[400] leading-[1.5rem] text-[1rem]"
                  }`}
                >
                  Sprints
                </p>
              </div>
              <Dropdown />
            </motion.div>
            <AnimatePresence initial={false}>
            {selected === "Sprints" && (
              <motion.div className="ml-5 *:cursor-pointer mt-3"
                variants={accordionVariant}
                initial="hidden"
                animate="visible"
                exit={"exit"}
              >
                {sprintsAtom?.map((sprint, index) => (
                  <MotionLink
                    to={`/sprints/${sprint.sprintId}`}
                    key={index}
                    className={`${
                      selectedSprintId === sprint.sprintId
                        ? "text-[#0065ff] bg-[#F4F4FF] font-[500] leading-[1.25rem] text-[0.875rem]"
                        : "text-[#696969] font-[400] leading-[1.25rem] text-[0.875rem]"
                    } text-sm py-2 px-3 w-full inline-block mt-1 rounded-[4px] hover:bg-[#f4f4ff94]`}
                    onClick={() => setSelectedSprintId(sprint.sprintId)}
                    variants={sideBarVariant}
                    whileHover="whileHover"
                    whileTap="whileTap"
                  >
                    {convertDate(sprint.startDate) +
                      " - " +
                      convertDate(sprint.endDate)}
                  </MotionLink>
                ))}
                <motion.div
                  className="text-[#696969] text-sm py-2 px-3 flex gap-3 items-center cursor-pointer"
                  onClick={() => setSprintModal(true)}
                  variants={sideBarVariant}
                  whileHover="whileHover"
                  whileTap="whileTap"
                >
                  <PlusSVG />
                  <p>Add Sprint</p>
                </motion.div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
          <div className="w-full">
            <motion.div
              className={`py-2.5 px-3 cursor-pointer flex items-center justify-between gap-3 rounded-[4px] ${
                selected === "Projects" ? "bg-[#F4F4FF]" : ""
              }`}
              onClick={() =>
                setSelected(selected == "Projects" ? "" : "Projects")
              }
              variants={sideBarVariant}
          whileHover="whileHover"
          whileTap="whileTap"
            >
              <div className="flex items-center gap-3">
                <ProjectsSVG
                  state={selected === "Projects" ? "selected" : "na"}
                />
                <p
                  className={`${
                    selected === "Projects"
                      ? "text-[#0065ff] leading-[1.5rem] font-[500] text-[1rem]"
                      : "text-[#696969] font-[400] leading-[1.5rem] text-[1rem]"
                  }`}
                >
                  Projects
                </p>
              </div>
              <Dropdown />
            </motion.div>
            <AnimatePresence initial={false}>
            {selected === "Projects" && (
              <motion.div className="ml-5 *:cursor-pointer mt-3"
              variants={accordionVariant}
              initial="hidden"
              animate="visible"
              exit={"exit"}
              >
                {projectAtom?.map((project, index) => (
                  <MotionLink
                    to={`/projects/${project.projectId}`}
                    key={index}
                    className={`${
                      selectedProjectId === project.projectId
                        ? "text-[#0065ff] bg-[#F4F4FF] font-[500] leading-[1.25rem] text-[0.875rem]"
                        : "text-[#696969] font-[400] leading-[1.25rem] text-[0.875rem]"
                    } text-sm py-2 px-3 w-full inline-block rounded-[4px] mt-1 hover:bg-[#f4f4ff94]`}
                    onClick={() => setSelectedProjectId(project.projectId)}
                    variants={sideBarVariant}
                    whileHover="whileHover"
                    whileTap="whileTap"
                  >
                    {project.title}
                  </MotionLink>
                ))}
                <motion.div
                  className="text-[#696969] text-sm py-2 px-3 flex gap-3 items-center cursor-pointer"
                  onClick={() => setProjectModal(true)}
                  variants={sideBarVariant}
                  whileHover="whileHover"
                  whileTap="whileTap"
                >
                  <PlusSVG />
                  <p>Add Project</p>
                </motion.div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
          <MotionLink
            to="/settings"
            className={`py-2.5 px-3 cursor-pointer flex items-center gap-3 ${
              selected === "Settings" ? "bg-[#F4F4FF]" : ""
            }`}
            onClick={() => setSelected("Settings")}
            variants={sideBarVariant}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <SettingSVG state={selected === "Settings" ? "selected" : "na"} />
            <p
              className={`${
                selected === "Settings"
                  ? "text-[#0065ff] leading-[1.5rem] font-[500] text-[1rem]"
                  : "text-[#696969] font-[400] leading-[1.5rem] text-[1rem]"
              }`}
            >
              Settings
            </p>
          </MotionLink>
        </div>

        <div className="flex flex-col gap-4">
          {/* <div className="flex items-center gap-3">
            <HelpSVG />
            <p className="text-[#696969] text-[1rem] font-[400] leading-[1.5rem] hover:cursor-pointer">
              Help
            </p>
          </div> */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              generalFunction.logout();
              navigate("/login");
            }}
            variants={sideBarVariant}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <LogOutSVG />
            <p className="text-[#ED0A34] font-[500] leading-[1.5rem] text-[1rem]">
              Logout
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
            <Avatar name={userAtom?.name} src={userAtom?.avatar} />
            <div className="flex flex-col gap-1">
              <p className="text-[#2f54eb] text-lg font-semibold tracking-[-0.01125rem]">
                {userAtom?.name}
              </p>
              <p className="text-[#030723] text-xs font-medium">
                {userAtom?.companyRole}
              </p>
            </div>
          </div>
        </div>
        <CreateProject
          isOpen={projectModal}
          onClose={() => setProjectModal(false)}
        />
        <CreateSprint
          isOpen={sprintModal}
          onClose={() => setSprintModal(false)}
        />
      </div>
      <div className="w-[calc(100vw-240px)] h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardWrapper;

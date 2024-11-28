import React, { useEffect, useState } from "react";
import DashboardWrapper from "../Common/DashboardWrapper";
import CreateProject from "./CreateProject";
import { useParams } from "react-router-dom";
import { generalFunction } from "../../assets/Config/generalFunction";
import axios from "axios";
import AllTasks from "./AllTasks";
import { TasksAtom } from "../../Atoms/AtomStores";
import { useAtom } from "jotai";
import SprintReport from "../Sprints/SprintReport";
import { motion } from "framer-motion";
import { containerVariant } from "../../assets/Config/animationVariants";

const ProjectDashboard = () => {
  const params = useParams();
  const { projectId } = params;
  const [option, setOption] = useState("Overview");
  const [taskAtom, setTaskAtom] = useAtom(TasksAtom);
  const [projectData, setProjectData] = useState([]);
  const [apiCallComplete, setApiCallComplete] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [filterData, setFilterData] = useState([]);


  const handleDelete = async (taskId) => {
    try {
      generalFunction.showLoader();
      let request = generalFunction.createUrl(
        `tasks/${taskId}`
      );
      let res = await axios.delete(request.url, { headers: request.headers });
      if (res.data.success) {
        generalFunction.hideLoader();
        setTaskAtom(taskAtom.filter((el) => el.taskId !== taskId));
        setFilterData(filterData.filter((el) => el.taskId !== taskId));
      }
    } catch (err) {
      generalFunction.hideLoader();
      console.log(err);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      generalFunction.showLoader();
      const request = generalFunction.createUrl(`projects/${projectId}`);
      const response = await axios.get(request.url, {
        headers: request.headers,
      });
      if (response.data.success) {
        setProjectData(response.data.data);
        setTaskAtom(response.data.data.tasks);
        setApiCallComplete(true);
      }
      generalFunction.hideLoader();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    if (taskAtom.length) {
      if (assignees.length) {
        setFilterData(
          taskAtom?.filter((el) => {
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
  }, [taskAtom, assignees]);

    return (
        <DashboardWrapper>
            <div className='w-full h-full'>
                <p className='px-10 py-5 border-b border-[#0d0d0d]/10 text-[#2c2c2c] text-lg font-medium w-full'>Projects</p>
                <div className='p-6'>
                    <div className="pb-4 text-[#181818] text-4xl font-semibold">{projectData?.title}</div>
                    <div className='border-b border-[rgba(38, 50, 56, 0.10)] flex'>
                        <p className={`text-base font-semibold p-[10px_15px] rounded-t-[10px] cursor-pointer ${ option === "Overview" ? "text-[#0065ff] bg-[#f9f9f9] border-b border-[#004dc7]" : "text-[#2C2C2C]"}`} onClick={() => setOption("Overview")}>Overview</p>
                        <p className={`text-base font-semibold p-[10px_15px] rounded-t-[10px] cursor-pointer ${ option === "Tasks" ? "text-[#0065ff] bg-[#f9f9f9] border-b border-[#004dc7]" : "text-[#2C2C2C]"}`} onClick={() => setOption("Tasks")}>Tasks</p>
                        <p className={`text-base font-semibold p-[10px_15px] rounded-t-[10px] cursor-pointer ${ option === "Report" ? "text-[#0065ff] bg-[#f9f9f9] border-b border-[#004dc7]" : "text-[#2C2C2C]"}`} onClick={() => setOption("Report")}>Report</p>
                    </div>
                    {option === "Overview" &&
                      <motion.div 
                      variants={containerVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      >
                        <CreateProject
                            disableModal={true}
                            initialConfig={projectData}
                            setProjectData={setProjectData}
                            apiCallComplete={apiCallComplete}
                        />
                        </motion.div>
                    }
                    {
                        option === "Tasks" &&
                        <AllTasks
                            filterData={filterData}
                            assignees={assignees}
                            setAssignees={setAssignees}
                            handleDelete={handleDelete}
                        />
                    }
                    {
                        option === "Report" &&
                        <SprintReport/>
                    }
                </div>
            </div>
        </DashboardWrapper>
    );
}

export default ProjectDashboard;

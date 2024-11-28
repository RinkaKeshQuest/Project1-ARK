import Cookies from "universal-cookie";
import { mainConfig } from "./appConfig";
import axios from "axios";
import { DeleteSVG, EditSVG } from "../../Components/Common/SideBarSvg";

export const generalFunction = {
  getUserId: () => {
    let userId = localStorage.getItem("questUserId");
    return userId;
  },

  getUserToken: () => {
    let token = localStorage.getItem("questUserToken");
    return token;
  },

  getOrganizationId: () => {
    let organizationId = localStorage.getItem("organizationId");
    return organizationId;
  },

  getLastLoginSession: () => {
    let lastLoginSession = localStorage.getItem("lastLoginSession");
    return lastLoginSession;
  },

  showLoader: () => {
    let loader = document.querySelector("#loader");
    loader.style.display = "flex";
  },

  hideLoader: () => {
    let loader = document.querySelector("#loader");
    loader.style.display = "none";
  },

  getUserCredentials: () => {
    let questUserCredentials = JSON.parse(
      localStorage.getItem("questUserCredentials")
    );
    return questUserCredentials;
  },

  getUserRecords: () => {
    let userRecords = JSON.parse(localStorage.getItem("userRecords"));
    return userRecords;
  },

  logout: () => {
    localStorage.removeItem("userCredentials");
    localStorage.removeItem("UserAnswers");
    localStorage.removeItem("questUserId");
    localStorage.removeItem("questUserToken");
    localStorage.removeItem("questUserCredentials");
    localStorage.removeItem("userRecords");
    localStorage.removeItem("organizationId");
  },

  createText: ({
    type,
    createdUser = "",
    oldData = null,
    newData = null,
    removedAssignee = [],
    newAssignee = [],
    comment = "",
    attachment = [],
    createdAt,
    handleOpen,
    activityId,
    editActivity,
    deleteActivity,
  }) => {
    if (type == "TASK_COMMENTED") {
        const urlPattern = /(\bhttps?:\/\/[^\s]+)/g;
        // comment = comment.replace(urlPattern, function(url) {
        //   let urlFinder = "Link"
        //   if (url.includes("loom.com")) {
        //     urlFinder = "Loom Video"
        //   } else if (url.includes("youtube.com")) {
        //     urlFinder = "Youtube Video"
        //   } else if (url.includes("vimeo.com")) {
        //     urlFinder = "Vimeo Video"
        //   } else if (url.includes("drive.google.com")) {
        //     urlFinder = "Google Drive"
        //   } else if (url.includes("dropbox.com")) {
        //     urlFinder = "Dropbox"
        //   } else if (url.includes("github.com")) {
        //     urlFinder = "Github"
        //   }

        //   return `<a href="${url} target="_blank" rel="noopener noreferrer" class="cursor-pointer text-blue-500 italic underline">${urlFinder}</a>`;
        // });  
    }

    let messages = {
      TASK_CREATED: (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Task created successfully by <span>{createdUser || "Unknown"}</span>.
        </p>
      ),
      DUE_DATE_UPDATED: oldData ? (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Due date has been updated from <span>{oldData}</span> to{" "}
          <span>{newData}</span> by <span>{createdUser || "Unknown"}</span>.
        </p>
      ) : (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Due date has been added to <span>{newData}</span> by{" "}
          <span>{createdUser || "Unknown"}</span>.
        </p>
      ),
      SPRINT_POINTS_UPDATED: oldData ? (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Sprint points have been updated from <span>{oldData}</span> to{" "}
          <span>{newData}</span> by <span>{createdUser || "Unknown"}</span>.
        </p>
      ) : (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Sprint points have been added to <span>{newData}</span> by{" "}
          <span>{createdUser || "Unknown"}</span>.
        </p>
      ),
      CHANGE_ASSIGNEE:
        removedAssignee &&
        newAssignee &&
        removedAssignee.length &&
        newAssignee.length ? (
          <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
            Removed <span>{removedAssignee.map((e) => e.name).join(", ")}</span>
            , Added <span>{newAssignee.map((e) => e.name).join(", ")}</span> by{" "}
            <span>{createdUser || "Unknown"}</span>.
          </p>
        ) : removedAssignee && removedAssignee.length ? (
          <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
            Removed <span>{removedAssignee.map((e) => e.name).join(", ")}</span>{" "}
            by <span>{createdUser || "Unknown"}</span>.
          </p>
        ) : (
          <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
            Added <span>{newAssignee.map((e) => e.name).join(", ")}</span> by{" "}
            <span>{createdUser || "Unknown"}</span>.
          </p>
        ),
      CHANGE_STATUS: oldData ? (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Status has been updated from <span>{oldData}</span> to{" "}
          <span>{newData}</span> by <span>{createdUser || "Unknown"}</span>.
        </p>
      ) : (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Status has been added to <span>{newData}</span> by{" "}
          <span>{createdUser || "Unknown"}</span>.
        </p>
      ),
      CHANGE_PRIORITY: oldData ? (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Priority has been updated from <span>{oldData}</span> to{" "}
          <span>{newData}</span> by <span>{createdUser || "Unknown"}</span>.
        </p>
      ) : (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Priority has been added to <span>{newData}</span> by{" "}
          <span>{createdUser || "Unknown"}</span>.
        </p>
      ),
      CHANGE_TAG: oldData ? (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Tag has been updated from <span>{oldData}</span> to{" "}
          <span>{newData}</span> by <span>{createdUser || "Unknown"}</span>.
        </p>
      ) : (
        <p className="text-center text-[#979797] w-4/5 m-auto p-1 rounded-md *:text-[#696969] *:font-medium">
          Tag has been added to <span>{newData}</span> by{" "}
          <span>{createdUser || "Unknown"}</span>.
        </p>
      ),
      TASK_COMMENTED: (
        <div className="w-full px-2">
          <div className="w-full p-2 border rounded-md text-[#696969] bg-white flex flex-col group">
            <p className="font-bold text-sm">{createdUser || "User"}:</p>
            <div
              className="prose prose-sm text-[#696969]"
              dangerouslySetInnerHTML={{ __html: comment }}
            ></div>
            {attachment && attachment.length ? (
              <div className="flex gap-2 items-center mt-2 overflow-x-auto">
                {attachment.map((el, i) => (
                  <div key={i} onClick={()=>handleOpen(el?.url)}>
                    <img src={el.url} alt="" className="w-fit h-[70px]" />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex justify-between items-center">
              <p className="mt-2 text-[#979797] text-[10px]">{createdAt}</p>
              <div className="flex gap-2 items-center right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 *:cursor-pointer">
                <div onClick={()=> editActivity(activityId, comment)}><EditSVG/></div>
                <div onClick={()=> deleteActivity(activityId)}><DeleteSVG/></div>
              </div>
            </div>
          </div>
        </div>
      ),
    };

    return messages[type];
  },

  createActivityMessage: ({ activities, users, handleOpen, editActivity, deleteActivity }) => {
    let filterUser = (userIds) => {
      return users.filter((el) => userIds.includes(el.userId));
    };

    const convertDate = (data) => {
      if (!data) return "";
      const date = new Date(data);

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
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      const formattedDate = `${day} ${month} ${year}`;

      return formattedDate;
    };

    const dataShorted = (type, data) => {
      if (type == "DUE_DATE_UPDATED") {
        return convertDate(data);
      } else {
        let obj = {
          TO_DO: "To Do",
          IN_PROGRESS: "In Progress",
          CLOSED: "Closed",
          URGENT: "Urgent",
          HIGH: "High",
          NORMAL: "Normal",
          LOW: "Low",
          TASK: "Task",
          BUG: "Bug",
          STORY: "Story",
          REVIEW: "Review",
          FEATURE: "Feature",
        };
        return obj[data] ? obj[data] : data;
      }
    };

    return activities.map((el, i) => {
      let data = generalFunction.createText({
        type: el?.activityType,
        createdUser: filterUser([el?.createdBy])?.length
          ? filterUser([el?.createdBy])[0]?.name
          : "Unknown",
        oldData: dataShorted(el?.activityType, el?.activityValue?.oldData),
        newData: dataShorted(el?.activityType, el?.activityValue?.newData),
        ...(el?.activityValue?.removedAssignee?.length && {
          removedAssignee: filterUser(el?.activityValue?.removedAssignee),
        }),
        ...(el?.activityValue?.newAssignee?.length && {
          newAssignee: filterUser(el?.activityValue?.newAssignee),
        }),
        ...(el?.activityValue?.comment && {
          comment: el?.activityValue?.comment,
        }),
        ...(el?.activityValue?.attachment?.length && {
          attachment: el?.activityValue?.attachment,
        }),
        createdAt: convertDate(el?.createdAt),
        handleOpen,
        activityId: el?._id,
        editActivity,
        deleteActivity,
      });

      return data;
    });
  },

  createUrl: (apiString) => {
    const url = `${mainConfig.QUEST_ADDON_URL}${apiString}`;
    const headers = {
      apiKey: mainConfig.QUEST_API_KEY,
      userId: generalFunction.getUserId(),
      token: generalFunction.getUserToken(),
      entityId: generalFunction.getOrganizationId(),
    };

    return {
      url,
      headers,
    };
  },

  createUrlUsingQuestBase: (apiString) => {
    const url = `${mainConfig.QUEST_BASE_URL}${apiString}`;
    const headers = {
      apiKey: mainConfig.QUEST_API_KEY,
      userId: generalFunction.getUserId(),
      token: generalFunction.getUserToken(),
      entityId: generalFunction.getOrganizationId(),
    };

    return {
      url,
      headers,
    };
  },

  count: 0,

  uploadImageToBackend: async (file) => {
    if (!file) {
      return null;
    }
    if (file.size > 1000000 && generalFunction.count <= 50) {
      try {
        // Resize the image to below 1MB
        const compressedImage = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          initialQuality: 1 - generalFunction.count * 0.05,
        });
        generalFunction.count++;

        // Call the uploadImageToBackend function recursively with the compressed image
        return await generalFunction.uploadImageToBackend(compressedImage);
      } catch (error) {
        return null;
      }
    }

    const { url, headers: baseHeaders } =
      generalFunction.createUrlUsingQuestBase(`api/upload-img`);
    const headers = {
      ...baseHeaders,
      "Content-Type": "form-data",
    };

    const formData = new FormData();
    formData.append("uploaded_file", file);

    try {
      const res = await axios.post(url, formData, { headers });
      return res;
    } catch (error) {
      return null;
    }
  },

  fetchCommunities: async (userId) => {
    let request = generalFunction.createUrl(
      `api/users/${userId}/admin-entities`
    );
    try {
      const response = await axios.get(request.url, {
        headers: { ...request.headers, apikey: mainConfig.API_KEY },
      });
      if (response.data.success === false) {
        return response.data;
      }

      if (response.data.success === true) {
        if (response.data.data.length == 0) {
          return response.data;
        }
        let comm = response?.data?.data.filter(
          (ele) => ele.parentEntityId == undefined
        );
        return { success: true, data: comm };
      }
    } catch (error) {
      return { success: false, loginAgain: true };
    }
  },
};

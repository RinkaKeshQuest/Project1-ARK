import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
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
import { PlusSVG, PrioritySVG, StarSVG, TagSVG } from "../Common/SideBarSvg";
import { useEffect, useRef, useState } from "react";
import { AllUserAtom, ProjectsAtom } from "../../Atoms/AtomStores";
import { useAtom } from "jotai";
import { generalFunction } from "../../assets/Config/generalFunction";
import axios from "axios";
import AllController from "./AllController";
import { Toast } from "@questlabs/react-sdk";
const status = [
  {
    title: "To Do",
    value: "TO_DO",
    background: "#C9C9C9",
    borderColor: "#808080",
    color: "#535353",
  },
  {
    title: "In Progress",
    value: "IN_PROGRESS",
    background: "#E1E1FB",
    borderColor: "#0065FF",
    color: "#0065FF",
  },
  {
    title: "Closed",
    value: "CLOSED",
    background: "#C2F0D9",
    borderColor: "#0DC268",
    color: "#0DC268",
  },
];

const priority = [
  {
    title: "Urgent",
    value: "URGENT",
    icon: <PrioritySVG state={"urgent"} />,
  },
  {
    title: "High",
    value: "HIGH",
    icon: <PrioritySVG state={"high"} />,
  },
  {
    title: "Normal",
    value: "NORMAL",
    icon: <PrioritySVG state={"normal"} />,
  },
  {
    title: "Low",
    value: "LOW",
    icon: <PrioritySVG state={"low"} />,
  },
];

const tag = [
  {
    title: "Task",
    value: "TASK",
    background: "#E1E1FB",
    color: "#8090FF",
    icon: <TagSVG color={"#8090FF"} />,
  },
  {
    title: "Feature",
    value: "FEATURE",
    background: "#C2F0D9",
    color: "#00C16A",
    icon: <TagSVG color={"#00C16A"} />,
  },
  {
    title: "Review",
    value: "REVIEW",
    background: "#D9EFF0",
    color: "#42B2B3",
    icon: <TagSVG color={"#42B2B3"} />,
  },
  {
    title: "Story",
    value: "STORY",
    background: "#F0E1E1",
    color: "#FF9E00",
    icon: <TagSVG color={"#FF9E00"} />,
  },
  {
    title: "Bug",
    value: "BUG",
    background: "#F0E1E1",
    color: "#F57189",
    icon: <TagSVG color={"#F57189"} />,
  },
];

const initialData = {
  title: "",
  status: "TO_DO",
  dueDate: "",
  assignee: [],
  priority: "NORMAL",
  tag: "TASK",
  description: "",
};

const initialDataForDesign = {
  status: {
    title: "To Do",
    background: "#C9C9C9",
    borderColor: "#808080",
    color: "#535353",
  },
  priority: {
    title: "Normal",
    icon: <PrioritySVG state={"normal"} />,
  },
  tag: {
    title: "Code",
    background: "#F0E1E1",
    color: "#FF9E00",
    icon: <TagSVG color={"#FF9E00"} />,
  },
  assignee: [],
};

const CreateProject = ({
  isOpen,
  onClose,
  disableModal,
  initialConfig,
  setProjectData,
  apiCallComplete,
}) => {
  const fileInputRef = useRef(null);
  const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
  const [projectsAtom, setProjectsAtom] = useAtom(ProjectsAtom);
  const [dataForStyle, setDataForStyle] = useState(initialDataForDesign);
  const [data, setData] = useState(initialData);
  const [openConditionalSave, setOpenConditionalSave] = useState(false);
  const [oldData, setOldData] = useState({});
  const [imageData, setImageData] = useState([]);

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

    let request = generalFunction.createUrl(`projects`);
    axios
      .post(
        request.url,
        { ...data, attachment: imageLink },
        { headers: request.headers }
      )
      .then((res) => {
        generalFunction.hideLoader();
        if (res.data.success) {
          setProjectsAtom([...projectsAtom, res.data.data]);
          closeBox();
          Toast.success({
            text: "Project Created Successfully",
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

  const handleUpdate = async () => {
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
      `projects/${initialConfig?.projectId}`
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
          setProjectsAtom(
            projectsAtom.map((el) => {
              if (el.projectId === initialConfig?.projectId) {
                return res.data.data;
              } else {
                return el;
              }
            })
          );
          setOldData(res.data.data);
          setProjectData({ ...initialConfig, ...res.data.data });
          setImageData([]);
          setOpenConditionalSave(false);
          Toast.success({
            text: "Project Updated Successfully",
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

  // ---------------------------------------- Normal functions ----------------------------------------
  const handleFileChange = (event) => {
    let maxSize = 1024 * 1024;
    let files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];

      if (file && file.size > maxSize) {
        alert("File is too large. Please select a file smaller than 1MB.");
      } else {
        files.push(file);
      }
    }
    setImageData([...imageData, ...files]);
    event.target.value = null;
  };

  const handleAssigneeChange = (selectedAssignees) => {
    setData({ ...data, assignee: selectedAssignees.map((ele) => ele.userId) });
    setDataForStyle({ ...dataForStyle, assignee: selectedAssignees });
  };

  const discardChanges = () => {
    setData({ ...data, ...oldData });
    setDataForStyle({
      ...dataForStyle,
      status: status.find((el) => el.value === oldData.status),
      priority: priority.find((el) => el.value === oldData.priority),
      tag: tag.find((el) => el.value === oldData.tag),
      assignee: allUsersAtom.filter((ele) =>
        oldData.assignee.includes(ele.userId)
      ),
    });
    setOpenConditionalSave(false);
  };

  function closeBox() {
    onClose();
    setOpenConditionalSave(false);
    setData(initialData);
    setOldData(initialData);
    setImageData([]);
    setDataForStyle(initialDataForDesign);
  }

  useEffect(() => {
    if (disableModal == true && initialConfig) {
      setData(initialConfig);
      setOldData(initialConfig);
      setDataForStyle({
        ...dataForStyle,
        assignee: allUsersAtom.filter((ele) =>
          initialConfig?.assignee?.includes(ele.userId)
        ),
        status: status.find((el) => el.value === initialConfig.status),
        priority: priority.find((el) => el.value === initialConfig.priority),
        tag: tag.find((el) => el.value === initialConfig.tag),
      });
    }
  }, [initialConfig]);

  useEffect(() => {
    if (
      (apiCallComplete && JSON.stringify(oldData) != JSON.stringify(data)) ||
      imageData.length
    ) {
      setOpenConditionalSave(true);
    } else {
      setOpenConditionalSave(false);
    }
  }, [data, imageData]);

  return disableModal == true ? (
    <Box>
      <AllController
        data={data}
        setData={setData}
        dataForStyle={dataForStyle}
        setDataForStyle={setDataForStyle}
        allUsersAtom={allUsersAtom}
        status={status}
        priority={priority}
        tag={tag}
        handleAssigneeChange={handleAssigneeChange}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        imageData={imageData}
        setImageData={setImageData}
        discardChanges={discardChanges}
        handleUpdate={handleUpdate}
        openConditionalSave={openConditionalSave}
        initialConfig={initialConfig}
      />
      {openConditionalSave && (
        <Box className="mt-6 flex justify-end">
          <Button mr={3} onClick={() => discardChanges()}>
            Discard
          </Button>
          <Button colorScheme="blue" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Box>
      )}
    </Box>
  ) : (
    <Modal isOpen={isOpen} onClose={closeBox} size={"4xl"}>
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        <ModalHeader px="40px" pt="40px">
          <Input
            placeholder="Add a title"
            fontSize="36px"
            fontWeight="600px"
            color="#181818"
            border="none"
            outline="none"
            p="0"
            sx={{
              _focus: {
                border: "none",
                outline: "none",
              },
            }}
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px="56px">
          <AllController
            data={data}
            setData={setData}
            dataForStyle={dataForStyle}
            setDataForStyle={setDataForStyle}
            allUsersAtom={allUsersAtom}
            status={status}
            priority={priority}
            tag={tag}
            handleAssigneeChange={handleAssigneeChange}
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
            imageData={imageData}
            setImageData={setImageData}
            discardChanges={discardChanges}
            handleUpdate={handleUpdate}
            openConditionalSave={openConditionalSave}
            initialConfig={initialConfig}
          />
        </ModalBody>
        <ModalFooter pb="40px" px="56px">
          <Button mr={3} onClick={closeBox}>
            Close
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Create Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProject;

import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { generalFunction } from "../../assets/Config/generalFunction";
import { Toast, UserProfile } from "@questlabs/react-sdk";
import { ThemeContext } from "../Common/AppContext";
import { uploadSVG } from "../Common/SideBarSvg";
import { mainConfig } from "../../assets/Config/appConfig";
import { useAtom } from "jotai";
import { AllUserAtom, UserAtom } from "../../Atoms/AtomStores";
import { motion } from "framer-motion";
import { containerVariant } from "../../assets/Config/animationVariants";
const EditProfile = () => {
  const { theme, bgColors, appConfig } = useContext(ThemeContext);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [customImage, setCustomImage] = useState("");
  const [answer, setAnswer] = useState({});
  const [userAtom, setUserAtom] = useAtom(UserAtom);
  const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
  const fileInputRef = useRef();

  useEffect(() => {
    generalFunction.showLoader();
    const getuser = async () => {
      setTimeout(() => {
        generalFunction.hideLoader();
      }, 300);
      let request = generalFunction.createUrl(
        `users/${generalFunction.getUserId()}`
      );
      const { data } = await axios.get(request.url, {
        headers: request.headers,
      });
      setImageUrl(data.data.avatar);
      generalFunction.hideLoader();
    };
    getuser();
  }, []);

  const inputFileChangeHandler = (event) => {
    // if (event.target.files[0]) {
    //   setSelectedFile(event.target.files[0]);
    //   setImageUrl(URL.createObjectURL(event.target.files[0]));
    //   setCustomImage(URL.createObjectURL(event.target.files[0]));

    //   const uploadFile = async () => {
    //     generalFunction.showLoader();
    //     let data = await generalFunction.uploadImageToBackend(
    //       event.target.files[0]
    //     );
    //     setImageUrl(data?.data?.imageUrl);
    //     generalFunction.hideLoader();
    //   };
    //   uploadFile();
    // }
    const file = event.target.files[0];
  if (file) {
    if (file.size > 1048576) {
      alert("File size should be less than 1 MB");
      return;
    }
    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    setCustomImage(imageUrl);
    const uploadFile = async () => {
      generalFunction.showLoader();
      let data = await generalFunction.uploadImageToBackend(file);
      setImageUrl(data?.data?.imageUrl);
      generalFunction.hideLoader();
    };
    uploadFile();
  }
  };

  const updateProfile = async () => {
    generalFunction.showLoader();
    let request = generalFunction.createUrl(
      `users/${generalFunction.getUserId()}`
    );
    const response = await axios.patch(
      request.url,
      {
        avatar: imageUrl,
        name: answer["ca-9e23beb1-139d-4af6-9816-6ce37cb78b4c"] || "",
        companyName: answer["ca-2abd8272-e7fb-44c6-a466-76b90c014a89"] || "",
        role: answer["ca-a70f3fa5-f33b-4f7b-b341-72f4bc808c27"] || "",
      },
      { headers: request.headers }
    );
    if (response.data.success) {
      localStorage.setItem("userRecords", JSON.stringify(response.data.data));
      setUserAtom(response.data.data);
      setAllUsersAtom(
        allUsersAtom.map((el) => {
          if (el.userId == generalFunction.getUserId()) {
            return response.data.data;
          } else {
            return el;
          }
        })
      );
      Toast.success({
        text: "Profile Updated Successfully",
      });
    }
    generalFunction.hideLoader();
  };

  const colorRetriver = () => {
    let mainColor = bgColors[`${theme}-primary-bg-color-0`];
    let diffColor = mainColor?.split(" ")?.filter((ele) => ele.charAt(0) == "#");
    let pickColor = !!diffColor?.length
      ? [diffColor[0], diffColor.length > 1 ? diffColor[1] : "#D1ACFF"]
      : ["#9035FF", "#D1ACFF"];
    return pickColor;
  };
  return (
    <motion.div className="w-full max-w-[calc(100vw-184px)] max-h-[calc(100vh-161px)] overflow-x-scroll overflow-y-scroll mt-[18px]"
    variants={containerVariant}
    initial="hidden"
    animate="visible"
    exit={"exit"}
    >
      <div
        className="p-8 flex flex-col items-center gap-8 rounded-[10px]"
        style={{
          border: `1.5px solid ${bgColors[`${theme}-primary-border-color`]}`,
        }}
      >
        <div
          className="w-28 h-28 flex items-center justify-center rounded-full bg-[#F4EBFF] relative"
          onClick={() => fileInputRef.current.click()}
        >
          {(imageUrl || customImage) && (
            <img
              className="object-cover w-full h-full rounded-full static z-10"
              src={imageUrl || customImage}
              alt=""
            />
          )}
          <div
            className={`${
              imageUrl ? "opacity-0" : "opacity-100"
            } absolute left-0 top-0`}
          >
            <label className="cursor-pointer w-28 h-28 flex items-center justify-center rounded-full">
              <div className={`${(imageUrl || customImage) && "hidden"}`}>
                {uploadSVG(colorRetriver()[0], colorRetriver()[1])}
              </div>
            </label>
            <input
              onChange={inputFileChangeHandler}
              id="profile-img"
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>
        <UserProfile
          questId={mainConfig.QUEST_ID}
          userId={generalFunction.getUserId()}
          token={generalFunction.getUserToken()}
          answer={answer}
          setAnswer={setAnswer}
          getAnswers={updateProfile}
          styleConfig={{
            Form: {
              width: "100%",
              background: "transparent",
            },
            Label: {
              color: bgColors[`${theme}-color-premitive-grey-6`],
              fontFamily: "Figtree",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "16px",
            },
            Input: {
              borderRadius: "10px",
              border: `1px solid ${bgColors[`${theme}-primary-border-color`]}`,
            },
            MultiChoice: {
              selectedStyle: {
                background: "var(--button-background)",
                // background: bgColors[`${theme}-primary-bg-color-0`],
                color: "#E0E0E0",
                border: `1px solid ${
                  bgColors[`${theme}-primary-border-color`]
                }`,
              },
              style: {
                border: `1px solid ${
                  bgColors[`${theme}-primary-border-color`]
                }`,
              },
            },
            SingleChoice: {
              style: {
                border: `1px solid ${
                  bgColors[`${theme}-primary-border-color`]
                }`,
              },
              selectedStyle: {
                border: `1px solid ${
                  bgColors[`${theme}-primary-border-color`]
                }`,
              },
            },
            TextArea: {
              border: `1px solid ${bgColors[`${theme}-primary-border-color`]}`,
            },
            PrimaryButton: {
              border: "none",
            },
          }}
        />
      </div>
    </motion.div>
  );
};

export default EditProfile;

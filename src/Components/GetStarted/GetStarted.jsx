// import { GetStarted } from "@questlabs/react-sdk";
// import DashboardWrapper from "../Common/DashboardWrapper";
// import { importConfig } from "../../assets/Config/importConfig";
// import { generalFunction } from "../../assets/Config/generalFunction";
// import { useContext } from "react";
// import { ThemeContext } from "../Common/AppContext";
// import {
//   adminIcon,
//   searchIcon,
//   settingIcon,
//   userIcon,
// } from "../Common/SideBarSvg";
// import { useNavigate } from "react-router-dom";
// // import Admin from "../Admin/Admin";
// import SearchComponents from "../Common/SearchComponents";

import { GetStarted } from "@questlabs/react-sdk";
import { importConfig } from "../../assets/Config/importConfig";
import DashboardWrapper from "../Common/DashboardWrapper";
import { generalFunction } from "../../assets/Config/generalFunction";
import { PlusIconSVG } from "../Common/SideBarSvg";
import CreateProject from "../Projects/CreateProject";
import { useState } from "react";
import { mainConfig } from "../../assets/Config/appConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { containerVariant } from "../../assets/Config/animationVariants"; 
// export default function GetStartedComponent() {
//   const completeAllStatus = () => {};
//   const navigate = useNavigate();
//   const { theme, bgColors, appConfig } = useContext(ThemeContext);

//   const getLighterColor = (color1, color2) => {
//     const calculateLuminance = (color) => {
//       const r = parseInt(color.slice(1, 3), 16);
//       const g = parseInt(color.slice(3, 5), 16);
//       const b = parseInt(color.slice(5, 7), 16);
//       return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
//     };
//     const luminance1 = calculateLuminance(color1);
//     const luminance2 = calculateLuminance(color2);

//     return luminance1 > luminance2 ? color1 : color2;
//   };

//   const colorRetriver = () => {
//     let mainColor = bgColors[`${theme}-primary-bg-color-0`] || "#FBFBFB";
//     let diffColor = mainColor.split(" ")?.filter((ele) => ele.charAt(0) == "#");
//     let pickColor = !!diffColor?.length
//       ? [diffColor[0], diffColor.length > 1 ? diffColor[1] : "#D1ACFF"]
//       : ["#9035FF", "#D1ACFF"];
//     // const lighterColor = getLighterColor(diffColor[0], diffColor[1]);
//     const lighterColor = getLighterColor(pickColor[0], pickColor[1]);

//     return lighterColor;
//   };

//   function hexToRgb(hex) {
//     hex = hex.replace(/^#/, "");
//     const bigint = parseInt(hex, 16);
//     const r = (bigint >> 16) & 255;
//     const g = (bigint >> 8) & 255;
//     const b = bigint & 255;
//     return `${r}, ${g}, ${b}`;
//   }

//   return (
//     <div className="dashboard-page transition-all ease-in delay-[40]">
//       <div
//         className="dashboard-page-header"
//         style={{
//           borderBottom: `1.5px solid ${
//             bgColors[`${theme}-primary-border-color`]
//           }`,
//         }}
//       >
//         <p
//           style={{
//             color: bgColors[`${theme}-color-premitive-grey-5`],
//           }}
//         >
//           Get Started
//         </p>
//       </div>
//       {/* <div className="pl-10 pr-[116px] pt-[30px]"> */}
//       {/* here */}
//       <div className="pl-5 pr-[96px] pt-[30px]">
//         {/* for search cont  */}
//         {/* <div className="w-full flex items-center justify-between gap-4 px-5">
//                     <div className="flex h-10 border py-2.5 items-center border-[#EFEFEF] rounded-[10px] w-full" style={{borderColor: bgColors[`${theme}-primary-border-color`]}}>
//                         <div className="flex items-center h-full mx-5">
//                             {searchIcon()}
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search here.."
//                             className="border-none outline-none h-full w-full bg-transparent"
//                             style={{
//                                 backgroundColor: "transparent",
//                                 color: bgColors[
//                                     `${theme}-color-premitive-grey-5`
//                                 ],
//                             }}
//                         />
//                     </div>

//                     <button
//                         className="text-sm px-8 py-2.5 rounded-[10px]"
//                         style={{
//                             background: bgColors[`${theme}-primary-bg-color-0`],
//                             color: "#eaebed",
//                             whiteSpace: "nowrap",
//                         }}
//                     >
//                         Search
//                     </button>
//                 </div> */}
//                 {/* <SearchComponents/> */}
//         {/* <Admin /> */}
//         <div className="get-started pt-[4px]">
//           <GetStarted
//             questId={appConfig?.QUEST_GET_STARTED_CAMPAIGN_ID}
//             userId={generalFunction.getUserId()}
//             token={generalFunction.getUserToken()}
//             completeAllStatus={completeAllStatus}
//             buttonBg="linear-gradient(90deg, rgba(105,92,254,1) 0%, rgba(0,210,234,1) 50%, rgba(105,92,254,1) 100%)"
//             cardHeadingColor={bgColors[`${theme}-color-premitive-grey-5`]}
//             cardDescColor="var(--neutral-grey-200, #AFAFAF)"
//             cardBorderColor="var(--primary-bg-color-2)"
//             descriptionText={`Get started with ${appConfig?.QUEST_ENTITY_NAME} and explore how you can get the best out of the platform`}
//             iconUrls={[
//               userIcon(bgColors[`${theme}-color-premitive-grey-5`]),
//               adminIcon(bgColors[`${theme}-color-premitive-grey-5`]),
//               settingIcon(bgColors[`${theme}-color-premitive-grey-5`]),
//             ]}
//             arrowColor="#939393"
//             onLinkTrigger={(e) => window.open(e, "_blank")}
//             allowMultiClick
//             styleConfig={{
//               Form: {
//                 padding: "0px",
//                 background: "transparent",
//               },
//               Topbar: {
//                 border: "0px",
//                 paddingBottom: "0px",
//                 paddingTop: "0px",
//               },
//               Heading: {
//                 color: bgColors[`${theme}-color-premitive-grey-5`],
//                 fontFamily: "Figtree",
//                 fontSize: "24px",
//                 fontStyle: "normal",
//                 fontWeight: "600",
//                 lineHeight: "32px",
//               },
//               Description: {
//                 color: "var(--Neutral-Black-200, #6E6E6E)",
//                 fontFamily: "Figtree",
//                 fontSize: "14px",
//                 fontStyle: "normal",
//                 fontWeight: "400",
//                 lineHeight: "20px",
//                 margin: "8px 0 0 0",
//               },
//               ProgressBar: {
//                 barColor: bgColors[`${theme}-primary-bg-color-0`],
//                 ProgressText: {
//                   color: bgColors[`${theme}-color-premitive-grey-5`],
//                 },
//               },
//               Card: {
//                 background:
//                   theme == "dark"
//                     ? bgColors[`${theme}-primary-bg-color-2`]
//                     : "transparent",
//                 border: `1px solid ${
//                   bgColors[`${theme}-primary-border-color`]
//                 }`,
//               },
//               Icon: {
//                 background:
//                   theme == "dark"
//                     ? "rgba(255, 255, 255, 0.08)"
//                     : `rgba(${hexToRgb(colorRetriver())}, 0.1)`,
//               },
//               Arrow: {
//                 Background: theme == "dark" ? "#202020" : "",
//                 CompletedBackground: theme == "dark" ? "#202020" : "",
//               },
//             }}
//             showFooter={false}
//             // showProgressBar
//           />
//         </div>
//       </div>
//     </div>
//   );
// }




const GetStartedComponent = () => {
  const [projectModal, setProjectModal] = useState(false);
  const navigate = useNavigate();


  const clickAction = (link) => {
    switch (link) {
      case "/profile":
        navigate("/settings?section=profile");
        break;
      case "/project":
        setProjectModal(true);
        break;
      default:
        navigate("/settings?section=invite");
        break;
    }
  }



    return (
        <DashboardWrapper>
          <motion.div className="w-full h-full"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          exit={"exit"}
          >
            <p className='px-10 py-5 border-b border-[#0d0d0d]/10 text-[#2c2c2c] text-lg font-medium w-full'>Get Started</p>
            <div className="p-6">
              <div className="flex justify-between border border-[#CBD5E1] rounded-xl">
                <div className="p-6 flex flex-col gap-1">
                  <p className="ext-[#181818] text-lg font-semibold">Build Your Success, One Streak at a Time</p>
                  <p className="text-[#939393] text-sm">Track your commitments and drive success with our streak tracking platform</p>
                  <button className="px-3 py-2 rounded-md mt-1 text-[#fff] w-fit font-[600] text-sm flex gap-1 items-center" onClick={() => setProjectModal(true)} style={{background: "var(--button-background)"}}>
                    <p>Create Project</p>
                    <PlusIconSVG/>
                  </button>
                </div>
                <img src={importConfig.dashboard.getStarted} alt=""  className="max-w-[450px]"/>
              </div>
              <GetStarted
                questId={mainConfig?.GET_STARTED_QUEST_ID}
                userId={generalFunction.getUserId()}
                token={generalFunction.getUserToken()}
                // completeAllStatus={completeAllStatus}
                buttonBg="var(--button-background)"
                cardHeadingColor="#2C2C2C"
                cardDescColor="#979797"
                cardBorderColor="#EFEFEF"
                descriptionText={"Get started with Quest and explore how Quest can take your customer engagement to the next level "}
                arrowColor="#939393"
                onLinkTrigger={(e) => clickAction(e)}
                allowMultiClick
                styleConfig={{
                  Form: {
                    padding: "0px",
                    background: "transparent",
                  },
                  Topbar: {
                    padding: "20px 0px 12px",
                  },
                  Description: {
                    color: "var(--Neutral-Black-200, #6E6E6E)",
                    fontFamily: "Figtree",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "20px",
                    margin: "8px 0 0 0",
                  },
                  Icon: {
                    background: "transparent",
                  },
                  CardContainer: {
                    padding: "0px",
                    marginTop: "12px",
                  },
                }}
                showFooter={false}
              />
            </div>
            <CreateProject
              isOpen={projectModal}
              onClose={() => setProjectModal(false)}
            />
          </motion.div>
        </DashboardWrapper>
    );
}

export default GetStartedComponent;
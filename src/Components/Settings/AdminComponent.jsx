import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { generalFunction } from "../../assets/Config/generalFunction";
import { deleteIcon, searchIcon, inviteButton, MailSVG, RoleSVG } from "../Common/SideBarSvg";
import { ThemeContext } from "../Common/AppContext";
import { mainConfig } from "../../assets/Config/appConfig";
import AddAdminPopup from "./AddAdminPopup";
import { Toast } from "@questlabs/react-sdk";
import { useAtom } from "jotai";
import { AllUserAtom, UserAtom } from "../../Atoms/AtomStores";
import { Avatar } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { containerVariant } from "../../assets/Config/animationVariants";
const AdminComponent = () => {
  const { theme, bgColors, appConfig } = useContext(ThemeContext);
  const [userAtom, setUserAtom] = useAtom(UserAtom);
  const [allUserAtom, setAllUserAtom] = useAtom(AllUserAtom);
  const [adminData, setAdminData] = useState(allUserAtom);
  const [filterData, setFilterData] = useState(allUserAtom);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [adminPopup, setAdminPopup] = useState(false);
  const [flag, setFlag] = useState(false);


  useEffect(() => {
    let data = adminData?.filter((user) => {
      return user.name.toLowerCase().includes(search.toLowerCase());
    });
    setFilterData(data);
  }, [search, adminData]);

  const deleteAdmin = async (userId) => {
    try {
      generalFunction.showLoader();
      let request = generalFunction.createUrlUsingQuestBase(
        `api/entities/${
          mainConfig.QUEST_ENTITY_ID
        }/remove-admin?userId=${generalFunction.getUserId()}`
      );
      await axios
        .post(
          request.url,
          {
            ownerUserId: generalFunction.getUserId(),
            userId,
          },
          {
            headers: request.headers,
          }
        )
        .then((res) => {
          const data = res.data;
          if (data.success == false) {
            let errMsg = data.message
              ? data.message
              : "Unable to Delete Member";
            Toast.error({
              text: "Error Occurred" + "\n" + errMsg,
              // image: `${appConfig.BRAND_LOGO || importConfig.brandLogo}`
            });
            return;
          } else {
            Toast.success({
              text: "Admin Removed Successfully",
            });
            const data = adminData?.filter((user) => user.userId != userId);
            setAdminData(data);
            setFlag((prev) => !prev);
          }
        });

        const url = generalFunction.createUrl(`users/${userId}`);
        const deleteUser = await axios.delete(url.url, {
          headers: url.headers,
        });
        if (deleteUser.data.success) {
          setAllUserAtom(() => allUserAtom.filter((user) => user.userId != userId));
          setAdminData(() => allUserAtom.filter((user) => user.userId != userId));
        }

        generalFunction.hideLoader();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div className="w-full h-full"
    variants={containerVariant}
    initial="hidden"
    animate="visible"
    exit={"exit"}
    >
      <div className="w-full flex items-center justify-between gap-4 mt-[24px]">
        <div
          className="flex h-10 border py-2.5 items-center rounded-[10px] w-full"
          style={{
            border: `1.5px solid ${bgColors[`${theme}-primary-border-color`]}`,
          }}
        >
          <div className="flex items-center h-full mx-5">{searchIcon()}</div>
          <input
            type="text"
            color="white"
            placeholder="Search here ..."
            className="border-none outline-none h-full w-full bg-transparent"
            style={{
              color: bgColors[`${theme}-color-premitive-grey-5`],
            }}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <button
          className="flex items-center text-sm py-[10px] rounded-[10px] px-[32px] gap-1"
          style={{
            background: "var(--Quest-Hive, linear-gradient(180deg, #4C4CFF 0%, #7B5CF7 100%))",
            color: "white",
            whiteSpace: "nowrap",
            // border: "1.5px solid #0000",
          }}
          onClick={() => setAdminPopup(true)}
        >
          Invite Team Member
          {inviteButton("white")}
        </button>
      </div>

      {adminPopup && (
        <AddAdminPopup
          setAdminPopup={setAdminPopup}
          setFlag={setFlag}
          adminPopup={adminPopup}
          setAdminData={setAdminData}
          setFilterData={setFilterData}
        />
      )}

      {filterData?.length != 0 ? (
        <div
          className="mt-[16px] rounded-xl border overflow-y-auto"
          style={{
            border: `1.5px solid ${bgColors[`${theme}-primary-border-color`]}`,
          }}
        >
          <table
            className=" w-full "
            style={{
              color: bgColors[`${theme}-primary-bg-color-8`],
            }}
          >
            <thead
              style={{
                background: theme == "dark" ? "transparent" : "#F0F0F0",
              }}
            >
              <tr
                className="text-sm font-medium font-['Figtree']"
                style={{
                  borderBottom: `1px solid ${
                    bgColors[`${theme}-primary-border-color`]
                  }`,
                }}
              >
                {/* <th
                  className="w-[10%] text-center py-[18px] rounded-tl-xl"
                  style={{
                    color: bgColors[`${theme}-color-premitive-grey-9`],
                    background: bgColors[`${theme}-primary-bg-color-9`],
                  }}
                >
                  Sr
                </th> */}
                <th
                  className="w-[30%] px-4 text-left py-[18px]"
                  style={{
                    color: bgColors[`${theme}-color-premitive-grey-9`],
                    background: bgColors[`${theme}-primary-bg-color-9`],
                  }}
                >
                  Name
                </th>
                <th
                  className="w-[30%] px-4 text-left py-[18px] "
                  style={{
                    color: bgColors[`${theme}-color-premitive-grey-9`],
                    background: bgColors[`${theme}-primary-bg-color-9`],
                  }}
                >
                  Contact
                </th>
                <th
                  className="w-[15%] px-4 text-left py-[18px] "
                  style={{
                    color: bgColors[`${theme}-color-premitive-grey-9`],
                    background: bgColors[`${theme}-primary-bg-color-9`],
                  }}
                >
                  Company Role
                </th>
                <th
                  className="w-[15%] px-4 text-left py-[18px] "
                  style={{
                    color: bgColors[`${theme}-color-premitive-grey-9`],
                    background: bgColors[`${theme}-primary-bg-color-9`],
                  }}
                >
                  Join Date
                </th>
                { userAtom.role == "OWNER" &&
                  <th
                    className="w-[10%] px-4 py-[18px]  rounded-tr-xl"
                    style={{
                      color: bgColors[`${theme}-color-premitive-grey-9`],
                      background: bgColors[`${theme}-primary-bg-color-9`],
                    }}
                  >
                    Action
                  </th>
                }
              </tr>
            </thead>

            <tbody>
              {filterData?.map((user, index) => (
                <tr
                  key={index}
                  className="text-[#4C4C4C]"
                  style={{
                    borderBottom:
                      !(filterData?.length == index + 1) &&
                      `1px solid ${bgColors[`${theme}-primary-border-color`]}`,
                  }}
                >
                  {/* <td
                    className="w-[10%] px-4 py-4 text-[#455A64] text-left"
                    style={{
                      color: bgColors[`${theme}-color-premitive-grey-9`],
                    }}
                  >
                    {index + 1}
                  </td> */}
                  <td
                    className="w-[30%] px-4 py-3 text-sm font-normal text-[#455A64] text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} src={user.avatar} size="xs"/>
                      <p>{user.name}</p>
                    </div>
                  </td>
                  <td
                    className="w-[30%] px-4 py-3 text-[#808080] text-sm font-normal text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MailSVG/>
                      <p>{user.email}</p>
                    </div>
                  </td>
                  <td
                    className="w-[15%] px-4 py-3 text-[#808080] text-sm font-normal text-left"
                  >
                    <div className="flex items-center gap-2">
                      <RoleSVG/>
                      <p>{user.companyRole || "-"}</p>
                    </div>
                  </td>
                  <td
                    className="w-[15%] px-4 py-3 text-[#808080] text-sm font-normal text-left"
                  >
                    {user.createdAt?.split("T")[0]}
                  </td>
                  { userAtom.role == "OWNER" &&
                    <td
                      className="w-[10%] px-4 py-3 text-[#808080] text-sm font-normal text-left"
                    >
                      {
                        user.userId == generalFunction.getUserId() ? (
                          <p className="text-red-500"></p>
                        )
                        :
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={() => deleteAdmin(user.userId)}
                        >
                          {deleteIcon()}
                        </div>
                      }
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className="w-full text-center mt-20 text-gray">
            No member found
          </div>
        )
      )}
      {/* </div> */}
    </motion.div>
  );
};

export default AdminComponent;

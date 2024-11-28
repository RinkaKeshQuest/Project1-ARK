import { useContext, useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import AdminComponent from "./AdminComponent";
import { ThemeContext } from "../Common/AppContext";
import DashboardWrapper from "../Common/DashboardWrapper";
import { useSearchParams } from "react-router-dom";

export default function Settings() {
  const { theme, bgColors, appConfig } = useContext(ThemeContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [section, setSection] = useState("edit");

  const handleSectionChange = (sectionName) => {
    setSection(sectionName);
  };



  useEffect(() => {
    const params = searchParams.get("section");
    if (params == "invite") {
      setSection("manage");
    } else {
      setSection("edit");
    }
  }, [searchParams]);


  return (
    <DashboardWrapper>
      <div className="flex flex-col justify-between items-center">
        <div
          className="flex w-full px-10 py-5 justify-between items-center border-b"
          style={{
            borderBottom: `1.5px solid ${
              bgColors[`${theme}-primary-border-color`]
            }`,
          }}
        >
          <p
            className="text-base font-medium"
            style={{
              color: bgColors[`${theme}-color-premitive-grey-5`],
            }}
          >
            Settings
          </p>
        </div>

        <div className="px-8 pt-[30px] w-full">
          <div
            className="flex w-full items-start h-[52px]"
            style={{
              borderBottom: `1px solid ${
                bgColors[`${theme}-primary-border-color`]
              }`,
            }}
          >
            <p
              className={`text-sm font-semibold font-['Figtree'] h-[52px] p-4 cursor-pointer ${
                section == "edit" && "rounded-t-xl border-b border-[#939393]"
              }`}
              onClick={() => handleSectionChange("edit")}
              style={{
                color: bgColors[`${theme}-color-premitive-grey-5`],
                background:
                  section == "edit"
                    ? bgColors[`${theme}-primary-bg-color-9`]
                    : "",
              }}
            >
              Edit Profile
            </p>
            <p
              className={`text-sm font-semibold font-['Figtree'] h-[52px] p-4 cursor-pointer ${
                section == "manage" && "rounded-t-xl border-b border-[#939393]"
              }`}
              onClick={() => handleSectionChange("manage")}
              style={{
                color: bgColors[`${theme}-color-premitive-grey-5`],
                background:
                  section == "manage"
                    ? bgColors[`${theme}-primary-bg-color-9`]
                    : "",
              }}
            >
              Members
            </p>
          </div>

          <div className="edit-admin">
            {section === "edit" ? <EditProfile /> : <AdminComponent />}
          </div>
        </div>


        
      </div>
    </DashboardWrapper>
  );
}

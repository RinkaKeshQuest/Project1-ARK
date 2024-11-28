import React, { useState } from "react";
import { OnBoarding } from "@questlabs/react-sdk";
import "@questlabs/react-sdk/dist/style.css";
import { useNavigate } from "react-router-dom";
import { mainConfig } from "../../assets/Config/appConfig";
import LoginSuccessModal from "../Login/LoginSuccessModal";
import axios from "axios";
import { generalFunction } from "../../assets/Config/generalFunction";
import { UserAtom } from "../../Atoms/AtomStores";
import { useAtom } from "jotai";

const Onboarding = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search)
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userAtom, setUserAtom] = useAtom(UserAtom);




  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    navigate("/");
  };
  const handleGetAnswers = async () => {
    const UserAnswers = {
      name: answers["ca-9e23beb1-139d-4af6-9816-6ce37cb78b4c"] || "",
      companyName: answers["ca-2abd8272-e7fb-44c6-a466-76b90c014a89"] || "",
      role: answers["ca-a70f3fa5-f33b-4f7b-b341-72f4bc808c27"] || "",
      email: localStorage.getItem("userCredentials")
        ? JSON.parse(localStorage.getItem("userCredentials")).email
        : ""
    };

    let {url, headers} = generalFunction.createUrl(
      `users/${generalFunction.getUserId()}`
    );

    let response = await axios.patch(url, UserAnswers, { headers: { ...headers, entityId: query.get("organization")} });

    if (response.data.success === true) {
      localStorage.setItem("userRecords", JSON.stringify(response.data.data));
      localStorage.setItem("organizationId", response.data.data.entityId);
      setUserAtom(response.data.data);
      openModal();
    }

  };

  return (
    <div className="h-screen">
      <div className="flex flex-col flex-1 h-full justify-center items-center">
          <OnBoarding
            questId={mainConfig.QUEST_ID}
            userId={generalFunction.getUserId()}
            token={generalFunction.getUserToken()}
            controlBtnType="Buttons"
            headingScreen={[
              {
                name: "Share your details",
                desc: "Welcome back, Please complete your details",
              },
            ]}
            singleChoose="modal3"
            multiChoice="modal2"
            styleConfig={{
              Form: { width: "48%" },
              Topbar: {},
              Heading: {
                fontSize: "24px",
                lineHeight: "32px",
                letterSpacing: "-2%",
              },
              Description: {
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "500",
                color: "#939393",
              },
              Input: { lineHeight: "20px" },
              Label: { fontWeight: "500" },
              TextArea: {},
              PrimaryButton: {},
              SecondaryButton: {},
              SingleChoice: { style: {}, selectedStyle: {} },
              MultiChoice: { style: {}, selectedStyle: {} },
              ProgressBar: {
                completeTabColor: "",
                currentTabColor: "",
                pendingTabColor: "",
              },
              Footer: { FooterStyle: {}, FooterText: {}, FooterIcon: {} },
            }}
            answer={answers}
            getAnswers={handleGetAnswers}
            nextBtnText="Submit Details"
            setAnswer={setAnswers}
            showFooter={false}
          />
        {error && <p className="text-red-500">Error: {error.message}</p>}
        <div className="flex justify-center items-center mt-[33px] text-center">
          <p className="text-[10px] font-normal leading-[12px] tracking-[-0.1px] text-[#939393]">
            Powered by Quest Labs
          </p>
        </div>
        <LoginSuccessModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

export default Onboarding;

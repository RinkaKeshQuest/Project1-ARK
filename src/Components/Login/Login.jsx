import { QuestLogin, Toast, QuestProvider } from "@questlabs/react-sdk";
import { useNavigate } from "react-router-dom";
import { mainConfig } from "../../assets/Config/appConfig";
import { generalFunction } from "../../assets/Config/generalFunction";
import axios from "axios";
import { UserAtom } from "../../Atoms/AtomStores";
import { useAtom } from "jotai";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const [userAtom, setUserAtom] = useAtom(UserAtom);

  useEffect(() => {
    if (query.get("organizationId")) {
      localStorage.setItem("organizationId", query.get("organizationId"));
    }
  }, []);

  const handleSubmit = async (e) => {
    const { userId, userCredentials, token } = e;

    if (userId && token) {
      const existingUserId = localStorage.getItem("userId");
      if (existingUserId && existingUserId !== userId) {
        localStorage.removeItem("UserAnswers");
      }
      localStorage.setItem("questUserId", userId);
      localStorage.setItem("userCredentials", JSON.stringify(userCredentials));
      localStorage.setItem("questUserToken", token);
      localStorage.setItem("lastLoginSession", new Date().getTime());
    }


    // createUrl: (apiString) => {
    //   const url = `${mainConfig.QUEST_ADDON_URL}${apiString}`;
    //   const headers = {
    //     apiKey: mainConfig.QUEST_API_KEY,
    //     userId: generalFunction.getUserId(),
    //     token: generalFunction.getUserToken(),
    //     entityId: generalFunction.getOrganizationId(),
    //   };
  
    //   return {
    //     url,
    //     headers,
    //   };
    // },
    try {
      let organizationId =
        query.get("organizationId") || localStorage.getItem("organizationId");
      if (organizationId && organizationId !== "") {
        localStorage.setItem("organizationId", organizationId);
        let { url, headers } = generalFunction.createUrl(
          `users/${userId}?entityId=${organizationId}`
        );
        const response = await axios.get(url, { headers });
        if (response.data.success === false) {
          navigate("/onboarding?organization=" + organizationId);
        } else {
          let userData = response.data.data;
          if (!userData.name || !userData.companyRole) {
            navigate("/onboarding?organization=" + organizationId);
          } else {
            localStorage.setItem(
              "userRecords",
              JSON.stringify(response.data.data)
            );
            setUserAtom(response.data.data);
            navigate("/");
          }
        }
      } else {
        let { url, headers } = generalFunction.createUrl(
          `users/${userId}/entities`
        );
        const response = await axios.get(url, { headers });
        if (response.data.success === false) {
          navigate("/onboarding?organization=false");
        } else {
          let entities = response.data.data;
          if (entities.length == 0) {
            navigate("/onboarding?organization=false");
          } else if (entities.length == 1) {
            localStorage.setItem("organizationId", entities[0].entityId);
            localStorage.setItem("userRecords", JSON.stringify(entities[0]));
            setUserAtom(entities[0]);
            navigate("/");
          } else {
            navigate("/select-organization");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching claimed status:", error);
    }
  };
  return (
    <div className="h-screen">
      <div className="flex flex-col flex-1 h-full justify-center items-center">
        <QuestLogin
          googleClientId="55807106386-g68a2ecrld4ul9dppvla4ns6qnn9957t.apps.googleusercontent.com"
          google={false}
          email={true}
          redirectUri="http://localhost:3000/login"
          // redirectURL="http://localhost:3000/onboarding"
          styleConfig={{
            Heading: {
              fontSize: "24px",
              color: "#252525",
              lineHeight: "32px", //e4dc146697414ea8d5543b546e7a28c5494af14fba1bb6c100f1fd514728b4276ec955e102820d41cefb41387030f638
            },
            Description: {},
            Input: {},
            Label: {},
            TextArea: {},
            PrimaryButton: {
              background: "var(--button-background)",
            },
            SecondaryButton: {},
            Form: { boxShadow: "none" },
            Footer: { FooterStyle: {}, FooterText: {}, FooterIcon: {} },
            IconStyle: { BorderColor: "", Background: "", color: "" },
          }}
          showFooter={false}
          descriptionText="Welcome to Quest"
          onSubmit={handleSubmit}
          onError={(e) => Toast.error({ text: e.error })}
        />
      </div>
    </div>
  );
};

export default Login;

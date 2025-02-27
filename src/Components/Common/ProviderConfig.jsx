import { QuestProvider } from "@questlabs/react-sdk";
import { mainConfig } from "../../assets/Config/appConfig";

export const ProviderConfig = ({ children, showTag }) => {
  return (
    <div>
      <QuestProvider
        apiKey={mainConfig?.QUEST_API_KEY}
        entityId={mainConfig?.QUEST_ENTITY_ID}
        apiType="STAGING"
        themeConfig={{
          buttonColor: "var(--button-background)",
        //   primaryColor: bgColors[`${theme}-color-premitive-grey-5`],
        //   // backgroundColor: "transparent",
        }}
      >
        {children}
      </QuestProvider>
      {showTag &&
        <div className='fixed right-[calc(25%-80px)] bottom-14 text-xs px-4 py-2 text-[#939393] rounded-md flex items-center gap-3 cursor-pointer' onClick={() => window.open("https://questlabs.ai/")}>
          <p>Powered by Quest Labs</p>
        </div>
      }
    </div>
  );
};

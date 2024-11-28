import { importConfig } from "../../assets/Config/importConfig";

export default function LoginWrapper({ children }) {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:flex flex-col text-center md:w-1/2  w-1/2 justify-center items-center p-12">
        <div
          className="w-full h-full flex flex-col justify-between items-start rounded-[1.5rem] border-r-[1px] py-[4rem] px-[2.88rem]"
          style={{
            borderRightColor: "#A558FF",
            background:
              "linear-gradient(30deg, #1F3EFE -30.23%, #5578FF 33.75%, #A5ABFF 102.49%)",
          }}
        >
          <div></div>
          <img src={importConfig.home.loginBanner} className="w-full drop-shadow-xl" alt="" />
          <div>
            <img src={importConfig.home.logo} className="w-[130px]" alt="" />
            <p className="text-[#e1e1fb] text-lg mt-3">Unite. Pursue. Achieve. – Your productivity hub.</p>
          </div>
        </div>
      </div>
      <div className="w-full h-screen md:w-1/2">{children}</div>
    </div>
  );
}

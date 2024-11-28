import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import PieChartDetailModal from "./PieChartDetailModal";
import { useAtom } from "jotai";
import { AllUserAtom, TasksAtom } from "../../Atoms/AtomStores";
import { motion } from "framer-motion";
import { containerVariant } from "../../assets/Config/animationVariants";
const SprintReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [tasksAtom, setTaskAtom] = useAtom(TasksAtom);
  const [allUsersAtom, setAllUsersAtom] = useAtom(AllUserAtom);
  const [isRotating, setIsRotating] = useState(false);
  const memoizedPieChartData = useMemo(() => {
    const data = {};

    allUsersAtom?.forEach((el, i) => {
      const colorConfig = [
        "#551e94",
        "#6e38ae",
        "#8852c8",
        "#a16be1",
        "#bb84fb",
        "#6e1acc",
        "#8833e6",
        "#a24dff",
        "#bb66ff",
        "#d480ff",
        "#8c1aff",
        "#a533ff",
        "#be4dff",
        "#d866ff",
        "#f280ff",
        "#aa4eff",
        "#c368ff",
        "#dc82ff",
        "#f69bff",
        "#ffb4ff",
        "#be72ff",
        "#d88bff",
        "#f2a4ff",
        "#ffbeff",
        "#ffd8ff",
      ];
      data[el.userId] = {
        ...el,
        value: 0,
        tasks: [],
        color: colorConfig[i % colorConfig.length],
      };
    });

    tasksAtom?.forEach((task) => {
      let addedUser = [task?.createdBy];

      task?.assignee?.forEach((el) => {
        if (!addedUser.includes(el)) addedUser.push(el);
      });

      addedUser.forEach((el) => {
        if (data[el]) {
          data[el].value += task?.sprintPoints ? Number(task?.sprintPoints) : 0;
          data[el].tasks = [...(data[el]?.tasks || []), task];
        }
      });
    });

    return Object.values(data).filter((el) => el.value > 0);
  }, [tasksAtom, allUsersAtom]);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 500);
  };

  const findCountOfBar = (status) => {
    return tasksAtom?.filter((el) => el.status == status)?.length;
  };

  const data = [
    { name: "To-do", value: findCountOfBar("TO_DO"), color: "#696969" },
    {
      name: "In-Progress",
      value: findCountOfBar("IN_PROGRESS"),
      color: "#0065FF",
    },
    { name: "Closed", value: findCountOfBar("CLOSED"), color: "#098849" },
  ];

  const barChartOptions = {
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisLabel: {
        color: "#4C4C4C",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 20,
        fontFamily: "Figtree",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#4C4C4C",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 16,
        fontFamily: "Figtree",
      },
    },
    series: [
      {
        data: data.map((item) => ({
          value: item.value,
          itemStyle: {
            color: item.color,
          },
        })),
        type: "bar",
        barWidth: 80,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    grid: {
      top: 20,
      right: 30,
      left: 40,
      bottom: 30,
    },
  };
  const pieChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        formatter: "{b} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        show: false,
      },
      series: [
        {
          name: "Users",
          type: "pie",
          radius: "70%",
          avoidLabelOverlap: false,
          data: memoizedPieChartData?.map((item) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color,
            },
          })),
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            formatter: function (params) {
              const label = params.name;
              if (label.length > 10) {
                return label.slice(0, 10) + "\n" + label.slice(10);
              }
              return label;
            },
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 20,
            fontFamily: "Figtree",
            color: "#2C2C2C",
            show: true,
            position: "outside",
            overflow: "break",
          },
          labelLine: {
            show: true,
            length: 20,
            length2: 10,
          },
        },
      ],
      color: ["#FF9999", "#66B2FF"],
    }),
    [memoizedPieChartData]
  );
  const onChartClick = (params) => {
    setModalContent(params);
    setIsModalOpen(true);
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    <motion.div style={{ marginTop: "8px" }}
    variants={containerVariant}
    initial="hidden"
    animate="visible"
    exit={"exit"}
    >
      <div className="flex justify-between items-center w-full h-[6rem] gap-4">
        <div
          className="w-full flex flex-col items-center justify-center border border-[#E2E2E2] rounded-[0.5rem] h-full p-4 gap-4"
          style={{
            boxShadow: "2px 2px 4px 0px rgba(200, 200, 200, 0.40)",
          }}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-[#3E3E3E] font-[500] text-base">
              Total Tasks
            </span>
            {/* <button onClick={handleRefresh}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={isRotating ? "rotate-animation" : ""}
              >
                <path
                  d="M15.8359 6.66683L12.5026 10.0002H15.0026C15.0026 12.7585 12.7609 15.0002 10.0026 15.0002C9.16094 15.0002 8.36094 14.7918 7.66927 14.4168L6.4526 15.6335C7.4776 16.2835 8.69427 16.6668 10.0026 16.6668C13.6859 16.6668 16.6693 13.6835 16.6693 10.0002H19.1693L15.8359 6.66683ZM5.0026 10.0002C5.0026 7.24183 7.24427 5.00016 10.0026 5.00016C10.8443 5.00016 11.6443 5.2085 12.3359 5.5835L13.5526 4.36683C12.5276 3.71683 11.3109 3.3335 10.0026 3.3335C6.31927 3.3335 3.33594 6.31683 3.33594 10.0002H0.835938L4.16927 13.3335L7.5026 10.0002H5.0026Z"
                  fill="#808080"
                />
              </svg>
            </button> */}
          </div>
          <div className="w-full text-[#A558FF] font-[600] text-[1.25rem] leading-[1.875rem] tracking-[-0.025rem]">
            {tasksAtom?.length > 0 ? tasksAtom?.length : 0}
          </div>
        </div>
        <div
          className="w-full flex flex-col items-center justify-center border border-[#E2E2E2] rounded-[0.5rem] h-full p-4 gap-4"
          style={{
            boxShadow: "2px 2px 4px 0px rgba(200, 200, 200, 0.40)",
          }}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-[#3E3E3E] font-[500] text-base">To-do</span>
          </div>
          <div className="w-full text-[#808080] font-[600] text-[1.25rem] leading-[1.875rem] tracking-[-0.025rem]">
            {findCountOfBar("TO_DO") ? findCountOfBar("TO_DO") : 0}
          </div>
        </div>
        <div
          className="w-full flex flex-col items-center justify-center border border-[#E2E2E2] rounded-[0.5rem] h-full p-4 gap-4"
          style={{
            boxShadow: "2px 2px 4px 0px rgba(200, 200, 200, 0.40)",
          }}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-[#3E3E3E] font-[500] text-base">
              In-Progress
            </span>
          </div>
          <div className="w-full text-[#5578FF] font-[600] text-[1.25rem] leading-[1.875rem] tracking-[-0.025rem]">
            {findCountOfBar("IN_PROGRESS") ? findCountOfBar("IN_PROGRESS") : 0}
          </div>
        </div>
        <div
          className="w-full flex flex-col items-center justify-center border border-[#E2E2E2] rounded-[0.5rem] h-full p-4 gap-4"
          style={{
            boxShadow: "2px 2px 4px 0px rgba(200, 200, 200, 0.40)",
          }}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-[#3E3E3E] font-[500] text-base">Closed</span>
          </div>
          <div className="w-full text-[#0DC268] font-[600] text-[1.25rem] leading-[1.875rem] tracking-[-0.025rem]">
            {findCountOfBar("CLOSED") ? findCountOfBar("CLOSED") : 0}
          </div>
        </div>
      </div>

      <div className="w-full h-[60vh] flex items-center gap-6 mt-5">
        <div
          className="w-[50%] h-full flex flex-col gap-2 border border-[#E2E2E2] rounded-[0.75rem]"
          style={{
            boxShadow: "2px 2px 4px 0px rgba(200, 200, 200, 0.20)",
          }}
        >
          <div className="text-[#2C2C2C] font-[600] text-[1.125rem] leading-[1.75rem] tracking-[-0.01125rem] h-[4.25rem] p-[1.25rem] border-b border-b[#EFEFEF] flex items-center justify-between">
            Work Load
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9.9974 14.7915C10.3426 14.7915 10.6224 14.5117 10.6224 14.1665V9.1665C10.6224 8.82133 10.3426 8.5415 9.9974 8.5415C9.65222 8.5415 9.3724 8.82133 9.3724 9.1665V14.1665C9.3724 14.5117 9.65222 14.7915 9.9974 14.7915Z"
                fill="#939393"
              />
              <path
                d="M9.9974 5.83317C10.4576 5.83317 10.8307 6.20627 10.8307 6.6665C10.8307 7.12674 10.4576 7.49984 9.9974 7.49984C9.53716 7.49984 9.16406 7.12674 9.16406 6.6665C9.16406 6.20627 9.53716 5.83317 9.9974 5.83317Z"
                fill="#939393"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.03906 9.99984C1.03906 5.05229 5.04985 1.0415 9.9974 1.0415C14.9449 1.0415 18.9557 5.05229 18.9557 9.99984C18.9557 14.9474 14.9449 18.9582 9.9974 18.9582C5.04985 18.9582 1.03906 14.9474 1.03906 9.99984ZM9.9974 2.2915C5.7402 2.2915 2.28906 5.74264 2.28906 9.99984C2.28906 14.257 5.7402 17.7082 9.9974 17.7082C14.2546 17.7082 17.7057 14.257 17.7057 9.99984C17.7057 5.74264 14.2546 2.2915 9.9974 2.2915Z"
                fill="#939393"
              />
            </svg>
          </div>
          <div className="w-full h-full flex justify-center items-center pb-[1rem]">
            <ReactECharts
              option={barChartOptions}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>
        <div
          className="w-[50%] h-full flex flex-col gap-2 border border-[#E2E2E2] rounded-[0.75rem]"
          style={{
            boxShadow: "2px 2px 4px 0px rgba(200, 200, 200, 0.20)",
          }}
        >
          <div className="text-[#2C2C2C] font-[600] text-[1.125rem] leading-[1.75rem] tracking-[-0.01125rem] h-[4.25rem] p-[1.25rem] border-b border-b[#EFEFEF] flex items-center justify-between">
            Task Report
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9.9974 14.7915C10.3426 14.7915 10.6224 14.5117 10.6224 14.1665V9.1665C10.6224 8.82133 10.3426 8.5415 9.9974 8.5415C9.65222 8.5415 9.3724 8.82133 9.3724 9.1665V14.1665C9.3724 14.5117 9.65222 14.7915 9.9974 14.7915Z"
                fill="#939393"
              />
              <path
                d="M9.9974 5.83317C10.4576 5.83317 10.8307 6.20627 10.8307 6.6665C10.8307 7.12674 10.4576 7.49984 9.9974 7.49984C9.53716 7.49984 9.16406 7.12674 9.16406 6.6665C9.16406 6.20627 9.53716 5.83317 9.9974 5.83317Z"
                fill="#939393"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.03906 9.99984C1.03906 5.05229 5.04985 1.0415 9.9974 1.0415C14.9449 1.0415 18.9557 5.05229 18.9557 9.99984C18.9557 14.9474 14.9449 18.9582 9.9974 18.9582C5.04985 18.9582 1.03906 14.9474 1.03906 9.99984ZM9.9974 2.2915C5.7402 2.2915 2.28906 5.74264 2.28906 9.99984C2.28906 14.257 5.7402 17.7082 9.9974 17.7082C14.2546 17.7082 17.7057 14.257 17.7057 9.99984C17.7057 5.74264 14.2546 2.2915 9.9974 2.2915Z"
                fill="#939393"
              />
            </svg>
          </div>
          <div className="w-full min-h-full flex justify-center items-center pb-[5rem]">
            <ReactECharts
              option={pieChartOptions}
              style={{ height: "400px", width: "100%" }}
              onEvents={onEvents}
            />
          </div>
        </div>
      </div>
      <PieChartDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent}
        pieChartOptions={pieChartOptions}
        memoizedPieChartData={memoizedPieChartData}
      />
    </motion.div>
  );
};

export default SprintReport;

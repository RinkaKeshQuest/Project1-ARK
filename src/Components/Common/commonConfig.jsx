import { PrioritySVG, TagSVG } from "./SideBarSvg"


export const statusConfig = [
    {
        title: "To Do",
        value: "TO_DO",
        background: "#C9C9C9",
        borderColor: "#808080",
        color: "#535353"
    },
    {
        title: "In Progress",
        value: "IN_PROGRESS",
        background: "#E1E1FB",
        borderColor: "#0065FF",
        color: "#0065FF"
    },
    {
        title: "Closed",
        value: "CLOSED",
        background: "#C2F0D9",
        borderColor: "#0DC268",
        color: "#0DC268"
    }
]

export const priorityConfig = [
    {
        title: "Urgent",
        value: "URGENT",
        icon: <PrioritySVG state={"urgent"}/>
    },
    {
        title: "High",
        value: "HIGH",
        icon: <PrioritySVG state={"high"}/>
    },
    {
        title: "Normal",
        value: "NORMAL",
        icon: <PrioritySVG state={"normal"}/>
    },
    {
        title: "Low",
        value: "LOW",
        icon: <PrioritySVG state={"low"}/>
    }
]

export const tagConfig = [
    {
        title: "Task",
        value: "TASK",
        background: "#E1E1FB",
        color: "#8090FF",
        icon: <TagSVG color={"#8090FF"}/>
    },
    {
        title: "Feature",
        value: "FEATURE",
        background: "#C2F0D9",
        color: "#00C16A",
        icon: <TagSVG color={"#00C16A"}/>
    },
    {
        title: "Review",
        value: "REVIEW",
        background: "#D9EFF0",
        color: "#42B2B3",
        icon: <TagSVG color={"#42B2B3"}/>
    },
    {
        title: "Story",
        value: "STORY",
        background: "#F0E1E1",
        color: "#FF9E00",
        icon: <TagSVG color={"#FF9E00"}/>
    },
    {
        title: "Bug",
        value: "BUG",
        background: "#F0E1E1",
        color: "#F57189",
        icon: <TagSVG color={"#F57189"}/>
    }   
]
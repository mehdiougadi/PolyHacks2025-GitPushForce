import Feature from "@common/interfaces/feature";

const features: Feature[] = [
    {
        name: "Profile",
        icon: require("@client/assets/icons/features/farmer-logo.png"),
        route: "/(app)/profile",
    },
    {
        name: "Advisor",
        icon: require("@client/assets/icons/features/advisor-logo.png"),
        route: "/(app)/advisor",
    },
    {
        name: "Inventory",
        icon: require("@client/assets/icons/features/box-logo.png"),
        route: "/(app)/inventory",
    },
    {
        name: "Weather",
        icon: require("@client/assets/icons/features/weather-logo.png"),
        route: "/(app)/weather",
    },
    {
        name: "Todo List",
        icon: require("@client/assets/icons/features/todo-list-logo.png"),
        route: "/(app)/todo",
    },
    
];

export default features;
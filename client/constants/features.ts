import Feature from "@common/interfaces/feature";

const features: Feature[] = [
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
    
];

export default features;
import Feature from "@common/interfaces/feature";

const features: Feature[] = [
    {
        name: "Advisor",
        icon: require("@client/assets/icons/features/advisor-logo.png"),
        route: "/(app)/advisor",
    },
    {
        name: "Inventory",
        icon: require("@client/assets/icons/features/weither-logo.png"),
        route: "/(app)/inventory",
    },
];

export default features;
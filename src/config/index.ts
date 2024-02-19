import defaultConfig from "./default";
import prodConfig from "./prod";

export default process.env.NODE_ENV === "development" ? defaultConfig : { ...defaultConfig, ...prodConfig };

import { message } from "antd";
import { TH } from "../constants/th";

export const handleError = (error: unknown, fallbackMessage: string = TH.COMMON.ERROR) => {
  console.error("App Error:", error);

  if (error instanceof Error) {
    message.error(error.message);
  } else if (typeof error === "string") {
    message.error(error);
  } else {
    message.error(fallbackMessage);
  }
};

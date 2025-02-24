import moment from "moment";

const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();
  // here file last extension mil jaega
  if (fileExt === "mp4" || fileExt == "webm" || fileExt == "ogg") {
    return "video";
  }
  if (fileExt === "mp3" || fileExt == "wev") {
    return "audio";
  }
  if (fileExt === "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt === "gif") {
    return "image";
  }
  return "file";
};

// `/upload/w${width},dpr_auto/ jitnna size ka size image rhega \
// utna hi wo dikhega on clicking , on that image
const transformImage = (url = "", width = 100) =>{
      
  const newUrl=url.replace("/upload",`/upload/dpr_auto/w_${width}`)



  return newUrl;
}

const getLast7Days = () => {
  const currentDate = moment();
  const Last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    Last7Days.unshift(dayName);
  }
  return Last7Days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, transformImage, getLast7Days,getOrSaveFromStorage };

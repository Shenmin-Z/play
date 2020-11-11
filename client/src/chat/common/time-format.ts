export let formatTime = (
  timestamp: number,
  en_zh: (en: string, zh: string) => string
) => {
  if (timestamp === 0) return "";

  let time = new Date(timestamp * 1000);
  let hours = time.getHours();
  let isAM = hours <= 12;
  hours = hours > 12 ? hours - 12 : hours;
  let minutes = time.getMinutes() + "";
  minutes = minutes.length === 1 ? "0" + minutes : minutes;
  return en_zh(
    `${hours}:${minutes} ${isAM ? "AM" : "PM"}`,
    `${isAM ? "上午" : "下午"} ${hours}:${minutes}`
  );
};

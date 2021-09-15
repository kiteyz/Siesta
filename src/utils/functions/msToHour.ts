export default (time: Number) => {
  time = Math.round((time as number) / 1000);
  const s = (time as number) % 60,
    m = ~~(((time as number) / 60) % 60),
    h = ~~((time as number) / 60 / 60);

  return h === 0
    ? `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(Math.abs(h) % 24).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}:${String(s).padStart(2, "0")}`;
};

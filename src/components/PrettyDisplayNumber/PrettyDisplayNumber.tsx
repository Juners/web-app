function PrettyDisplayNumber({
  children,
  max,
}: {
  children: number;
  max: number;
}) {
  const isNegative = children < 0;
  const maxSize = `${max}`.length;
  const size = `${isNegative ? children * -1 : children}`.length;
  return (
    <div
      style={{
        width: `${maxSize + 1}ch`,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <div
        style={{
          width: "1ch",
        }}
      >
        {isNegative ? "-" : "+"}
      </div>
      <div>
        {maxSize - size > 0 && new Array(maxSize - size).fill("0").join("")}
      </div>
      <div>{isNegative ? children * -1 : children}</div>
    </div>
  );
}

export default PrettyDisplayNumber;

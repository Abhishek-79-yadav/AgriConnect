import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";

export default function CropChart({
  data,
}) {
  const colors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#9C27B0",
  ];

  return (
    <PieChart
      width={400}
      height={300}
    >
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
      >
        {data.map(
          (entry, index) => (
            <Cell
              key={index}
              fill={
                colors[
                  index %
                    colors.length
                ]
              }
            />
          )
        )}
      </Pie>

      <Tooltip />
    </PieChart>
  );
}
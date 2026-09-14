import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UserChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="users" />
      </BarChart>
    </ResponsiveContainer>
  );
}
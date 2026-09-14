import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OrdersChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <Tooltip />

        <Bar
          dataKey="orders"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
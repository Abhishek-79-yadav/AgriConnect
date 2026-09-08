import EmptyState from "../ui/EmptyState";

export default function NoData({ message = "No data available" }) {
  return <EmptyState title={message} />;
}

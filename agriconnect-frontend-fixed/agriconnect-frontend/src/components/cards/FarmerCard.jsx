import { MapPin, Phone } from "lucide-react";
import Avatar from "../ui/Avatar";

export default function FarmerCard({ farmer }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-line bg-card p-4">
      <Avatar name={farmer.name} size={44} />
      <div>
        <p className="font-display text-ink">{farmer.name}</p>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-ink/60">
          {(farmer.village || farmer.city) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {farmer.village || farmer.city}
            </span>
          )}
          {farmer.mobile && (
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {farmer.mobile}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

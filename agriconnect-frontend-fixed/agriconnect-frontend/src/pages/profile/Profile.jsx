import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, KeyRound, Mail, Phone, MapPin, Sprout, Save, Settings } from "lucide-react";

import { getProfile } from "../../api/authApi";
import { resendVerification } from "../../api/authApi";
import { getFarmProfileApi, updateFarmProfileApi } from "../../api/farmerApi";
import Loader from "../../components/ui/Loader";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ROLE_TONE = { ADMIN: "gold", FARMER: "field", BUYER: "slate" };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [farmProfile, setFarmProfile] = useState(null);
  const [savingFarm, setSavingFarm] = useState(false);
  const [resending, setResending] = useState(false);

  const sendVerification = async () => {
    setResending(true);
    try {
      await resendVerification();
      toast.success("Verification email sent — check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send verification email");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  useEffect(() => {
    if (profile?.role === "FARMER") {
      getFarmProfileApi().then(setFarmProfile).catch(() => setFarmProfile({}));
    }
  }, [profile?.role]);

  const setFarmField = (field) => (e) => setFarmProfile((p) => ({ ...p, [field]: e.target.value }));

  const saveFarmProfile = async () => {
    setSavingFarm(true);
    try {
      await updateFarmProfileApi({
        ...farmProfile,
        landSizeAcres: farmProfile.landSizeAcres ? Number(farmProfile.landSizeAcres) : null,
      });
      toast.success("Farm details saved");
    } catch {
      toast.error("Could not save farm details");
    } finally {
      setSavingFarm(false);
    }
  };

  if (!profile) return <Loader label="Loading profile..." full />;

  return (
    <div className="mx-auto max-w-lg">
      {!profile.emailVerified && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-gold/30 bg-gold-light p-4">
          <p className="text-sm text-gold-dark">Your email isn't verified yet.</p>
          <Button size="sm" loading={resending} onClick={sendVerification}>
            Resend verification email
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-line bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} size={56} />
          <div>
            <h1 className="font-display text-xl text-ink">{profile.name}</h1>
            <Badge text={profile.role} tone={ROLE_TONE[profile.role] || "neutral"} className="mt-1" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-sm text-ink/70">
          <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {profile.email}</span>
          {profile.mobile && <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {profile.mobile}</span>}
          {(profile.city || profile.state) && (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Link to="/profile/edit">
            <Button variant="outline"><Pencil className="h-4 w-4" /> Edit profile</Button>
          </Link>
          <Link to="/profile/change-password">
            <Button variant="ghost"><KeyRound className="h-4 w-4" /> Change password</Button>
          </Link>
          <Link to="/profile/account-settings">
            <Button variant="ghost"><Settings className="h-4 w-4" /> Account settings</Button>
          </Link>
        </div>
      </div>

      {profile.role === "FARMER" && farmProfile && (
        <div className="mt-4 rounded-lg border border-line bg-card p-6">
          <p className="flex items-center gap-2 font-display text-lg text-ink">
            <Sprout className="h-5 w-5 text-field-dark" /> Farm details
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Input label="Land size (acres)" type="number" min="0" step="0.1" value={farmProfile.landSizeAcres || ""} onChange={setFarmField("landSizeAcres")} />
            <Input label="Soil type" value={farmProfile.soilType || ""} onChange={setFarmField("soilType")} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={farmProfile.city || ""} onChange={setFarmField("city")} />
              <Input label="State" value={farmProfile.state || ""} onChange={setFarmField("state")} />
            </div>
            <Button onClick={saveFarmProfile} loading={savingFarm} className="mt-1 self-start">
              <Save className="h-4 w-4" /> Save farm details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { getProfileThunk, updateProfileThunk } from "../../redux/thunks/userThunk";
import ProfileForm from "../../components/forms/ProfileForm";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";

export default function EditProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  const updateHandler = async (data) => {
    const result = await dispatch(updateProfileThunk(data));

    if (updateProfileThunk.fulfilled.match(result)) {
      toast.success("Profile updated");
    } else {
      toast.error(result.payload?.message || "Failed to update profile");
    }
  };

  if (!profile) return <Loader label="Loading profile..." full />;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Edit profile" />
      <div className="rounded-lg border border-line bg-card p-6">
        <ProfileForm profile={profile} onSubmit={updateHandler} />
      </div>
    </div>
  );
}

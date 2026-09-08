import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Video, UploadCloud } from "lucide-react";

import { fetchMyProductsThunk } from "../../redux/thunks/farmerThunk";
import { uploadProductVideoApi } from "../../api/videoApi";
import PageHeader from "../../components/common/PageHeader";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

// The real endpoint (POST /api/videos/upload) links a video to one of the
// farmer's OWN products with a title — it's not a generic file upload, so
// this needs a product picker + title, not just a file input.
export default function UploadVideo() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.farmer);

  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProductsThunk());
  }, [dispatch]);

  const upload = async (e) => {
    e.preventDefault();
    if (!productId || !title.trim() || !file) {
      toast.error("Pick a product, add a title and choose a video");
      return;
    }

    setUploading(true);
    try {
      await uploadProductVideoApi({ productId: Number(productId), title: title.trim(), file });
      toast.success("Video uploaded");
      setTitle("");
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Upload product video" subtitle="Show buyers your farm and produce." />

      <form onSubmit={upload} className="max-w-md rounded-lg border border-line bg-card p-6">
        <div className="flex flex-col gap-4">
          <Select
            label="Product"
            required
            placeholder={products.length ? "Select a product" : "Add a product first"}
            options={products.map((p) => ({ value: p.id, label: p.productName || p.name }))}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />

          <Input label="Video title" required placeholder="e.g. Farm tour — organic wheat" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="flex cursor-pointer flex-col items-center gap-3 rounded border border-dashed border-line bg-paper p-8 text-center">
            {file ? <Video className="h-10 w-10 text-gold-dark" /> : <UploadCloud className="h-10 w-10 text-ink/30" />}
            <span className="text-sm text-ink/70">{file ? file.name : "Click to choose a video file"}</span>
            <input type="file" accept="video/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </label>

          <Button type="submit" loading={uploading}>Upload</Button>
        </div>
      </form>
    </div>
  );
}

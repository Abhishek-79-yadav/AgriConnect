import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import { getAllCropsApi, createCropApi } from "../../api/cropApi";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Select from "../ui/Select";
import Button from "../ui/Button";

const UNIT_OPTIONS = [
  { value: "KG", label: "Kilogram" },
  { value: "GM", label: "Gram" },
  { value: "QUINTAL", label: "Quintal" },
];

export default function ProductForm({ onSubmit, initialData = {}, submitting = false }) {
  const [crops, setCrops] = useState([]);
  const [addingCrop, setAddingCrop] = useState(false);
  const [newCropName, setNewCropName] = useState("");
  const [creatingCrop, setCreatingCrop] = useState(false);

  const [product, setProduct] = useState({
    productName: initialData.productName || "",
    price: initialData.price || "",
    quantity: initialData.quantity || "",
    unit: initialData.unit || "KG",
    cropId: initialData.cropId || "",
    category: initialData.category || "",
    description: initialData.description || "",
    city: initialData.city || "",
    state: initialData.state || "",
    country: initialData.country || "India",
    imageUrl: initialData.imageUrl || "",
  });

  // The backend links every product to an existing Crop record (cropId),
  // not a free-text crop name — so this is a picker, with a quick way to
  // create a crop inline for farmers whose crop isn't listed yet.
  const loadCrops = () => getAllCropsApi().then(setCrops).catch(() => setCrops([]));

  useEffect(() => {
    loadCrops();
  }, []);

  const set = (field) => (e) => setProduct({ ...product, [field]: e.target.value });

  const addCrop = async () => {
    if (!newCropName.trim()) return;
    setCreatingCrop(true);
    try {
      const crop = await createCropApi({ name: newCropName.trim() });
      await loadCrops();
      setProduct((p) => ({ ...p, cropId: crop.id }));
      setNewCropName("");
      setAddingCrop(false);
      toast.success("Crop added");
    } catch {
      toast.error("Could not add crop");
    } finally {
      setCreatingCrop(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!product.cropId) {
          toast.error("Please select a crop");
          return;
        }
        onSubmit({ ...product, cropId: Number(product.cropId) });
      }}
      className="flex flex-col gap-4"
    >
      <Input label="Product name" required value={product.productName} onChange={set("productName")} />

      {!addingCrop ? (
        <div className="flex items-end gap-2">
          <Select
            label="Crop"
            required
            placeholder={crops.length ? "Select a crop" : "No crops yet — add one"}
            options={crops.map((c) => ({ value: c.id, label: c.name }))}
            value={product.cropId}
            onChange={set("cropId")}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="md" onClick={() => setAddingCrop(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-end gap-2 rounded border border-line bg-paper p-3">
          <Input label="New crop name" placeholder="e.g. Wheat" value={newCropName} onChange={(e) => setNewCropName(e.target.value)} className="flex-1" />
          <Button type="button" onClick={addCrop} loading={creatingCrop}>Add</Button>
          <Button type="button" variant="ghost" onClick={() => setAddingCrop(false)}>Cancel</Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Price (₹)" type="number" min="0" step="0.01" required value={product.price} onChange={set("price")} />
        <Select label="Unit" options={UNIT_OPTIONS} value={product.unit} onChange={set("unit")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Available quantity" type="number" min="0" step="0.01" value={product.quantity} onChange={set("quantity")} />
        <Input label="Category" placeholder="e.g. Vegetables" value={product.category} onChange={set("category")} />
      </div>

      <TextArea label="Description" rows={3} value={product.description} onChange={set("description")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="City" value={product.city} onChange={set("city")} />
        <Input label="State" value={product.state} onChange={set("state")} />
        <Input label="Country" value={product.country} onChange={set("country")} />
      </div>

      <Input label="Image URL" placeholder="https://..." value={product.imageUrl} onChange={set("imageUrl")} />

      <Button type="submit" loading={submitting} className="mt-2 self-start">
        {initialData.id ? "Save changes" : "Add product"}
      </Button>
    </form>
  );
}

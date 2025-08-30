import ImageUploadPreview from "@/components/ui/form/ImageUploadPreview";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import ToggleSwitch from "@/components/ui/form/ToggleSwitch";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";

export interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const mockOffers: Offer[] = [
  {
    id: "off-1",
    title: "Summer Sale 2025",
    description: "Up to 50% off on all summer apparel.",
    imageUrl: "https://placehold.co/600x300/ef4444/ffffff?text=Summer+Sale",
    isActive: true,
  },
  {
    id: "off-2",
    title: "Tech Bonanza",
    description: "Great deals on the latest electronics.",
    imageUrl: "https://placehold.co/600x300/3b82f6/ffffff?text=Tech+Deals",
    isActive: false,
  },
];

// 3. Offers Manager
const OfferForm = ({
  offer,
  onSave,
  onCancel,
}: {
  offer?: Offer | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: offer?.title || "",
    description: offer?.description || "",
    isActive: offer?.isActive === undefined ? true : offer.isActive,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ id: offer?.id, ...formData, imageFile });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-primary-500"
    >
      <h3 className="font-medium mb-4">
        {offer ? "Edit Offer" : "Add New Offer"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input
            label="Offer Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <ToggleSwitch
            label="Active Status"
            enabled={formData.isActive}
            setEnabled={(val) => setFormData({ ...formData, isActive: val })}
          />
        </div>
        <ImageUploadPreview
          label="Offer Image"
          onFileChange={setImageFile}
          previewUrl={offer?.imageUrl}
          size="w-full h-48"
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white"
        >
          Save Offer
        </button>
      </div>
    </form>
  );
};

const OffersManager = () => {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [editingOffer, setEditingOffer] = useState<Offer | null | undefined>(
    undefined
  );

  const handleSave = (data: any) => {
    console.log("Saving offer:", data);
    setEditingOffer(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Offers</h2>
        <button
          onClick={() => setEditingOffer(null)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        >
          <PlusCircle size={18} /> Add New Offer
        </button>
      </div>

      {editingOffer !== undefined && (
        <OfferForm
          offer={editingOffer}
          onSave={handleSave}
          onCancel={() => setEditingOffer(undefined)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-lg bg-white dark:bg-neutral-800 shadow-sm overflow-hidden group"
          >
            <div className="relative">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                width={600}
                height={192}
                className="h-48 w-full object-cover"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    offer.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-200 text-neutral-800"
                  }`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100">
                {offer.title}
              </h3>
              <p className="text-sm text-neutral-500 mt-1 h-10">
                {offer.description}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEditingOffer(offer)}
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500"
                >
                  Edit
                </button>
                <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersManager;

import { useState } from "react";
import { authFetch } from "../../../utils/auth";

const AddApartment = ({ floorId, floorName, onClose, onApartmentAdded }) => {

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

    const [formData, setFormData] = useState({
        name: "",
        status: "",
        partitions: false,
        complete: false,
        partitions_no: 0,
        monthly: false,
        daily: false,
        price: "",
        balance: "",
    });

    const [loading, setLoading] = useState(false);

    // Handle normal inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Complete checkbox
    const handleCompleteChange = (e) => {
        const checked = e.target.checked;

        setFormData((prev) => ({
            ...prev,
            complete: checked,

            // If complete is selected,
            // partitions must be false
            partitions: checked ? false : prev.partitions,

            // Reset partition number
            partitions_no: checked ? 0 : prev.partitions_no,

            // Default status when complete is selected
            status: checked ? "available" : "",

            // Reset fields when unchecked
            monthly: checked ? prev.monthly : false,
            daily: checked ? prev.daily : false,
            price: checked ? prev.price : "",
            balance: checked ? prev.balance : "",
        }));
    };

    // Partitions checkbox
    const handlePartitionsChange = (e) => {
        const checked = e.target.checked;

        setFormData((prev) => ({
            ...prev,
            partitions: checked,

            // If partitions is selected,
            // complete must be false
            complete: checked ? false : prev.complete,

            // Hide/reset fields that are not needed
            status: checked ? "" : prev.status,
            monthly: checked ? false : prev.monthly,
            daily: checked ? false : prev.daily,
            price: checked ? "" : prev.price,
            balance: checked ? "" : prev.balance,

            partitions_no: checked
                ? prev.partitions_no
                : 0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const dataToSend = {
                name: formData.name,
                floor: floorId,

                partitions: formData.partitions,
                complete: formData.complete,

                // Only send partition number for partitions
                partitions_no: formData.partitions
                    ? Number(formData.partitions_no)
                    : 0,

                // Only send these fields for complete apartment
                status: formData.complete
                    ? formData.status
                    : "available",

                monthly: formData.complete
                    ? formData.monthly
                    : false,

                daily: formData.complete
                    ? formData.daily
                    : false,

                price: formData.complete
                    ? formData.price
                    : "0",

                balance: formData.complete
                    ? formData.balance
                    : "0",
            };

            const response = await authFetch(
                `${BASE}/api/apartments/add/`,
                {
                    method: "POST",
                    body: JSON.stringify(dataToSend),
                }
            );

            const data = await response.json();

            // if (!response.ok) {
            //     // console.error("Server error:", data);
            //     // throw new Error("Failed to add apartment");
            //     const errorData = await response.json();
            //     console.error("Server error:", errorData);
            //     throw new Error("Failed to add apartment");
            // }
            
            if (!response.ok) {
                const errorText = await response.text();

                console.error("HTTP Status:", response.status);
                console.error("Server response:", errorText);

                throw new Error(
                    `Failed to add apartment: ${response.status} ${errorText}`
                );
            }

            // Notify Units page
            if (onApartmentAdded) {
                onApartmentAdded(data);
            }

            // Close modal
            onClose();

        } catch (error) {
            console.error("Error adding apartment:", error);
            alert("حدث خطأ أثناء إضافة الشقة");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >

            {/* Modal */}
            <div
                className="
                    w-full
                    max-w-lg
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-xl
                    bg-white
                    shadow-xl
                "
            >

                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                        px-5
                        py-4
                    "
                >

                    <h2 className="text-lg font-bold text-gray-800">
                        إضافة شقة
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        الطابق:{" "}
                        <span className="font-semibold text-blue-600">
                            {floorName}
                        </span>
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl"
                    >
                        ×
                    </button>

                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-5 space-y-5"
                >

                    {/* Apartment Name */}
                    <div>

                        <label className="block mb-2 font-medium text-gray-700">
                            اسم الشقة
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="مثال: شقة 101"
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                outline-none
                                focus:border-blue-500
                                focus:ring-1
                                focus:ring-blue-500
                            "
                        />

                    </div>


                    {/* Apartment Type */}
                    <div>

                        <label className="block mb-3 font-medium text-gray-700">
                            نوع الشقة
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">

                            {/* Complete */}
                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    cursor-pointer
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-3
                                    flex-1
                                "
                            >

                                <input
                                    type="checkbox"
                                    name="complete"
                                    checked={formData.complete}
                                    onChange={handleCompleteChange}
                                    className="h-4 w-4"
                                />

                                <span>
                                    شقة كاملة
                                </span>

                            </label>


                            {/* Partitions */}
                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    cursor-pointer
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-3
                                    flex-1
                                "
                            >

                                <input
                                    type="checkbox"
                                    name="partitions"
                                    checked={formData.partitions}
                                    onChange={handlePartitionsChange}
                                    className="h-4 w-4"
                                />

                                <span>
                                    شقة مقسمة
                                </span>

                            </label>

                        </div>

                    </div>


                    {/* Partitions Number */}
                    {formData.partitions && (

                        <div>

                            <label className="block mb-2 font-medium text-gray-700">
                                عدد الأقسام
                            </label>

                            <input
                                type="number"
                                name="partitions_no"
                                value={formData.partitions_no}
                                onChange={handleChange}
                                min="1"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                "
                            />

                        </div>

                    )}


                    {/* Complete Apartment Fields */}
                    {formData.complete && (

                        <div className="space-y-4">

                            {/* Status */}
                            <div>

                                <label className="block mb-2 font-medium text-gray-700">
                                    حالة الشقة
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-3
                                        py-2
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-1
                                        focus:ring-blue-500
                                    "
                                >

                                    <option value="">
                                        اختر الحالة
                                    </option>

                                    <option value="available">
                                        متاحة
                                    </option>

                                    <option value="occupied">
                                        مشغولة
                                    </option>

                                    <option value="maintenance">
                                        صيانة
                                    </option>

                                </select>

                            </div>


                            {/* Monthly / Daily */}
                            <div className="flex gap-4">

                                <label
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        cursor-pointer
                                    "
                                >

                                    <input
                                        type="checkbox"
                                        name="monthly"
                                        checked={formData.monthly}
                                        onChange={handleChange}
                                        className="h-4 w-4"
                                    />

                                    <span>
                                        شهري
                                    </span>

                                </label>


                                <label
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        cursor-pointer
                                    "
                                >

                                    <input
                                        type="checkbox"
                                        name="daily"
                                        checked={formData.daily}
                                        onChange={handleChange}
                                        className="h-4 w-4"
                                    />

                                    <span>
                                        يومي
                                    </span>

                                </label>

                            </div>


                            {/* Price */}
                            <div>

                                <label className="block mb-2 font-medium text-gray-700">
                                    السعر
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-3
                                        py-2
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-1
                                        focus:ring-blue-500
                                    "
                                />

                            </div>


                            {/* Balance */}
                            <div>

                                <label className="block mb-2 font-medium text-gray-700">
                                    الرصيد
                                </label>

                                <input
                                    type="number"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-3
                                        py-2
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-1
                                        focus:ring-blue-500
                                    "
                                />

                            </div>

                        </div>

                    )}


                    {/* Buttons */}
                    <div className="flex gap-3 pt-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex-1
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-gray-700
                                hover:bg-gray-100
                            "
                        >
                            إلغاء
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "جاري الحفظ..."
                                : "إضافة الشقة"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddApartment;

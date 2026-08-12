import { useState } from "react";
import { authFetch } from "../../../utils/auth";
import { FaTimes } from "react-icons/fa";

const AddPartition = ({
    ApartmentId,
    ApartmentName,
    onClose,
    onPartitionAdded,
}) => {

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

    const [formData, setFormData] = useState({
        name: "",
        daily: false,
        monthly: false,
        price: "",
        balance: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const dataToSend = {
                name: formData.name.trim(),

                apartment: ApartmentId,

                daily: formData.daily,

                monthly: formData.monthly,

                price: formData.price
                    ? Number(formData.price)
                    : 0,

                balance: formData.balance
                    ? Number(formData.balance)
                    : 0,
            };


            const response = await authFetch(
                `${BASE}/api/partitions/add/`,
                {
                    method: "POST",
                    body: JSON.stringify(dataToSend),
                }
            );


            if (!response.ok) {

                const errorData = await response.json();

                console.error(
                    "Server error:",
                    errorData
                );

                throw new Error(
                    "Failed to add partition"
                );
            }


            const data = await response.json();

            console.log(
                "Partition created:",
                data
            );


            if (onPartitionAdded) {
                onPartitionAdded();
            }

            onClose();

        } catch (error) {

            console.error(
                "Error adding partition:",
                error
            );

            setError(
                "حدث خطأ أثناء إضافة التقسيم"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div
            dir="rtl"
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    bg-white
                    shadow-xl
                    overflow-hidden
                "
            >

                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        bg-blue-50
                        px-5
                        py-4
                        border-b
                        border-blue-100
                    "
                >

                    <div>

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                        ">
                            أضافة بارتيشن
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            الشقة:{" "}
                            <span className="
                                font-semibold
                                text-blue-600
                            ">
                                {ApartmentName}
                            </span>
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            cursor-pointer
                            text-gray-500
                            hover:text-red-500
                            transition
                        "
                    >
                        <FaTimes size={18} />
                    </button>

                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-5 space-y-4"
                >

                    {/* Name */}
                    <div>

                        <label className="
                            block
                            mb-1
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            اسم البارتيشن
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="مثال: تقسيم 1"
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


                    {/* Monthly / Daily */}
                    <div className="
                        grid
                        grid-cols-2
                        gap-3
                    ">

                        <label className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-gray-200
                            p-3
                            cursor-pointer
                        ">

                            <input
                                type="checkbox"
                                name="monthly"
                                checked={formData.monthly}
                                onChange={handleChange}
                                className="cursor-pointer"
                            />

                            <span>
                                شهري
                            </span>

                        </label>


                        <label className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-gray-200
                            p-3
                            cursor-pointer
                        ">

                            <input
                                type="checkbox"
                                name="daily"
                                checked={formData.daily}
                                onChange={handleChange}
                                className="cursor-pointer"
                            />

                            <span>
                                يومي
                            </span>

                        </label>

                    </div>


                    {/* Price */}
                    <div>

                        <label className="
                            block
                            mb-1
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            السعر
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
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

                        <label className="
                            block
                            mb-1
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            الرصيد
                        </label>

                        <input
                            type="number"
                            name="balance"
                            value={formData.balance}
                            onChange={handleChange}
                            step="0.01"
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


                    {/* Error */}
                    {error && (
                        <div className="
                            rounded-lg
                            bg-red-50
                            px-3
                            py-2
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </div>
                    )}


                    {/* Buttons */}
                    <div className="
                        flex
                        gap-3
                        pt-2
                    ">

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
                                cursor-pointer
                            "
                        >
                            {loading
                                ? "جاري الإضافة..."
                                : "إضافة التقسيم"}
                        </button>


                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-gray-700
                                hover:bg-gray-50
                                cursor-pointer
                            "
                        >
                            إلغاء
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddPartition;
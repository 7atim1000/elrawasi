import { useEffect, useState } from "react";
import { authFetch } from "../../utils/auth";

import {
    FaBuilding,
    FaThLarge,
    FaMoneyBillWave,
} from "react-icons/fa";

const Dashboard = () => {

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

    const [stats, setStats] = useState({
        apartments_count: 0,
        partitions_count: 0,
        apartment_price: 0,
        partition_price: 0,
        total_price: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    // ------------------------------------------------
    // Fetch Dashboard Statistics
    // ------------------------------------------------

    const fetchDashboardStats = async () => {

        try {

            setLoading(true);
            setError(false);

            const response = await authFetch(
                `${BASE}/api/dashboard/stats/`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch dashboard statistics"
                );
            }

            const data = await response.json();

            setStats(data);

        } catch (error) {

            console.error(
                "Error fetching dashboard stats:",
                error
            );

            setError(true);

        } finally {

            setLoading(false);

        }
    };


    // ------------------------------------------------
    // Load Dashboard
    // ------------------------------------------------

    useEffect(() => {

        fetchDashboardStats();

    }, []);


    // ------------------------------------------------
    // Format Price
    // ------------------------------------------------

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

    };


    return (

        <div
            dir="rtl"
            className="
                w-full
                p-3
                sm:p-2
                md:p-6
            "
        >

            {/* ---------------------------------------- */}
            {/* Page Header */}
            {/* ---------------------------------------- */}

            <div
                className="
                    mb-5
                    sm:mb-6
                "
            >

                <h1
                    className="
                        text-xl
                        sm:text-2xl
                        font-extrabold
                        text-gray-800
                    "
                >
                    لوحة التحكم
                </h1>

                <p
                    className="
                        mt-1
                        text-sm
                        text-gray-500
                    "
                >
                    نظرة عامة على الوحدات والتقسيمات
                </p>

            </div>


            {/* ---------------------------------------- */}
            {/* Error */}
            {/* ---------------------------------------- */}

            {error && (

                <div
                    className="
                        mb-5
                        bg-red-50
                        border
                        border-red-200
                        text-red-600
                        rounded-lg
                        p-4
                        text-sm
                    "
                >
                    حدث خطأ أثناء تحميل بيانات لوحة التحكم
                </div>

            )}


            {/* ---------------------------------------- */}
            {/* Statistics Cards */}
            {/* ---------------------------------------- */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-3
                    sm:gap-4
                    lg:gap-5
                "
            >

                {/* ==================================== */}
                {/* Apartments */}
                {/* ==================================== */}

                <div
                    className="
                        bg-white
                        rounded-xl
                        border
                        border-blue-100
                        shadow-[0_0_5px_rgba(0,0,0,0.2)]
                        p-4
                        sm:p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                عدد الشقق
                            </p>


                            {loading ? (

                                <div
                                    className="
                                        mt-2
                                        h-8
                                        w-16
                                        bg-gray-200
                                        rounded
                                        animate-pulse
                                    "
                                />

                            ) : (

                                <p
                                    className="
                                        mt-1
                                        text-2xl
                                        sm:text-3xl
                                        font-bold
                                        text-gray-800
                                    "
                                >
                                    {stats.apartments_count}
                                </p>

                            )}

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                w-12
                                h-12
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                flex-shrink-0
                                
                            "
                        >

                            <FaBuilding
                                size={20}
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================== */}
                {/* Partitions */}
                {/* ==================================== */}

                <div
                    className="
                        bg-white
                        rounded-xl
                        border
                        border-green-100
                        shadow-[0_0_5px_rgba(0,0,0,0.2)]
                        p-4
                        sm:p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                عدد البارتيشنس
                            </p>


                            {loading ? (

                                <div
                                    className="
                                        mt-2
                                        h-8
                                        w-16
                                        bg-gray-200
                                        rounded
                                        animate-pulse
                                    "
                                />

                            ) : (

                                <p
                                    className="
                                        mt-1
                                        text-2xl
                                        sm:text-3xl
                                        font-bold
                                        text-gray-800
                                    "
                                >
                                    {stats.partitions_count}
                                </p>

                            )}

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                w-12
                                h-12
                                rounded-xl
                                bg-green-100
                                text-green-600
                                flex-shrink-0
                            "
                        >

                            <FaThLarge
                                size={20}
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================== */}
                {/* Total Price */}
                {/* ==================================== */}

                <div
                    className="
                        bg-white
                        rounded-xl
                        border
                        border-yellow-100
                        shadow-[0_0_5px_rgba(0,0,0,0.2)]
                        p-4
                        sm:p-5
                        sm:col-span-2
                        lg:col-span-1
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <div className="min-w-0">

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                إجمالي الأسعار
                            </p>


                            {loading ? (

                                <div
                                    className="
                                        mt-2
                                        h-8
                                        w-28
                                        bg-gray-200
                                        rounded
                                        animate-pulse
                                    "
                                />

                            ) : (

                                <p
                                    className="
                                        mt-1
                                        text-xl
                                        sm:text-2xl
                                        font-bold
                                        text-gray-800
                                        truncate
                                    "
                                >
                                    {formatPrice(
                                        stats.total_price
                                    )}
                                </p>

                            )}

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                w-12
                                h-12
                                rounded-xl
                                bg-yellow-100
                                text-yellow-600
                                flex-shrink-0
                            "
                        >

                            <FaMoneyBillWave
                                size={20}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* ---------------------------------------- */}
            {/* Price Details */}
            {/* ---------------------------------------- */}

            <div
                className="
                    mt-4
                    sm:mt-5
                    bg-white
                    rounded-xl
                    border
                    border-gray-100
                    shadow-sm
                    p-4
                    sm:p-5
                "
            >

                <h2
                    className="
                        text-base
                        sm:text-lg
                        font-bold
                        text-gray-800
                        mb-4
                    "
                >
                    تفاصيل الأسعار
                </h2>


                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-3
                        
                    "
                >

                    {/* Apartment Price */}

                    <div
                        className="
                            bg-blue-50
                            rounded-lg
                            p-3
                            sm:p-4
                            shadow-[0_0_5px_rgba(0,0,0,0.3)]
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-gray-500
                            "
                        >
                            اجمالي ايجار الشقق
                        </p>

                        <p
                            className="
                                mt-1
                                text-lg
                                sm:text-xl
                                font-bold
                                text-blue-700
                            "
                        >
                            {loading
                                ? "..."
                                : formatPrice(
                                    stats.apartment_price
                                )}
                        </p>

                    </div>


                    {/* Partition Price */}

                    <div
                        className="
                            bg-green-50
                            rounded-lg
                            p-3
                            sm:p-4
                            shadow-[0_0_5px_rgba(0,0,0,0.3)]
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-gray-500
                            "
                        >
                            اجمالي ايجار البارتيشنس
                        </p>

                        <p
                            className="
                                mt-1
                                text-lg
                                sm:text-xl
                                font-bold
                                text-green-700
                            "
                        >
                            {loading
                                ? "..."
                                : formatPrice(
                                    stats.partition_price
                                )}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;
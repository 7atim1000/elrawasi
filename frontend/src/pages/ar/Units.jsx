import { useEffect, useState } from "react";
import { authFetch } from "../../utils/auth";

import {
    FaPlus,
    FaChevronDown,
    FaChevronUp,
    FaTrash
} from "react-icons/fa";

import AddApartment from "../../components/ar/addUnits/AddApartment";
import AddPartition from "../../components/ar/addUnits/AddPartition";

function Units() {

    const [floors, setFloors] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [apartmentPartitions, setApartmentPartitions] = useState({});

    const [expandedFloor, setExpandedFloor] = useState(null);
    const [expandedPartitions, setExpandedPartitions] = useState(null);
    const [expandedApartment, setExpandedApartment] = useState(null);
    const [selectedApartment, setSelectedApartment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [apartmentsLoading, setApartmentsLoading] = useState(false);

    const [selectedFloor, setSelectedFloor] = useState(null);
    const [showAddApartment, setShowAddApartment] = useState(false);
    const [showAddPartition, setShowAddPartition] = useState(false);

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;


    // ------------------------------------------------
    // Get Floors
    // ------------------------------------------------

    const fetchFloors = async () => {

        try {

            const response = await authFetch(
                `${BASE}/api/floors/`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch floors");
            }

            const data = await response.json();

            setFloors(data);

        } catch (error) {

            console.error(
                "Error fetching floors:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    // ------------------------------------------------
    // Get Apartments
    // ------------------------------------------------

    const fetchApartments = async () => {

        try {

            setApartmentsLoading(true);

            const response = await authFetch(
                `${BASE}/api/apartments/`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch apartments"
                );
            }

            const data = await response.json();

            setApartments(data);

        } catch (error) {

            console.error(
                "Error fetching apartments:",
                error
            );

        } finally {

            setApartmentsLoading(false);

        }
    };


    useEffect(() => {

        fetchFloors();
        fetchApartments();

    }, []);


    // ------------------------------------------------
    // Expand / Collapse Floor
    // ------------------------------------------------

    const toggleFloor = (floorId) => {

        setExpandedFloor((prev) =>
            prev === floorId
                ? null
                : floorId
        );

    };


    // ------------------------------------------------
    // Fetch Partitions
    // ------------------------------------------------

    const fetchPartitions = async (apartmentId) => {

        try {

            const response = await authFetch(
                `${BASE}/api/apartments/${apartmentId}/partitions/`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch partitions"
                );
            }

            const data = await response.json();

            setApartmentPartitions((prev) => ({
                ...prev,
                [apartmentId]: data,
            }));

        } catch (error) {

            console.error(
                "Error fetching partitions:",
                error
            );

        }
    };


    // ------------------------------------------------
    // Expand / Collapse Partitions
    // ------------------------------------------------

    const togglePartitions = async (apartmentId) => {

        if (expandedPartitions === apartmentId) {

            setExpandedPartitions(null);

            return;
        }

        setExpandedPartitions(apartmentId);

        // Fetch partitions when opening
        await fetchPartitions(apartmentId);

    };


    // ------------------------------------------------
    // Apartment Expand
    // ------------------------------------------------

    const toggleApartment = async (apartmentId) => {

        if (expandedApartment === apartmentId) {

            setExpandedApartment(null);

            return;
        }

        setExpandedApartment(apartmentId);

        await fetchPartitions(apartmentId);

    };


    // ------------------------------------------------
    // Add New Floor
    // ------------------------------------------------

    const handleAddFloor = async () => {

        const floorName = window.prompt(
            "أدخل اسم الطابق:"
        );

        if (
            !floorName ||
            !floorName.trim()
        ) {
            return;
        }


        try {

            const response = await authFetch(
                `${BASE}/api/floors/add/`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        name: floorName.trim(),
                    }),
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to add floor"
                );

            }


            await fetchFloors();


        } catch (error) {

            console.error(
                "Error adding floor:",
                error
            );

        }

    };


    // ------------------------------------------------
    // Delete Apartment
    // ------------------------------------------------

    const handleDeleteApartment = async (
        apartmentId
    ) => {

        const confirmed = window.confirm(
            "هل أنت متأكد من حذف هذه الشقة؟"
        );

        if (!confirmed) {
            return;
        }


        try {

            const response = await authFetch(
                `${BASE}/api/apartments/${apartmentId}/delete/`,
                {
                    method: "DELETE",
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete apartment"
                );

            }


            // Remove apartment immediately
            setApartments((prev) =>
                prev.filter(
                    (apartment) =>
                        apartment.id !== apartmentId
                )
            );


            // Remove its partitions from state
            setApartmentPartitions((prev) => {

                const updated = {
                    ...prev
                };

                delete updated[apartmentId];

                return updated;

            });


            // Close partition area if necessary
            if (
                expandedPartitions === apartmentId
            ) {

                setExpandedPartitions(null);

            }


        } catch (error) {

            console.error(
                "Error deleting apartment:",
                error
            );

        }
    };


    // ------------------------------------------------
    // Open Add Apartment Modal
    // ------------------------------------------------

    const handleOpenAddApartment = (
        floor
    ) => {

        setSelectedFloor(floor);

        setShowAddApartment(true);

    };


    // ------------------------------------------------
    // Close Add Apartment Modal
    // ------------------------------------------------

    const handleCloseAddApartment = () => {

        setShowAddApartment(false);

        setSelectedFloor(null);

    };


    // ------------------------------------------------
    // Open Add Partition Modal
    // ------------------------------------------------

    const handleOpenAddPartition = (
        apartment
    ) => {

        setSelectedApartment(apartment);

        setShowAddPartition(true);

    };


    // ------------------------------------------------
    // Close Add Partition Modal
    // ------------------------------------------------

    const handleCloseAddPartition = () => {

        setShowAddPartition(false);

        setSelectedApartment(null);

    };


    // ------------------------------------------------
    // Apartment Added
    // ------------------------------------------------

    const handleApartmentAdded = (
        newApartment
    ) => {

        setApartments((prev) => [
            ...prev,
            newApartment
        ]);

    };


    // ------------------------------------------------
    // Get apartments for selected floor
    // ------------------------------------------------

    const getFloorApartments = (
        floorId
    ) => {

        return apartments.filter(
            (apartment) =>
                apartment.floor === floorId
        );

    };


    // ------------------------------------------------
    // Partition Added
    // ------------------------------------------------

    const handlePartitionAdded = async () => {

        if (selectedApartment) {

            await fetchPartitions(
                selectedApartment.id
            );

        }

    };


    return (

        <div
            dir="rtl"
            className="w-full py-1 px-0 sm:p-2 md:p-1"
        >

            {/* -------------------------------- */}
            {/* Page Header */}
            {/* -------------------------------- */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    mb-3
                    sm:mb-3
                "
            >

                <h1
                    className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-gray-800
                        font-extrabold
                    "
                >
                    الوحدات
                </h1>


                {/* <button
                    onClick={handleAddFloor}
                    className="
                        cursor-pointer
                        w-full
                        sm:w-auto
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        text-sm
                        sm:text-base
                        px-3
                        sm:px-4
                        py-2
                        rounded-lg
                        transition
                    "
                >

                    <FaPlus size={13} />

                    إضافة طابق

                </button> */}

            </div>


            {/* -------------------------------- */}
            {/* Floors */}
            {/* -------------------------------- */}

            <div className="w-full space-y-3">

                {loading ? (

                    <div
                        className="
                            text-center
                            text-gray-500
                            py-8
                            text-sm
                            sm:text-base
                        "
                    >
                        جاري تحميل الطوابق...
                    </div>

                ) : floors.length === 0 ? (

                    <div
                        className="
                            text-center
                            text-gray-500
                            py-6
                            sm:py-8
                            px-3
                            bg-white
                            rounded-lg
                            border
                            text-sm
                            sm:text-base
                        "
                    >
                        لا توجد طوابق حالياً
                    </div>

                ) : (

                    floors.map((floor) => {

                        const isExpanded =
                            expandedFloor === floor.id;


                        const floorApartments =
                            getFloorApartments(
                                floor.id
                            );


                        return (

                            <div
                                key={floor.id}
                                className="
                                    w-full
                                    bg-blue-50
                                    rounded-lg
                                    border
                                    border-blue-100
                                    shadow-lg
                                    overflow-hidden
                                "
                            >

                                {/* ------------------------ */}
                                {/* Floor Header */}
                                {/* ------------------------ */}

                                <button
                                    onClick={() =>
                                        toggleFloor(
                                            floor.id
                                        )
                                    }
                                    className="
                                        cursor-pointer
                                        w-full
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        p-3
                                        sm:p-4
                                        hover:bg-blue-50
                                        transition
                                        border-b border-blue-300
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            sm:gap-3
                                            min-w-0
                                            
                                        "
                                    >

                                        {isExpanded ? (

                                            <FaChevronUp
                                                size={18}
                                                className="
                                                    text-blue-600
                                                    flex-shrink-0
                                                    bg-blue-100
                                                "
                                            />

                                        ) : (

                                            <FaChevronDown
                                                size={18}
                                                className="
                                                    text-blue-600
                                                    flex-shrink-0
                                                    bg-blue-100
                                                    
                                                "
                                            />

                                        )}


                                        <span
                                            className="
                                                font-extrabold
                                                text-lg
                                                sm:text-lg
                                                sm:text-base
                                                text-gray-800
                                                truncate
                                            "
                                        >
                                            {floor.name}
                                        </span>

                                    </div>


                                    <span
                                        className="
                                            text-xs
                                            sm:text-sm
                                            text-gray-500
                                            flex-shrink-0
                                            font-extrabold
                                        "
                                    >
                                        طابق
                                    </span>

                                </button>


                                {/* ------------------------ */}
                                {/* Apartments */}
                                {/* ------------------------ */}

                                {isExpanded && (

                                    <div
                                        className="
                                            border-t
                                            border-blue-100
                                            bg-blue-50/40
                                            p-3
                                            sm:p-4
                                            
                                        "
                                    >

                                        {/* Apartment Header */}

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-3
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                                mb-4
                                                
                                            "
                                        >

                                            <h2
                                                className="
                                                    text-sm
                                                    sm:text-base
                                                    font-semibold
                                                    text-gray-700
                                                    
                                                "
                                            >
                                                الشقق
                                            </h2>


                                            <button
                                                onClick={() =>
                                                    handleOpenAddApartment(
                                                        floor
                                                    )
                                                }
                                                className="
                                                    cursor-pointer
                                                    w-full
                                                    sm:w-auto
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    bg-blue-600
                                                    hover:bg-blue-700
                                                    text-white
                                                    text-sm
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    transition
                                                "
                                            >

                                                <FaPlus
                                                    size={12}
                                                />

                                                إضافة شقة

                                            </button>

                                        </div>


                                        {/* Apartment Loading */}

                                        {apartmentsLoading ? (

                                            <div
                                                className="
                                                    text-center
                                                    text-gray-500
                                                    py-5
                                                    text-sm
                                                "
                                            >
                                                جاري تحميل الشقق...
                                            </div>

                                        ) : floorApartments.length === 0 ? (

                                            <div
                                                className="
                                                    text-center
                                                    text-gray-500
                                                    py-5
                                                    text-sm
                                                    bg-white
                                                    rounded-lg
                                                    border
                                                "
                                            >
                                                لا توجد شقق في هذا الطابق
                                            </div>

                                        ) : (

                                            <div
                                                className={`
                                                    grid
                                                    grid-cols-1
                                                    sm:grid-cols-2
                                                    ${
                                                        floorApartments.length >= 3
                                                            ? "lg:grid-cols-3"
                                                            : "lg:grid-cols-2"
                                                    }
                                                    gap-3
                                                `}
                                            >

                                                {floorApartments.map(
                                                    (apartment) => {

                                                        const isPartitionApartment =
                                                            apartment.partitions === true &&
                                                            apartment.complete === false;

                                                        const isPartitionsExpanded =
                                                            expandedPartitions === apartment.id;


                                                        const partitions =
                                                            apartmentPartitions[
                                                                apartment.id
                                                            ] || [];


                                                        return (

                                                            <div
                                                                key={
                                                                    apartment.id
                                                                }
                                                                className="
                                                                    bg-white
                                                                    rounded-lg
                                                                    border
                                                                    border-blue-100
                                                                    p-4
                                                                    shadow-lg
                                                                "
                                                            >

                                                                {/* Apartment Header */}

                                                                <div
                                                                    className="
                                                                        flex
                                                                        items-center
                                                                        justify-between
                                                                        gap-2
                                                                        bg-blue-50
                                                                        shadow-lg
                                                                    "
                                                                >

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                            min-w-0
                                                                            
                                                                        "
                                                                    >

                                                                        {/* Apartment Arrow */}

                                                                        {isPartitionApartment && (

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    togglePartitions(
                                                                                        apartment.id
                                                                                    )
                                                                                }
                                                                                className="
                                                                                    cursor-pointer
                                                                                    flex-shrink-0
                                                                                    p-2
                                                                                    rounded-lg
                                                                                    text-blue-600
                                                                                    hover:bg-blue-100
                                                                                    bg-blue-50
                                                                                "
                                                                            >

                                                                                {isPartitionsExpanded ? (

                                                                                    <FaChevronUp
                                                                                        size={18}
                                                                                        bg-blue-50
                                                                                    />

                                                                                ) : (

                                                                                    <FaChevronDown
                                                                                        size={18}
                                                                                        bg-blue-50
                                                                                    />

                                                                                )}

                                                                            </button>

                                                                        )}


                                                                        <h3
                                                                            className="
                                                                                font-semibold
                                                                                text-gray-800
                                                                                truncate
                                                                                font-extrabold
                                                                            "
                                                                        >
                                                                            {
                                                                                apartment.name
                                                                            }
                                                                        </h3>

                                                                    </div>


                                                                    {/* Delete */}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDeleteApartment(
                                                                                apartment.id
                                                                            )
                                                                        }
                                                                        className="
                                                                            cursor-pointer
                                                                            text-red-500
                                                                            hover:text-red-700
                                                                            text-sm
                                                                            flex-shrink-0
                                                                        "
                                                                    >

                                                                        <FaTrash />

                                                                    </button>

                                                                </div>


                                                                {/* -------------------------------- */}
                                                                {/* PARTITION APARTMENT */}
                                                                {/* -------------------------------- */}

                                                                {isPartitionApartment ? (

                                                                    <div
                                                                        className="
                                                                            mt-3
                                                                        "
                                                                    >

                                                                        {/* Number of partitions */}

                                                                        <p
                                                                            className="
                                                                                text-sm
                                                                                text-gray-500
                                                                                font-extrabold
                                                                            "
                                                                        >

                                                                           عدد البارتيشنس :{" "}

                                                                            <span
                                                                                className="
                                                                                    font-semibold
                                                                                    text-gray-700
                                                                                "
                                                                            >
                                                                                {
                                                                                    apartment.partitions_no
                                                                                }
                                                                            </span>

                                                                        </p>


                                                                        {/* Expanded Partitions */}

                                                                        {isPartitionsExpanded && (

                                                                            <div
                                                                                className="
                                                                                    mt-4
                                                                                    border-t
                                                                                    border-blue-100
                                                                                    pt-4
                                                                                    bg-blue-50/40
                                                                                    rounded-lg
                                                                                    p-4
                                                                                    shadow-xl
                                                                                "
                                                                            >

                                                                                {/* Partition Header */}

                                                                                <div
                                                                                    className="
                                                                                        flex
                                                                                        flex-col
                                                                                        gap-2
                                                                                        sm:flex-row
                                                                                        sm:items-center
                                                                                        sm:justify-between
                                                                                        mb-3
                                                                                    "
                                                                                >

                                                                                    <h4
                                                                                        className="
                                                                                            
                                                                                            text-gray-700
                                                                                            text-sm
                                                                                            font-extrabold
                                                                                        "
                                                                                    >
                                                                                        البارتيشن
                                                                                    </h4>


                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            handleOpenAddPartition(
                                                                                                apartment
                                                                                            )
                                                                                        }
                                                                                        className="
                                                                                            cursor-pointer
                                                                                            inline-flex
                                                                                            items-center
                                                                                            justify-center
                                                                                            gap-2
                                                                                            bg-blue-600
                                                                                            hover:bg-blue-700
                                                                                            text-white
                                                                                            px-3
                                                                                            py-2
                                                                                            rounded-lg
                                                                                            text-sm
                                                                                            transition
                                                                                            
                                                                                        "
                                                                                    >

                                                                                        <FaPlus
                                                                                            size={12}
                                                                                        />

                                                                                        إضافة بارتيشن

                                                                                    </button>

                                                                                </div>


                                                                                {/* Partitions List */}

                                                                                {partitions.length === 0 ? (

                                                                                    <div
                                                                                        className="
                                                                                            text-center
                                                                                            text-gray-500
                                                                                            py-4
                                                                                            text-sm
                                                                                            bg-white
                                                                                            rounded-lg
                                                                                            border
                                                                                        "
                                                                                    >
                                                                                        لاتوجد تقسيمات للعرض حاليا
                                                                                    </div>

                                                                                ) : (

                                                                                    <div
                                                                                        className="
                                                                                            grid
                                                                                            grid-cols-2
                                                                                            sm:grid-cols-3
                                                                                            gap-3
                                                                                        "
                                                                                    >

                                                                                        
{partitions.map((partition) => (
    <div
        key={partition.id}
        className="
            bg-white
            rounded-lg
            border
            border-blue-100
            p-2
            sm:p-3
            shadow-sm
            min-w-0

            lg:flex
            lg:flex-row
            lg:items-stretch
            lg:justify-between
            lg:gap-4
        "
    >

        {/* ================================================= */}
        {/* Partition Information */}
        {/* ================================================= */}

        <div
            className="
                min-w-0
                flex-1
                lg:order-1
            "
        >

            <h5
                className="
                    font-semibold
                    text-gray-700 
                    underline
                    truncate
                    text-lg
                    sm:text-base
                    font-extrabold
                "
            >
                {partition.name}
            </h5>


            <div
                className="
                    mt-2
                    space-y-1
                    text-xs
                    sm:text-sm
                    text-gray-500
                "
            >

                {/* Price */}
                <p
                    className={
                        Number(partition.balance) > 0
                            ? "text-gray-600 font-extrabold"
                            : "text-gray-600 font-extrabold"
                    }
                >
                    السعر:{" "}
                    {partition.price}
                </p>


                {/* Monthly / Daily */}
                <p className = 'text-gray-700 text-xs font-extrabold text-orange-600'>
                    {partition.monthly
                        ? "شهري"
                        : partition.daily
                            ? "يومي"
                            : "غير محدد"}
                </p>


                {/* Balance */}
                <p
                    className={
                        Number(partition.balance) > 0
                            ? "text-red-600 font-extrabold"
                            : "text-green-600 font-extrabold"
                    }
                >
                    الرصيد:{" "}
                    {partition.balance}
                </p>

            </div>

        </div>


        {/* ================================================= */}
        {/* Mobile / Tablet Actions */}
        {/* ================================================= */}
        <div className = "flex-flex-col gap-5 lg:hidden">
             <div
            className="
                mt-3
                mx-auto
                flex
                flex-row
                gap-1.5
                sm:gap-2
                lg:hidden
                
            "
        >

            {/* استحقاق */}
            <button
                type="button"
                onClick={() => {
                    // TODO: Add استحقاق function
                }}
                className="
                shadow-xl
                    cursor-pointer
                    flex-1
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    text-[13px]
                    sm:text-xs
                    font-extrabold
                    px-1
                    sm:px-3
                    py-1.5
                    sm:py-2
                    rounded-sm
                    transition
                    whitespace-nowrap
                "
            >
                تحصيل
            </button>


            {/* متأخرات */}
            <button
                type="button"
                onClick={() => {
                    // TODO: Add متأخرات function
                }}
                className="
                    cursor-pointer
                    flex-1
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    text-[13px]
                    sm:text-xs
                    font-extrabold
                    px-1
                    sm:px-3
                    py-1.5
                    sm:py-2
                    rounded-sm
                    transition
                    whitespace-nowrap
                "
            >
                متأخرات
            </button>


        </div>
        

            {/* كشف حساب */}
            <button
                type="button"
                onClick={() => {
                    // TODO: Add كشف حساب function
                }}
                className="
                    cursor-pointer
                    flex-1
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-[13px]
                    sm:text-xs
                    font-extrabold
                    mx-auto mt-2
                    sm:px-3
                    py-1.5
                    sm:py-2
                    rounded-sm
                    transition
                    whitespace-nowrap
                    w-full
                "
            >
                كشف حساب
            </button>

        </div>


        {/* ================================================= */}
        {/* Desktop Actions - Right Side */}
        {/* ================================================= */}

        <div
            className="
                hidden
                lg:flex
                lg:flex-col
                lg:justify-center
                gap-2
                w-10
                xl:w-16
                flex-shrink-0
                lg:order-2
            "
        >

            {/* استحقاق */}
            <button
                type="button"
                onClick={() => {
                    // TODO: Add استحقاق function
                }}
                className="
                    cursor-pointer
                    w-full
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    text-md
                    px-2
                    py-2
                    rounded-sm
                    transition
                    whitespace-nowrap
                    font-extrabold
                "
            >
                تحصيل
            </button>


            {/* متأخرات */}
            <button
                type="button"
                onClick={() => {
                    // TODO: Add متأخرات function
                }}
                className="
                    cursor-pointer
                    w-full
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    text-md
                    font-extrabold
                    px-2
                    py-2
                    rounded-sm
                    transition
                    whitespace-nowrap
                "
            >
                متأخرات
            </button>


            {/* كشف حساب */}
            <button
                type="button"
                onClick={() => {
                    // TODO: Add كشف حساب function
                }}
                className="
                    cursor-pointer
                    w-full
                    bg-blue-500
                    hover:bg-blue-700
                    text-white
                    text-sm
                    font-extrabold
                    px-1
                    py-2
                    rounded-sm
                    transition
                    whitespace-nowrap
                    shadow-sm
                "
            >
                كشف حساب
            </button>

        </div>

    </div>
))}




                                                                                        

                                                                                    </div>

                                                                                )}

                                                                            </div>

                                                                        )}

                                                                    </div>

                                                                ) : (

                                                                    /* -------------------------------- */
                                                                    /* COMPLETE APARTMENT */
                                                                    /* -------------------------------- */

                                                                    <div
                                                                        className="
                                                                            mt-3
                                                                            space-y-1
                                                                            text-sm
                                                                            text-gray-500
                                                                        "
                                                                    >

                                                                        {/* Status */}

                                                                        <div className="mb-2">

                                                                            <span
                                                                                className={`
                                                                                    text-xs
                                                                                    px-2
                                                                                    py-1
                                                                                    rounded-full
                                                                                    ${
                                                                                        apartment.status === "available"
                                                                                            ? "bg-green-100 text-green-700"
                                                                                            : apartment.status === "occupied"
                                                                                                ? "bg-red-100 text-red-700"
                                                                                                : "bg-yellow-100 text-yellow-700"
                                                                                    }
                                                                                `}
                                                                            >

                                                                                {
                                                                                    apartment.status === "available"
                                                                                        ? "متاحة"
                                                                                        : apartment.status === "occupied"
                                                                                            ? "مشغولة"
                                                                                            : "صيانة"
                                                                                }

                                                                            </span>

                                                                        </div>


                                                                        {/* Price */}

                                                                        <p>
                                                                            السعر:{" "}
                                                                            {
                                                                                apartment.price
                                                                            }
                                                                        </p>


                                                                        {/* Balance */}

                                                                        <p>
                                                                            الرصيد:{" "}
                                                                            {
                                                                                apartment.balance
                                                                            }
                                                                        </p>


                                                                        {/* Monthly / Daily */}

                                                                        <p>
                                                                            {
                                                                                apartment.monthly
                                                                                    ? "شهري"
                                                                                    : apartment.daily
                                                                                        ? "يومي"
                                                                                        : "غير محدد"
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        );

                                                    }
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        );

                    })

                )}

            </div>


            {/* -------------------------------- */}
            {/* Add Apartment Modal */}
            {/* -------------------------------- */}

            {showAddApartment &&
                selectedFloor && (

                    <AddApartment
                        floor={selectedFloor}
                        floorId={selectedFloor.id}
                        floorName={selectedFloor.name}
                        onClose={
                            handleCloseAddApartment
                        }
                        onApartmentAdded={
                            handleApartmentAdded
                        }
                    />

                )}


            {/* -------------------------------- */}
            {/* Add Partition Modal */}
            {/* -------------------------------- */}

            {showAddPartition &&
                selectedApartment && (

                    <AddPartition
                        ApartmentId={
                            selectedApartment.id
                        }
                        ApartmentName={
                            selectedApartment.name
                        }
                        onClose={
                            handleCloseAddPartition
                        }
                        onPartitionAdded={
                            handlePartitionAdded
                        }
                    />

                )}

        </div>

    );
}

export default Units;











// import { useEffect, useState } from "react";
// import { authFetch } from "../../utils/auth";

// import {
//     FaPlus,
//     FaChevronDown,
//     FaChevronUp,
//     FaTrash
// } from "react-icons/fa";

// import AddApartment from "../../components/ar/addUnits/AddApartment";


// function Units() {

//     const [floors, setFloors] = useState([]);
//     const [apartments, setApartments] = useState([]);
//     const [apartmentPartitions, setApartmentPartitions] = useState({});

//     const [expandedFloor, setExpandedFloor] = useState(null);
//     const [expandedPartitions, setExpandedPartitions] = useState(null);
//     const [expandedApartment, setExpandedApartment] = useState(null);
//     const [selectedApartment, setSelectedApartment] = useState(null);

//     const [loading, setLoading] = useState(true);
//     const [apartmentsLoading, setApartmentsLoading] = useState(false);

//     const [selectedFloor, setSelectedFloor] = useState(null);
//     const [showAddApartment, setShowAddApartment] = useState(false);
//     const [showAddPartition, setShowAddPartition] = useState(false);

//     const BASE = import.meta.env.VITE_DJANGO_BASE_URL;


//     // ------------------------------------------------
//     // Get Floors
//     // ------------------------------------------------

//     const fetchFloors = async () => {

//         try {

//             const response = await authFetch(
//                 `${BASE}/api/floors/`
//             );

//             if (!response.ok) {
//                 throw new Error("Failed to fetch floors");
//             }

//             const data = await response.json();

//             setFloors(data);

//         } catch (error) {

//             console.error(
//                 "Error fetching floors:",
//                 error
//             );

//         } finally {

//             setLoading(false);

//         }
//     };


//     // ------------------------------------------------
//     // Get Apartments
//     // ------------------------------------------------

//     const fetchApartments = async () => {

//         try {

//             setApartmentsLoading(true);

//             const response = await authFetch(
//                 `${BASE}/api/apartments/`
//             );

//             if (!response.ok) {
//                 throw new Error(
//                     "Failed to fetch apartments"
//                 );
//             }

//             const data = await response.json();

//             setApartments(data);

//         } catch (error) {

//             console.error(
//                 "Error fetching apartments:",
//                 error
//             );

//         } finally {

//             setApartmentsLoading(false);

//         }
//     };


//     useEffect(() => {

//         fetchFloors();

//         fetchApartments();

//     }, []);


//     // ------------------------------------------------
//     // Expand / Collapse Floor
//     // ------------------------------------------------

//     const toggleFloor = (floorId) => {

//         setExpandedFloor((prev) =>
//             prev === floorId
//                 ? null
//                 : floorId
//         );

//     };

//     const togglePartitions = (apartmentId) => {
//         setExpandedPartitions((prev) =>
//             prev === apartmentId ? null : apartmentId
//         );
//     };

//     const toggleApartment = async (apartmentId) => {

//         if (expandedApartment === apartmentId) {

//             setExpandedApartment(null);

//             return;
//         }

//         setExpandedApartment(apartmentId);

//         await fetchPartitions(apartmentId);
//     };

//     // ------------------------------------------------
//     // Add New Floor
//     // ------------------------------------------------

//     const handleAddFloor = async () => {

//         const floorName = window.prompt(
//             "أدخل اسم الطابق:"
//         );

//         if (
//             !floorName ||
//             !floorName.trim()
//         ) {
//             return;
//         }


//         try {

//             const response = await authFetch(
//                 `${BASE}/api/floors/add/`,
//                 {
//                     method: "POST",

//                     body: JSON.stringify({
//                         name: floorName.trim(),
//                     }),
//                 }
//             );


//             if (!response.ok) {

//                 throw new Error(
//                     "Failed to add floor"
//                 );

//             }


//             // Refresh floors

//             await fetchFloors();


//         } catch (error) {

//             console.error(
//                 "Error adding floor:",
//                 error
//             );

//         }

//     };

//     // -----------------------------------------------
//     // Delete apartment
//     // ------------------------------------------------
//     const handleDeleteApartment = async (apartmentId) => {
//         const confirmed = window.confirm(
//             "هل أنت متأكد من حذف هذه الشقة؟"
//         );

//         if (!confirmed) {
//             return;
//         }

//         try {
//             const response = await authFetch(
//                 `${BASE}/api/apartments/${apartmentId}/delete/`,
//                 {
//                     method: "DELETE",
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error("Failed to delete apartment");
//             }

//             // Refresh apartments/floors
//             await fetchFloors();

//         } catch (error) {
//             console.error("Error deleting apartment:", error);
//         }
//     };


//     // ------------------------------------------------
//     // Open Add Apartment Modal
//     // ------------------------------------------------

//     const handleOpenAddApartment = (floor) => {

//         setSelectedFloor(floor);

//         setShowAddApartment(true);

//     };


//     // ------------------------------------------------
//     // Close Add Apartment Modal
//     // ------------------------------------------------

//     const handleCloseAddApartment = () => {

//         setShowAddApartment(false);

//         setSelectedFloor(null);

//     };


//     // ------------------------------------------------
//     // Open Add Partition Modal
//     // ------------------------------------------------
//     const handleOpenAddPartition = (
//         apartment
//     ) => {

//         setSelectedApartment(apartment);

//         setShowAddPartition(true);
//     };

//     // ------------------------------------------------
//     // Close Add Apartment Modal
//     // ------------------------------------------------
//     const handleCloseAddPartition = () => {

//         setShowAddPartition(false);

//         setSelectedApartment(null);
//     };


    
//     // ------------------------------------------------
//     // Apartment Added
//     // ------------------------------------------------

//     const handleApartmentAdded = (newApartment) => {

//         // Add the new apartment immediately
//         // without needing a full page refresh.

//         setApartments((prev) => [
//             ...prev,
//             newApartment
//         ]);

//     };

    

//     // ------------------------------------------------
//     // Get apartments for selected floor
//     // ------------------------------------------------

//     const getFloorApartments = (floorId) => {

//         return apartments.filter(
//             (apartment) =>
//                 apartment.floor === floorId
//         );

//     };

//     // ------------------------------------------------
//     // Partition Added
//     // ------------------------------------------------
//     const handlePartitionAdded = async () => {

//         if (selectedApartment) {

//             await fetchPartitions(
//                 selectedApartment.id
//             );
//         }
//     };


//     //----------------------------------------------------//
//     //------------------Fetch Partitions------------------//
//     //----------------------------------------------------//
//     const fetchPartitions = async (apartmentId) => {

//         try {

//             const response = await authFetch(
//                 `${BASE}/api/apartments/${apartmentId}/partitions/`
//             );

//             if (!response.ok) {
//                 throw new Error(
//                     "Failed to fetch partitions"
//                 );
//             }

//             const data = await response.json();

//             setApartmentPartitions((prev) => ({
//                 ...prev,
//                 [apartmentId]: data,
//             }));

//         } catch (error) {

//             console.error(
//                 "Error fetching partitions:",
//                 error
//             );

//         }
//     };



//     return (

//         <div
//             dir="rtl"
//             className="w-full p-3 sm:p-4 md:p-6"
//         >

//             {/* -------------------------------- */}
//             {/* Page Header */}
//             {/* -------------------------------- */}

//             <div
//                 className="
//                     flex
//                     flex-col
//                     gap-3
//                     sm:flex-row
//                     sm:items-center
//                     sm:justify-between
//                     mb-5
//                     sm:mb-6
//                 "
//             >

//                 <h1
//                     className="
//                         text-xl
//                         sm:text-2xl
//                         font-bold
//                         text-gray-800
//                     "
//                 >
//                     الوحدات
//                 </h1>


//                 <button
//                     onClick={handleAddFloor}
//                     className="
//                         cursor-pointer
//                         w-full
//                         sm:w-auto
//                         flex
//                         items-center
//                         justify-center
//                         gap-2
//                         bg-blue-600
//                         hover:bg-blue-700
//                         text-white
//                         text-sm
//                         sm:text-base
//                         px-3
//                         sm:px-4
//                         py-2
//                         rounded-lg
//                         transition
//                     "
//                 >

//                     <FaPlus size={13} />

//                     إضافة طابق

//                 </button>

//             </div>


//             {/* -------------------------------- */}
//             {/* Floors */}
//             {/* -------------------------------- */}

//             <div className="w-full space-y-3 ">

//                 {loading ? (

//                     <div
//                         className="
//                             text-center
//                             text-gray-500
//                             py-8
//                             text-sm
//                             sm:text-base
                            
//                         "
//                     >
//                         جاري تحميل الطوابق...
//                     </div>

//                 ) : floors.length === 0 ? (

//                     <div
//                         className="
//                             text-center
//                             text-gray-500
//                             py-6
//                             sm:py-8
//                             px-3
//                             bg-white
//                             rounded-lg
//                             border
//                             text-sm
//                             sm:text-base
                            
//                         "
//                     >
//                         لا توجد طوابق حالياً
//                     </div>

//                 ) : (

//                     floors.map((floor) => {

//                         const isExpanded =
//                             expandedFloor === floor.id;


//                         const floorApartments =
//                             getFloorApartments(
//                                 floor.id
//                             );


//                         return (

//                             <div
//                                 key={floor.id}
//                                 className="
//                                     w-full
//                                     bg-blue-50
//                                     rounded-lg
//                                     border
//                                     border-blue-100
//                                     shadow-lg
//                                     overflow-hidden
//                                 "
//                             >

//                                 {/* ------------------------ */}
//                                 {/* Floor Header */}
//                                 {/* ------------------------ */}

//                                 <button
//                                     onClick={() =>
//                                         toggleFloor(
//                                             floor.id
//                                         )
//                                     }
//                                     className="
//                                         cursor-pointer
//                                         w-full
//                                         flex
//                                         items-center
//                                         justify-between
//                                         gap-3
//                                         p-3
//                                         sm:p-4
//                                         hover:bg-blue-50
//                                         transition
//                                     "
//                                 >

//                                     <div
//                                         className="
//                                             flex
//                                             items-center
//                                             gap-2
//                                             sm:gap-3
//                                             min-w-0
//                                         "
//                                     >

//                                         {isExpanded ? (

//                                             <FaChevronUp
//                                                 size={13}
//                                                 className="
//                                                     text-blue-600
//                                                     flex-shrink-0
//                                                 "
//                                             />

//                                         ) : (

//                                             <FaChevronDown
//                                                 size={13}
//                                                 className="
//                                                     text-blue-600
//                                                     flex-shrink-0
//                                                 "
//                                             />

//                                         )}


//                                         <span
//                                             className="
//                                                 font-semibold
//                                                 text-sm
//                                                 sm:text-base
//                                                 text-gray-800
//                                                 truncate
//                                             "
//                                         >
//                                             {floor.name}
//                                         </span>

//                                     </div>


//                                     <span
//                                         className="
//                                             text-xs
//                                             sm:text-sm
//                                             text-gray-500
//                                             flex-shrink-0
//                                         "
//                                     >
//                                         طابق
//                                     </span>

//                                 </button>


//                                 {/* ------------------------ */}
//                                 {/* Apartments */}
//                                 {/* ------------------------ */}

//                                 {isExpanded && (

//                                     <div
//                                         className="
//                                             border-t
//                                             border-blue-100
//                                             bg-blue-50/40
//                                             p-3
//                                             sm:p-4
//                                         "
//                                     >

//                                         {/* Apartment Header */}

//                                         <div
//                                             className="
//                                                 flex
//                                                 flex-col
//                                                 gap-3
//                                                 sm:flex-row
//                                                 sm:items-center
//                                                 sm:justify-between
//                                                 mb-4
//                                             "
//                                         >

//                                             <h2
//                                                 className="
//                                                     text-sm
//                                                     sm:text-base
//                                                     font-semibold
//                                                     text-gray-700
//                                                 "
//                                             >
//                                                 الشقق
//                                             </h2>


//                                             <button
//                                                 onClick={() =>
//                                                     handleOpenAddApartment(
//                                                         floor
//                                                     )
//                                                 }
//                                                 className="
//                                                     cursor-pointer
//                                                     w-full
//                                                     sm:w-auto
//                                                     flex
//                                                     items-center
//                                                     justify-center
//                                                     gap-2
//                                                     bg-blue-600
//                                                     hover:bg-blue-700
//                                                     text-white
//                                                     text-sm
//                                                     px-3
//                                                     py-2
//                                                     rounded-lg
//                                                     transition
//                                                 "
//                                             >

//                                                 <FaPlus
//                                                     size={12}
//                                                 />

//                                                 إضافة شقة

//                                             </button>

//                                         </div>


//                                         {/* Apartment Loading */}

//                                         {apartmentsLoading ? (

//                                             <div
//                                                 className="
//                                                     text-center
//                                                     text-gray-500
//                                                     py-5
//                                                     text-sm
//                                                 "
//                                             >
//                                                 جاري تحميل الشقق...
//                                             </div>

//                                         ) : floorApartments.length === 0 ? (

//                                             <div
//                                                 className="
//                                                     text-center
//                                                     text-gray-500
//                                                     py-5
//                                                     text-sm
//                                                     bg-white
//                                                     rounded-lg
//                                                     border
//                                                 "
//                                             >
//                                                 لا توجد شقق في هذا الطابق
//                                             </div>

//                                         ) : (

//                                                     <div
//                                                         className={`
//                                                             grid
//                                                             grid-cols-1
//                                                             sm:grid-cols-2
//                                                             ${floorApartments.length >= 3
//                                                             ? "lg:grid-cols-3"
//                                                             : "lg:grid-cols-2"
//                                                         }
//                                                                gap-3
//                                                        `}
//                                                     >

                                                
//                                                         {floorApartments.map((apartment) => {

//                                                             const isPartitionApartment =
//                                                                 apartment.partitions === true &&
//                                                                 apartment.complete === false;

//                                                             const isPartitionsExpanded =
//                                                                 expandedPartitions === apartment.id;

//                                                             return (
//                                                                 <div
//                                                                     key={apartment.id}
//                                                                     className="
//                 bg-white
//                 rounded-lg
//                 border
//                 border-blue-100
//                 p-4
//                 shadow-lg
//             "
//                                                                 >

//                                                                     {/* Apartment Header */}
//                                                                     <div
//                                                                         className="
//                     flex
//                     items-center
//                     justify-between
//                     gap-2
//                 "
//                                                                     >

//                                                                         <h3
//                                                                             className="
//                         font-semibold
//                         text-gray-800
//                         truncate
//                     "
//                                                                         >
//                                                                             {apartment.name}
//                                                                         </h3>


//                                                                         {/* Delete + Partition Arrow */}
//                                                                         <div className="flex items-center gap-2">

//                                                                             {isPartitionApartment && (
//                                                                                 <button
//                                                                                     type="button"
//                                                                                     onClick={() =>
//                                                                                         togglePartitions(apartment.id)
//                                                                                     }
//                                                                                     className="
//                                 cursor-pointer
//                                 p-2
//                                 rounded-lg
//                                 text-blue-600
//                                 hover:bg-blue-50
//                                 bg-blue-100
//                             "
//                                                                                 >
//                                                                                     {isPartitionsExpanded ? (
//                                                                                         <FaChevronUp size={14} />
//                                                                                     ) : (
//                                                                                         <FaChevronDown size={14} />
//                                                                                     )}
//                                                                                 </button>
//                                                                             )}

//                                                                             <button
//                                                                                 type="button"
//                                                                                 onClick={() =>
//                                                                                     handleDeleteApartment(apartment.id)
//                                                                                 }
//                                                                                 className="
//                                                                                     cursor-pointer
//                                                                                     text-red-500
//                                                                                     hover:text-red-700
//                                                                                     text-sm
//                                                                                 "
//                                                                             >
//                                                                                 <FaTrash/>
                                                                                
//                                                                             </button>

//                                                                         </div>

//                                                                     </div>


//                                                                     {/* PARTITION APARTMENT */}
//                                                                     {isPartitionApartment ? (

//                                                                         <div className="mt-3">

//                                                                             {/* Number of partitions */}
//                                                                             <p className="text-sm text-gray-500">
//                                                                                 عدد التقسيمات:{" "}
//                                                                                 <span className="font-semibold text-gray-700">
//                                                                                     {apartment.partitions_no}
//                                                                                 </span>
//                                                                             </p>


//                                                                             {/* Expanded Partitions */}
//                                                                             {isPartitionsExpanded && (
//                                                                                 <div
//                                                                                     className="
//                                 mt-4
//                                 border-t
//                                 border-blue-100
//                                 pt-4
//                                 bg-blue-50/40
//                                 rounded-lg
//                                 p-4
//                             "
//                                                                                 >

//                                                                                     <div className="text-center">

//                                                                                         <p className="text-sm text-gray-500 mb-3">
//                                                                                             لاتوجد تقسيمات للعرض حاليا
//                                                                                         </p>

//                                                                                         <button
//                                                                                             type="button"
//                                                                                             className="
//                                         inline-flex
//                                         items-center
//                                         gap-2
//                                         bg-blue-600
//                                         hover:bg-blue-700
//                                         text-white
//                                         px-3
//                                         py-2
//                                         rounded-lg
//                                         text-sm
//                                         transition
//                                     "
//                                                                                         >
//                                                                                             <FaPlus size={12} />
//                                                                                             إضافة تقسيم
//                                                                                         </button>

//                                                                                     </div>

//                                                                                 </div>
//                                                                             )}

//                                                                         </div>

//                                                                     ) : (

//                                                                         /* COMPLETE APARTMENT */
//                                                                         <div className="mt-3 space-y-1 text-sm text-gray-500">

//                                                                             {/* Status */}
//                                                                             <div className="mb-2">

//                                                                                 <span
//                                                                                     className={`
//                                 text-xs
//                                 px-2
//                                 py-1
//                                 rounded-full
//                                 ${apartment.status === "available"
//                                                                                             ? "bg-green-100 text-green-700"
//                                                                                             : apartment.status === "occupied"
//                                                                                                 ? "bg-red-100 text-red-700"
//                                                                                                 : "bg-yellow-100 text-yellow-700"
//                                                                                         }
//                             `}
//                                                                                 >
//                                                                                     {
//                                                                                         apartment.status === "available"
//                                                                                             ? "متاحة"
//                                                                                             : apartment.status === "occupied"
//                                                                                                 ? "مشغولة"
//                                                                                                 : "صيانة"
//                                                                                     }
//                                                                                 </span>

//                                                                             </div>


//                                                                             {/* Price */}
//                                                                             <p>
//                                                                                 السعر:{" "}
//                                                                                 {apartment.price}
//                                                                             </p>


//                                                                             {/* Balance */}
//                                                                             <p>
//                                                                                 الرصيد:{" "}
//                                                                                 {apartment.balance}
//                                                                             </p>


//                                                                             {/* Monthly / Daily */}
//                                                                             <p>
//                                                                                 {apartment.monthly
//                                                                                     ? "شهري"
//                                                                                     : apartment.daily
//                                                                                         ? "يومي"
//                                                                                         : "غير محدد"}
//                                                                             </p>

//                                                                         </div>

//                                                                     )}

//                                                                 </div>
//                                                             );
//                                                         })}



//                                             </div>

//                                         )}

//                                     </div>

//                                 )}

//                             </div>

//                         );

//                     })

//                 )}

//             </div>


//             {/* -------------------------------- */}
//             {/* Add Apartment Modal */}
//             {/* -------------------------------- */}

//             {showAddApartment &&
//                 selectedFloor && (

//                     <AddApartment
//                         floor={selectedFloor}
//                         floorId={selectedFloor.id}
//                         floorName={selectedFloor.name}
//                         onClose={
//                             handleCloseAddApartment
//                         }
//                         onApartmentAdded={
//                             handleApartmentAdded
//                         }
//                     />

//                 )}

//         </div>

//     );

// }

// export default Units;





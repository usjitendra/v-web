import React from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductInsights = ({
  bestSellingProducts,
  topCategory,
  mostWishlistedProducts,
  loading,
}) => {
  const renderLoadingItems = (count) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="flex items-center justify-between mb-4 p-2">
          <div className="flex items-center gap-4 w-full">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-3 w-[60%]" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ));
  };

  return (
    <div className="mt-8 flex flex-col xl:flex-row gap-5 md:gap-6 lg:gap-8 justify-center items-start">
      {/* Best Selling Products */}
      <div className="bg-white xl:h-[420px] px-2 sm:px-4 py-2 sm:py-4 rounded-xl w-full  xl:w-1/3 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-center">
          Best Selling Products
        </h2>
        {loading ? (
          renderLoadingItems(4)
        ) : bestSellingProducts?.length > 0 ? (
          bestSellingProducts?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-2 gap-2 hover:bg-gray-40 p-2 rounded transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                {item.image ? (
                  item.image.endsWith(".mp4") ? (
                    <video
                      className="w-12 h-12  rounded-md object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={item.image} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={item.image}
                      loading="lazy"
                      alt={item.title}
                      className="w-12 h-12  rounded-md object-cover"
                    />
                  )
                ) : (
                  <div className="w-12 h-12  rounded-md bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.486-4.486a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <Link
                  to={`/admin/product/product-details/${item?.id}`}
                  className="text-xs md:text-sm  font-semibold text-gray-800 line-clamp-2"
                >
                  {item?.title}
                </Link>
              </div>
              <span className="bg-blue-50 text-nowrap text-xs  font-medium px-3 py-1 rounded-full text-blue-700">
                Rank: #{index + 1}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No best selling product data available !!
          </div>
        )}
      </div>

      {/* Most Liked Type Product */}
      <div className="bg-white xl:h-[420px] px-2 sm:px-4 py-2 sm:py-4 rounded-xl w-full  xl:w-1/3 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-center">
          Most Liked Products
        </h2>
        {loading ? (
          renderLoadingItems(4)
        ) : mostWishlistedProducts?.length > 0 ? (
          mostWishlistedProducts.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-2 gap-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                {item.image ? (
                  item.image.endsWith(".mp4") ? (
                    <video
                      className="w-12 h-12  rounded-md object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={item.image} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={item.image}
                      loading="lazy"
                      alt={item.title}
                      className="w-12 h-12  rounded-md object-cover"
                    />
                  )
                ) : (
                  <div className="w-12 h-12  rounded-md bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <Link
                  to={`/admin/product/product-details/${item?.id}`}
                  className="text-xs md:text-sm  font-semibold text-gray-800 line-clamp-2"
                >
                  {item.title}
                </Link>
              </div>
              <span className="bg-pink-100 flex flex-row items-center gap-1 text-nowrap text-xs md:text-sm font-medium px-3 py-1 rounded-full text-pink-700">
                <FaHeart /> {item.wishlistCount}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No wishlisted products available !!
          </div>
        )}
      </div>

      {/* Top Categories */}
      <div className="bg-white xl:h-[420px] px-2 sm:px-4 py-2 sm:py-4 rounded-xl w-full  xl:w-1/3 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-center">
          Top Categories
        </h2>
        {loading ? (
          renderLoadingItems(4)
        ) : topCategory?.length > 0 ? (
          topCategory.map((cat, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-2 gap-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                {cat.imageUrl === null ? (
                  <div className="w-12 h-12  rounded-md bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                ) : (
                <img
                  src={cat.imageUrl}
                  loading="lazy"
                  alt={cat.name}
                  className="w-12 h-12  rounded-md object-cover"
                />
                )}
                <p className="text-xs md:text-sm  font-semibold text-gray-800 line-clamp-2">
                  {cat.name}
                </p>
              </div>
              <span className="bg-green-50 text-nowrap text-xs  font-medium px-3 py-1 rounded-full text-green-700">
                {cat.count} Purchased
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No category data available !!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInsights;

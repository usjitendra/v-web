import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const LowStockProduct = ({ stock }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  const renderProductImages = (productVariant) => (
    <div
      className={`relative w-14 h-14 sm:w-20 sm:h-20 md:w-14 md:h-14
      }`}
    >
      <Swiper
        loop={true}
        pagination={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className={`w-full aspect-square`}
      >
        {productVariant.productVariantImage.length === 0 ? (
          <SwiperSlide>
            <div className="w-full h-full  rounded-md bg-gray-100 flex items-center justify-center">
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
          </SwiperSlide>
        ) : (
          productVariant.productVariantImage.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}-${index}`}>
              {image.imageUrl.endsWith(".mp4") ? (
                <video
                  src={image.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label={`${productVariant.productVariantTitle} video ${
                    index + 1
                  }`}
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={`${productVariant.productVariantTitle} - ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );

  return (
    <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-md">
      <h2 className="text-lg md:text-md xl:text-lg font-semibold mb-4">
        Low Stock Product
      </h2>
      <ul className="space-y-4">
        {stock?.length > 0 ? (
          stock?.map((product, idx) => (
            <li key={idx} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2 sm:gap-4">
                {renderProductImages(product || "")}
                <Link to={`/admin/product/product-details/${product?.id}`}>
                  <p className="font-semibold text-xs lg:text-xs xl:text-sm text-[#242424] w-[180px] lg:w-[180px] xl:w-[300px]">
                    {product?.productVariantTitle}
                  </p>

                  <p className="text-xs lg:text-xs xl:text-xs text-[#242424]">
                    ₹{formatPrice(product?.finalPrice)}
                  </p>
                </Link>
              </div>
              <div className="flex items-center gap-2 w-auto text-end  pr-2  text-xs lg:text-xs xl:text-xs">
                {product.stock > 0 ? (
                  <span className="sm:bg-[#fddfdc] lg:bg-white xl:sm:bg-[#fddfdc] text-black flex items-center gap-1  font-medium sm:px-3 py-1 sm:rounded-full">
                    {product?.stock} left{" "}
                    <span className="hidden sm:block lg:hidden xl:block">
                      {" "}
                      in stock
                    </span>
                  </span>
                ) : (
                  <span className="sm:bg-[#f06c6c] lg:bg-white xl:sm:bg-[#f06c6c] text-black sm:text-white lg:text-black xl:text-white  font-medium sm:px-3 py-1 sm:rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </li>
          ))
        ) : (
        <div className="text-center py-4 text-gray-500">
            Low stock currently not available !!
          </div>
        )}
      </ul>
    </div>
  );
};

export default LowStockProduct;

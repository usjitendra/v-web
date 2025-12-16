              <Route element={<AdminRequireAuth />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<MainContent />} />{" "}
                  <Route path="dashboard" element={<MainContent />} />{" "}
                  <Route
                    path="master-panel/metal-master"
                    element={<MetalMaster />}
                  />
                  <Route
                    path="master-panel/metal-variant-history/:id"
                    element={<MetalVariantHistory />}
                  />
                  <Route
                    path="master-panel/material-color"
                    element={<MaterialColor />}
                  />
                  <Route
                    path="master-panel/gemstone-master"
                    element={<GemstoneMaster />}
                  />
                  <Route
                    path="master-panel/gemstone-master-history/:id"
                    element={<GemstoneMasterHistory />}
                  />
                  <Route
                    path="master-panel/making-charge-master"
                    element={<MakingCharge />}
                  />
                  <Route
                    path="master-panel/material-type"
                    element={<Categories />}
                  />
                  <Route
                    path="master-panel/collections"
                    element={<Collection />}
                  />
                  <Route
                    path="master-panel/jewellery-type"
                    element={<JewelleryType />}
                  />
                  <Route
                    path="master-panel/product-style"
                    element={<ProductStyle />}
                  />
                  <Route
                    path="master-panel/global-discount"
                    element={<GlobalDiscount />}
                  />
                  <Route
                    path="master-panel/size-management"
                    element={<ProductVariantSize />}
                  />
                  <Route path="master-panel/occasion" element={<Occasion />} />
                  <Route path="cms/banners" element={<Banners />} />
                  <Route path="cms/important-links" element={<LegalDocs />} />
                  <Route path="cms/currency" element={<Currency />} />
                  <Route path="cms/promotional-script" element={<Shipping />} />
                  <Route path="cms/blog-page" element={<BlogPage />} />
                  <Route path="cms/blog-category" element={<BlogCategory />} />
                  <Route
                    path="product/all-products"
                    element={<AllProducts />}
                  />
                  <Route path="product/add-product" element={<AddProduct />} />
                  <Route
                    path="product/edit-product/:id"
                    element={<EditProduct />}
                  />
                  <Route
                    path="product/product-details/:id"
                    element={<ProductDetailsPage />}
                  />
                  <Route
                    path="product/draft-products"
                    element={<DraftProducts />}
                  />
                  <Route
                    path="product/low-and-out-of-stock-products"
                    element={<OutOfStock />}
                  />
                  <Route path="rbac/roles" element={<Role />} />
                  <Route path="rbac/staff" element={<Staff />} />
                  <Route path="rbac/permissions" element={<Permission />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="gifts" element={<Gifts />} />
                  <Route
                    path="orders/order-details/:id"
                    element={<OrderDetail />}
                  />
                  <Route path="my-profile" element={<AdminProfile />} />
                  <Route path="support" element={<Support />} />
                  {/* <Route path="custom-orders" element={<CustomOrder />} /> */}
                  <Route path="manage-customer" element={<UserManagement />} />
                  <Route path="coupon" element={<Coupon />} />
                  {/* <Route path="promotions" element={<Promotion />} /> */}
                  <Route path="analytics/sales-reports" element={<SalesReport />} />
                  <Route path="analytics/order-reports" element={<OrderReport />} />
                  <Route path="reviews-and-ratings" element={<Reviews />} />

                </Route>
              </Route>
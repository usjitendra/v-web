import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Steps,
  Switch,
  Row,
  Col,
  Divider,
  Upload,
  message,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetDropDownQuery,
  useGetConteryDropDownQuery
} from "../../rtk/slices/subcategoryApi";
import { CountryFlag } from "../../helper/countryFlags";

const { Step } = Steps;
const { TextArea } = Input;

const DoctorForm = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: categoryRes, isLoading } = useGetDropDownQuery();
  const categories = categoryRes?.data || [];
  const { data: counteryData, isLoading: isCountery } = useGetConteryDropDownQuery();
  const countery = counteryData?.data || [];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [galleryFileList, setGalleryFileList] = useState([]);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        if (initialValues.categoryId) {
          handleCategoryChange(initialValues.categoryId);
        }
      } else {
        form.resetFields();
      }
      setStep(0);
      setImageFileList([]);
      setGalleryFileList([]);
    }
  }, [open, initialValues, form]);

  const handleCategoryChange = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    setSelectedCategory(categoryId);
    setSubcategories(category?.subcategories || []);
    form.setFieldsValue({ subCategoryId: [] });
  };

  const next = async () => {
    try {
      const fieldsToValidate = step === 0
        ? ['name', 'email', 'phone', 'categoryId', 'conteryId']
        : [];

      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
      }
      setStep(step + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => setStep(step - 1);

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      console.log("values", values);

      // Basic required fields
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('categoryId', values.categoryId);
      formData.append('conteryId', values.conteryId);

      // Optional fields
      if (values.subCategoryId?.length) {
        formData.append('subCategoryId', JSON.stringify(values.subCategoryId));
      }
      if (values.experience) formData.append('experience', values.experience);
      if (values.workAt) formData.append('workAt', values.workAt);
      if (values.about) formData.append('about', values.about);
      if (values.workExperience) formData.append('workExperience', values.workExperience);

      // Location object
      if (values.location) {
        formData.append('location', JSON.stringify(values.location));
      }

      // Arrays
      if (values.medicalProblems?.length) {
        formData.append('medicalProblems', JSON.stringify(values.medicalProblems));
      }
      if (values.medicalProcedures?.length) {
        formData.append('medicalProcedures', JSON.stringify(values.medicalProcedures));
      }
      if (values.honoursAndAwards?.length) {
        formData.append('honoursAndAwards', JSON.stringify(values.honoursAndAwards));
      }
      if (values.educationAndTraining?.length) {
        formData.append('educationAndTraining', JSON.stringify(values.educationAndTraining));
      }

      // YouTube video object
      if (values.youtubeVideo) {
        formData.append('youtubeVideo', JSON.stringify(values.youtubeVideo));
      }

      // Status
      formData.append('is_active', values.is_active ?? true);

      // Image upload
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append('image', imageFileList[0].originFileObj);
      }

      // Gallery upload (max 10 images)
      if (galleryFileList.length > 0) {
        galleryFileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append('gallery', file.originFileObj);
          }
        });
      }

      await onSubmit(formData);
      form.resetFields();
      setStep(0);
      setImageFileList([]);
      setGalleryFileList([]);
      message.success('Doctor saved successfully!');
    } catch (error) {
      message.error('Failed to save doctor');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };




  const imageUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    fileList: imageFileList,
    onChange: ({ fileList }) => setImageFileList(fileList.slice(-1)),
    maxCount: 1,
  };

  const galleryUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      if (galleryFileList.length >= 10) {
        message.error('Maximum 10 images allowed in gallery!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    fileList: galleryFileList,
    onChange: ({ fileList }) => setGalleryFileList(fileList.slice(0, 10)),
    multiple: true,
    maxCount: 10,
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      title={initialValues ? "Edit Doctor" : "Add Doctor"}
    >
      <Steps current={step} className="mb-6">
        <Step title="Basic Info" />
        <Step title="Professional" />
        <Step title="Medical & Education" />
      </Steps>

      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* ================================================= */}
        {/* STEP 1: BASIC INFO */}
        {/* ================================================= */}
        <Form.Item shouldUpdate noStyle>
          <div style={{ display: step === 0 ? "block" : "none" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Doctor Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter doctor name' }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="doctor@example.com" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                    { pattern: /^[6-9]\d{9}$/, message: 'Invalid mobile number (10 digits, starting with 6-9)' }
                  ]}
                >
                  <Input placeholder="9876543210" maxLength={10} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Experience (Years)" name="experience">
                  <Input type="number" min={0} placeholder="0" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select
                    loading={isLoading}
                    placeholder="Select category"
                    onChange={handleCategoryChange}
                  >
                    {categories.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.category_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Country"
                  name="conteryId"
                  rules={[{ required: true, message: 'Please select country' }]}
                >
                  <Select loading={isCountery} placeholder="Select country">
                    {countery.map((country) => (
                      <Select.Option key={country._id} value={country._id}>
                        <span className="flex items-center gap-2">
                          <CountryFlag name={country.country_name} width={20} />
                          {country.country_name}
                        </span>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Sub Categories" name="subCategoryId">
              <Select
                mode="multiple"
                disabled={!selectedCategory}
                placeholder="Select subcategories (multiple allowed)"
              >
                {subcategories.map((sub) => (
                  <Select.Option key={sub._id} value={sub._id}>
                    {sub.subcategory_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Divider orientation="left">Location Details</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Country" name={["location", "country"]}>
                  <Input placeholder="Country" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="State" name={["location", "state"]}>
                  <Input placeholder="State" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="City" name={["location", "city"]}>
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={16}>
                <Form.Item label="Address" name={["location", "address"]}>
                  <TextArea rows={2} placeholder="Full address" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Zip Code" name={["location", "zipCode"]}>
                  <Input placeholder="400001" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Currently Working At" name="workAt">
              <Input placeholder="Hospital/Clinic name" />
            </Form.Item>

            <Form.Item
              label="Active Status"
              name="is_active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Divider orientation="left">Images</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Profile Image" help="Upload doctor's profile image">
                  <Upload {...imageUploadProps} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Gallery Images" help="Upload up to 10 images">
                  <Upload {...galleryUploadProps} listType="picture">
                    <Button icon={<PlusOutlined />}>Upload Gallery</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

          </div>
        </Form.Item>
        {/* ================================================= */}
        {/* STEP 2: PROFESSIONAL */}
        {/* ================================================= */}
        <Form.Item shouldUpdate noStyle>
          <div style={{ display: step === 1 ? "block" : "none" }}>
            <Form.Item label="About Doctor" name="about">
              <TextArea rows={4} placeholder="Brief description about the doctor's background and expertise" />
            </Form.Item>

            <Form.Item label="Work Experience" name="workExperience">
              <TextArea rows={4} placeholder="Detailed work experience and career history" />
            </Form.Item>

            <Divider orientation="left">Medical Problems Treated</Divider>

            <Form.List name="medicalProblems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-2">
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[{ required: true, message: 'Please enter medical problem' }]}
                        >
                          <Input placeholder="e.g., Heart Disease, Hypertension" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger onClick={() => remove(name)} size="small">
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2">
                    Add Medical Problem
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">Medical Procedures Performed</Divider>

            <Form.List name="medicalProcedures">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-2">
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[{ required: true, message: 'Please enter medical procedure' }]}
                        >
                          <Input placeholder="e.g., Bypass Surgery, Angioplasty" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger onClick={() => remove(name)} size="small">
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2">
                    Add Medical Procedure
                  </Button>
                </>
              )}
            </Form.List>
          </div>

        </Form.Item>
        {/* ================================================= */}
        {/* STEP 3: MEDICAL & EDUCATION */}
        {/* ================================================= */}
        <Form.Item shouldUpdate noStyle>
          <div style={{ display: step === 2 ? "block" : "none" }}>
            <Divider orientation="left">Education & Training</Divider>

            <Form.List name="educationAndTraining">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-3">
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "degree"]}
                          label="Degree"
                        >
                          <Input placeholder="MBBS, MD, etc." />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "institute"]}
                          label="Institute"
                        >
                          <Input placeholder="University/Institute name" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "year"]}
                          label="Year"
                        >
                          <Input placeholder="2020" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item label=" ">
                          <Button danger onClick={() => remove(name)} size="small">
                            X
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Education
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">Honours & Awards</Divider>

            <Form.List name="honoursAndAwards">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-3">
                      <Col span={14}>
                        <Form.Item
                          {...restField}
                          name={[name, "title"]}
                          label="Award Title"
                        >
                          <Input placeholder="Award/Recognition name" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "year"]}
                          label="Year"
                        >
                          <Input placeholder="2023" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item label=" ">
                          <Button danger onClick={() => remove(name)} size="small">
                            X
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Award
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">YouTube Video (Optional)</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Video Title" name={["youtubeVideo", "title"]}>
                  <Input placeholder="Video title" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Video URL" name={["youtubeVideo", "url"]}>
                  <Input placeholder="https://youtube.com/watch?v=..." />
                </Form.Item>
              </Col>
            </Row>

          </div>
        </Form.Item>
        {/* ================================================= */}
        {/* FOOTER NAVIGATION */}
        {/* ================================================= */}
        <div className="flex justify-end gap-2 mt-6">
          {step > 0 && (
            <Button onClick={prev} disabled={loading}>
              Back
            </Button>
          )}
          {step < 2 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialValues ? 'Update Doctor' : 'Save Doctor'}
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default DoctorForm;
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
} from "antd";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import {
  useGetDropDownQuery,
} from "../../rtk/slices/subcategoryApi";

const { Step } = Steps;

const DoctorForm = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);

  const { data: categoryRes, isLoading } = useGetDropDownQuery();
  const categories = categoryRes?.data || [];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (open) {
      initialValues ? form.setFieldsValue(initialValues) : form.resetFields();
      setStep(0);
      setSelectedCategory(null);
      setSubcategories([]);
    }
  }, [open, initialValues, form]);

  // ---------- CATEGORY CHANGE ----------
  const handleCategoryChange = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    setSelectedCategory(categoryId);
    setSubcategories(category?.subcategories || []);
    form.setFieldsValue({ subCategoryId: null });
  };

  // ---------- STEPS ----------
  const next = async () => {
    try {
      await form.validateFields();
      setStep(step + 1);
    } catch {}
  };

  const prev = () => setStep(step - 1);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
    setStep(0);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      destroyOnClose
      width={1000}
      footer={null}
      title={initialValues ? "Edit Doctor" : "Add Doctor"}
    >
      {/* ---------- STEPS ---------- */}
      <Steps current={step} className="mb-6">
        <Step title="Basic Info" />
        <Step title="Professional" />
        <Step title="Medical & Education" />
      </Steps>

      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* ================================================= */}
        {/* STEP 1 : BASIC INFO */}
        {/* ================================================= */}
        {step === 0 && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Doctor Name"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Experience (Years)" name="experience">
                  <Input type="number" min={0} />
                </Form.Item>
              </Col>
            </Row>

            {/* ---------- CATEGORY & SUBCATEGORY ---------- */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[{ required: true }]}
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
                  label="Sub Category"
                  name="subCategoryId"
                  rules={[{ required: true }]}
                >
                  <Select
                    disabled={!selectedCategory}
                    placeholder="Select subcategory"
                  >
                    {subcategories.map((sub) => (
                      <Select.Option key={sub._id} value={sub._id}>
                        {sub.subcategory_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Location</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Country" name={["location", "country"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="State" name={["location", "state"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="City" name={["location", "city"]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Address" name={["location", "address"]}>
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Currently Working At" name="workAt">
              <Input />
            </Form.Item>

            <Form.Item
              label="Active Status"
              name="is_active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </>
        )}

        {/* ================================================= */}
        {/* STEP 2 : PROFESSIONAL */}
        {/* ================================================= */}
        {step === 1 && (
          <>
            <Form.Item label="About Doctor" name="about">
              <SunEditor height="180px" />
            </Form.Item>

            <Form.Item label="Work Experience" name="workExperience">
              <SunEditor height="180px" />
            </Form.Item>
          </>
        )}

        {/* ================================================= */}
        {/* STEP 3 : MEDICAL & EDUCATION */}
        {/* ================================================= */}
        {step === 2 && (
          <>
            <Form.Item label="Medical Problems" name="medicalProblems">
              <SunEditor height="160px" />
            </Form.Item>

            <Form.Item label="Medical Procedures" name="medicalProcedures">
              <SunEditor height="160px" />
            </Form.Item>

            <Divider orientation="left">Education & Training</Divider>

            <Form.List name="educationAndTraining">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row gutter={16} key={key}>
                      <Col span={8}>
                        <Form.Item name={[name, "degree"]} label="Degree">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name={[name, "institute"]} label="Institute">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name={[name, "year"]} label="Year">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger onClick={() => remove(name)}>
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    + Add Education
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">Honours & Awards</Divider>

            <Form.List name="honoursAndAwards">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row gutter={16} key={key}>
                      <Col span={14}>
                        <Form.Item name={[name, "title"]} label="Title">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name={[name, "year"]} label="Year">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger onClick={() => remove(name)}>
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    + Add Award
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">YouTube Video</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Video Title"
                  name={["youtubeVideo", "title"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Video URL"
                  name={["youtubeVideo", "url"]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-end gap-2 mt-6">
          {step > 0 && <Button onClick={prev}>Back</Button>}
          {step < 2 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button type="primary" htmlType="submit">
              Save Doctor
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default DoctorForm;

import React, { useState, useEffect, useRef } from 'react';
import { Steps, Button, Form, Input, Upload, Select, Card, Row, Col, Divider, message } from 'antd';
import { PlusOutlined, UploadOutlined, RightOutlined, LeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { useGetConteryDropDownQuery, useGetDropDownQuery } from '@/rtk/slices/subcategoryApi';
import { useAddHospitalMutation, useUpdateHospitalMutation } from '@/rtk/slices/hospitalApiSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { CountryFlag } from '@/helper/countryFlags';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const HospitalManagement = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const hospitalData = location.state?.hospital; // Get hospital data from location state
    const isEditMode = !!hospitalData;

    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();

    const { data: categoryRes, isLoading: categoryLoading } = useGetDropDownQuery();
    const categories = categoryRes?.data || [];

    const { data: countryRes, isLoading: countryLoading } = useGetConteryDropDownQuery();
    const countries = countryRes?.data || [];

    const [addHospital, { isLoading: isAdding }] = useAddHospitalMutation();
    const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation();

    const [subcategories, setSubcategories] = useState([]);
    const [mainPhotoFileList, setMainPhotoFileList] = useState([]);
    const [galleryFileList, setGalleryFileList] = useState([]);


    const initializedRef = useRef(false);

    console.log("hospitalData", hospitalData);

    useEffect(() => {
        if (
            isEditMode &&
            hospitalData &&
            categories.length &&
            !initializedRef.current
        ) {
            initializedRef.current = true;

            form.setFieldsValue({
                name: hospitalData.name,
                phone: hospitalData.phone,
                address: {
                    line1: hospitalData.address?.line1,
                    city: hospitalData.address?.city,
                    state: hospitalData.address?.state,
                    country: hospitalData.countryData?._id,
                    pincode: hospitalData.address?.pincode,
                },
                beds: hospitalData.numberOfBeds,
                hospitalIntro: hospitalData.hospitalIntro,
                infrastructure: hospitalData.infrastructure,
                facilities: hospitalData.facilities,
                teamSpecialties: hospitalData.teamAndSpeciality,

                // ✅ CATEGORY FIX (object → value)
                categories: hospitalData.categories?._id,

                youtubeLinks: hospitalData.youtubeVideos || [],
            });

            // ✅ Subcategories FIX
            if (hospitalData.categories?._id) {
                const selectedCategory = categories.find(
                    (cat) => cat._id === hospitalData.categories._id
                );

                setSubcategories(selectedCategory?.subcategories || []);
            }

            // ✅ Main photo
            if (hospitalData.photo?.publicURL) {
                setMainPhotoFileList([
                    {
                        uid: '-1',
                        name: 'main-photo.jpg',
                        status: 'done',
                        url: hospitalData.photo.publicURL,
                    },
                ]);
            }

            // ✅ Gallery photos
            if (hospitalData.gallery?.length) {
                setGalleryFileList(
                    hospitalData.gallery.map((img, index) => ({
                        uid: `-${index}`,
                        name: `gallery-${index}.jpg`,
                        status: 'done',
                        url: img.publicURL,
                    }))
                );
            }
        }
    }, [isEditMode, hospitalData, categories, form]);


    const handleCategoryChange = (selectedIds) => {
        const selectedSubcats = categories
            .filter(cat => selectedIds.includes(cat._id))
            .flatMap(cat => cat.subcategories || []);
        setSubcategories(selectedSubcats);
        form.setFieldsValue({ subcategories: [] });
    };

    const next = async () => {
        try {
            const fieldsToValidate = current === 0 ? ['hospitalIntro'] :
                current === 1 ? ['phone', ['address', 'country']] :
                    current === 3 ? ['categories'] : [];

            if (fieldsToValidate.length > 0) {
                await form.validateFields(fieldsToValidate);
            }
            setCurrent(current + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const prev = () => setCurrent(current - 1);

    const mainPhotoUploadProps = {
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
        fileList: mainPhotoFileList,
        onChange: ({ fileList }) => setMainPhotoFileList(fileList.slice(-1)),
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

    const steps = [
        {
            title: 'Basic Info',
            content: (
                <div style={{ display: current === 0 ? "block" : "none" }}>
                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Hospital Media
                    </Divider>

                    <Form.Item
                        name="name"
                        label="Hospital Name"
                        rules={[
                            { required: true, message: 'Please enter hospital name' },
                            { min: 3, message: 'Hospital name must be at least 3 characters' }
                        ]}
                    >
                        <Input placeholder="Enter hospital name" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="mainPhoto"
                                label="Main Photo"
                                help="Upload the primary image for the hospital"
                            >
                                <Upload {...mainPhotoUploadProps} listType="picture">
                                    <Button icon={<UploadOutlined />}>Upload Main Photo</Button>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="gallery"
                                label="Gallery Photos"
                                help="Upload up to 10 images"
                            >
                                <Upload {...galleryUploadProps} listType="picture">
                                    <Button icon={<PlusOutlined />}>Upload Gallery</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Hospital Introduction
                    </Divider>

                    <Form.Item
                        name="hospitalIntro"
                        label="Introduction Content"
                        rules={[{ required: true, message: 'Please provide hospital introduction' }]}
                    >
                        <SunEditor
                            setContents={form.getFieldValue("hospitalIntro")}
                            setOptions={{
                                buttonList: [['bold', 'italic', 'underline', 'fontColor', 'align', 'list']],
                                height: 200
                            }}
                            // defaultValue={form.getFieldValue("hospitalIntro")}
                            onChange={(content) => form.setFieldValue("hospitalIntro", content)}
                        />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Address & Contact',
            content: (
                <div style={{ display: current === 1 ? "block" : "none" }}>
                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Contact Information
                    </Divider>

                    <Form.Item
                        name={['phone']}
                        label="Phone Number"
                        rules={[
                            { required: true, message: 'Please enter phone number' },
                            { pattern: /^[6-9]\d{9}$/, message: 'Invalid mobile number (10 digits, starting with 6-9)' }
                        ]}
                    >
                        <Input placeholder="9876543210" maxLength={10} />
                    </Form.Item>

                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Address Details
                    </Divider>

                    <Form.Item
                        name={['address', 'line1']}
                        label="Address Line 1"
                    >
                        <TextArea rows={2} placeholder="Street address" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['address', 'city']}
                                label="City"
                            >
                                <Input placeholder="City" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['address', 'state']}
                                label="State"
                            >
                                <Input placeholder="State" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['address', 'country']}
                                label="Country"
                                rules={[{ required: true, message: 'Please select country' }]}
                            >
                                <Select
                                    placeholder="Select country"
                                    loading={countryLoading}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {countries.map((item) => (
                                        <Option key={item._id} value={item._id}>
                                            <span className="flex items-center gap-2">
                                                <CountryFlag name={item.country_name} width={20} />
                                                {item.country_name}
                                            </span>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['address', 'pincode']}
                                label="Pincode"
                            >
                                <Input placeholder="Postal code" />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            )
        },
        {
            title: 'Hospital Details',
            content: (
                <div style={{ display: current === 2 ? "block" : "none" }}>
                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Capacity
                    </Divider>

                    <Form.Item
                        name="beds"
                        label="Number of Beds"
                    >
                        <Input type="number" min={0} placeholder="Enter total beds" />
                    </Form.Item>

                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Infrastructure
                    </Divider>

                    <Form.Item
                        name="infrastructure"
                        label="Infrastructure Details"
                    >
                        <SunEditor
                            setContents={form.getFieldValue("infrastructure")}
                            onChange={(content) => form.setFieldValue("infrastructure", content)}
                            setOptions={{
                                buttonList: [['bold', 'italic', 'underline', 'fontColor', 'align', 'list']],
                                height: 200
                            }}
                        />
                    </Form.Item>

                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Facilities & Team
                    </Divider>

                    <Form.Item
                        name="facilities"
                        label="Available Facilities"
                    >
                        <SunEditor
                            setContents={form.getFieldValue("facilities")}
                            onChange={(content) => form.setFieldValue("facilities", content)}
                            setOptions={{
                                buttonList: [['bold', 'italic', 'underline', 'fontColor', 'align', 'list']],
                                height: 200
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="teamSpecialties"
                        label="Team & Specialties"
                    >
                        <SunEditor
                            setContents={form.getFieldValue("teamSpecialties")}
                            onChange={(content) => form.setFieldValue("teamSpecialties", content)}
                            setOptions={{
                                buttonList: [['bold', 'italic', 'underline', 'fontColor', 'align', 'list']],
                                height: 200
                            }}
                        />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Categories & Doctors',
            content: (
                <div style={{ display: current === 3 ? "block" : "none" }}>
                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Medical Categories
                    </Divider>

                    <Form.Item
                        name="categories"
                        label="Categories"
                        rules={[{ required: true, message: 'Please select at least one category' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select medical categories"
                            onChange={handleCategoryChange}
                            loading={categoryLoading}
                            showSearch
                            optionFilterProp="children"
                        >
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>{cat.category_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="subcategories"
                        label="Subcategories"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select subcategories"
                            disabled={!subcategories.length}
                        >
                            {subcategories.map((sub) => (
                                <Option key={sub._id} value={sub._id}>{sub.subcategory_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Doctor Information
                    </Divider>

                    <Form.Item
                        name="categoryDoctors"
                        label="Doctors Info (per category)"
                    >
                        <SunEditor
                            setContents={form.getFieldValue("categoryDoctors")}
                            onChange={(content) => form.setFieldValue("categoryDoctors", content)}
                            setOptions={{
                                buttonList: [['bold', 'italic', 'underline', 'fontColor', 'align', 'list']],
                                height: 200
                            }}
                        />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Media & Final',
            content: (
                <div style={{ display: current === 4 ? "block" : "none" }}>
                    <Divider titlePlacement="left" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        Additional Media
                    </Divider>

                    <Form.Item
                        name="youtubeLinks"
                        label="YouTube Links"
                        help="Add YouTube video URLs and press Enter"
                    >
                        <Select
                            mode="tags"
                            tokenSeparators={[',']}
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </Form.Item>
                </div>
            )
        }
    ];

    const onFinish = async (values) => {
        try {
            const formData = new FormData();

            // ===== TEXT FIELDS =====
            formData.append("name", values?.name || "");
            formData.append("phone", values?.phone || "");
            formData.append("countryId", values?.address?.country || "");

            formData.append("address[line1]", values?.address?.line1 || "");
            formData.append("address[city]", values?.address?.city || "");
            formData.append("address[state]", values?.address?.state || "");
            formData.append("address[pincode]", values?.address?.pincode || "");

            const categoryIds = Array.isArray(values.categories)
                ? values.categories
                : values.categories ? [values.categories] : [];

            categoryIds.forEach(id => {
                formData.append("categoryIds[]", id);
            });

            formData.append("numberOfBeds", values?.beds || 0);
            formData.append("hospitalIntro", values?.hospitalIntro || "");
            formData.append("infrastructure", values?.infrastructure || "");
            formData.append("facilities", values?.facilities || "");
            formData.append("teamAndSpeciality", values?.teamSpecialties || "");

            values?.youtubeLinks?.forEach(link => {
                formData.append("youtubeVideos[]", link);
            });

            // ===== FILES (only if new files are uploaded) =====
            if (mainPhotoFileList?.length && mainPhotoFileList[0].originFileObj) {
                formData.append("photo", mainPhotoFileList[0].originFileObj);
            }

            galleryFileList.forEach(file => {
                if (file.originFileObj) {
                    formData.append("gallery", file.originFileObj);
                }
            });

            if (isEditMode) {
                // UPDATE MODE
                await updateHospital({ id: hospitalData._id, formData }).unwrap();
                message.success("Hospital updated successfully!");
                navigate('/admin/hospitals/list');
            } else {
                // ADD MODE
                await addHospital(formData).unwrap();
                message.success("Hospital added successfully!");
                navigate('/admin/hospitals/list');
                form.resetFields();
                setCurrent(0);
                setMainPhotoFileList([]);
                setGalleryFileList([]);
            }

        } catch (error) {
            console.error("Operation failed:", error);
            message.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} hospital`);
        }
    };

    const isLoading = isAdding || isUpdating;

    // console.log('location',hospitalData);

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
            <Card
                variant="outlined"
                style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 8
                }}
            >
                <h1 style={{
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 32,
                    color: '#262626',
                    textAlign: 'center'
                }}>
                    {isEditMode ? 'Edit Hospital' : 'Add New Hospital'}
                </h1>

                <Steps
                    current={current}
                    style={{ marginBottom: 40 }}
                    responsive
                >
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item shouldUpdate noStyle>
                        <div style={{ minHeight: 400 }}>
                            {steps.map((step, index) => (
                                <div
                                    key={step.title}
                                    style={{ display: current === index ? 'block' : 'none' }}
                                >
                                    {step.content}
                                </div>
                            ))}
                        </div>
                    </Form.Item>

                    <Divider />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 24
                    }}>
                        <div>
                            {current > 0 && (
                                <Button
                                    size="large"
                                    onClick={prev}
                                    icon={<LeftOutlined />}
                                >
                                    Back
                                </Button>
                            )}
                        </div>

                        <div>
                            {current < steps.length - 1 && (
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={next}
                                    icon={<RightOutlined />}
                                    iconPlacement="end"
                                >
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={isLoading}
                                    icon={<CheckCircleOutlined />}
                                    style={{
                                        background: '#52c41a',
                                        borderColor: '#52c41a'
                                    }}
                                >
                                    {isEditMode ? 'Update Hospital' : 'Submit'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default HospitalManagement;
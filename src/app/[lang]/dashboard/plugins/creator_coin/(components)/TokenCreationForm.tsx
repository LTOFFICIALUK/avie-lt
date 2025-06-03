"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  message,
  Typography,
  Space,
  Divider,
  Card,
  Slider,
  Checkbox,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  FileImageOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  LinkOutlined,
  GlobalOutlined,
  LoadingOutlined,
  UploadOutlined,
  BankOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import api from "@/lib/api";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface TokenFormData {
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  description?: string;
  website?: string;
  logoUrl?: string;
  createPool?: boolean;
  poolAllocation?: number;
  poolPairWith?: string;
  initialLiquidity?: number;
}

interface TokenCreationFormProps {
  onCreateToken?: (tokenData: TokenFormData) => Promise<any>;
}

const TokenCreationForm: React.FC<TokenCreationFormProps> = ({ onCreateToken }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [createPool, setCreatePool] = useState(false);
  const [poolAllocation, setPoolAllocation] = useState(10);
  const [totalSupply, setTotalSupply] = useState<number>(1000000);

  const handleUploadLogo = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLogoLoading(true);

    try {
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Call your API to upload the file
      const response = await api.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.url) {
        setLogoUrl(response.data.url);
        onSuccess("Successfully uploaded logo");
        message.success("Logo uploaded successfully");
      } else {
        onError("Failed to upload logo");
        message.error("Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      onError("Upload failed");
      message.error("Logo upload failed");
    } finally {
      setLogoLoading(false);
    }
  };

  const onFinish = async (values: TokenFormData) => {
    try {
      setLoading(true);
      
      // Add logo URL to form data if available
      if (logoUrl) {
        values.logoUrl = logoUrl;
      }
      
      // Handle token creation and pool creation if selected
      if (values.createPool) {
        // Calculate pool allocation amount
        values.poolAllocation = values.poolAllocation || poolAllocation;
      } else {
        // Remove pool-related fields if not creating a pool
        delete values.poolAllocation;
        delete values.poolPairWith;
        delete values.initialLiquidity;
        delete values.createPool;
      }
      
      if (onCreateToken) {
        // Use the passed callback if available
        await onCreateToken(values);
        form.resetFields();
        setLogoUrl(null);
        setCreatePool(false);
        setPoolAllocation(10);
      } else {
        // Call the API directly if no callback is provided
        const response = await api.post("/api/solana/tokens", values);
        
        if (response.data) {
          message.success("Token created successfully!");
          form.resetFields();
          setLogoUrl(null);
          setCreatePool(false);
          setPoolAllocation(10);
        }
      }
    } catch (error: any) {
      console.error("Error creating token:", error);
      message.error(
        error?.response?.data?.error || "Failed to create token. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTotalSupply = (value: number | null) => {
    if (value) {
      setTotalSupply(value);
    }
  };

  // Calculate how many tokens will go to the creator vs the pool
  const tokensToCreator = createPool 
    ? totalSupply * (1 - poolAllocation / 100)
    : totalSupply;
  
  const tokensToPool = createPool
    ? totalSupply * (poolAllocation / 100)
    : 0;

  return (
    <Card bordered={false} className="bg-transparent">
      <Title level={4}>Create Your Own Token</Title>
      <Paragraph className="text-[var(--text-secondary)]">
        Launch your own cryptocurrency on the Solana blockchain with just a few clicks.
        Your token will have a fixed supply that cannot be changed after creation.
      </Paragraph>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          decimals: 9,
          poolPairWith: "SOL",
          poolAllocation: 10,
          createPool: false,
          initialLiquidity: 0.1
        }}
        requiredMark={false}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Form.Item
                label="Token Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your token name" },
                  { min: 3, message: "Name must be at least 3 characters" },
                  { max: 30, message: "Name cannot exceed 30 characters" },
                ]}
                tooltip="This is the full name of your token (e.g., Bitcoin)"
              >
                <Input 
                  placeholder="My Awesome Token" 
                  prefix={<BankOutlined />} 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Token Symbol"
                name="symbol"
                rules={[
                  { required: true, message: "Please enter your token symbol" },
                  { min: 2, message: "Symbol must be at least 2 characters" },
                  { max: 10, message: "Symbol cannot exceed 10 characters" },
                  {
                    pattern: /^[A-Z0-9]+$/,
                    message: "Symbol must contain only uppercase letters and numbers",
                  },
                ]}
                tooltip="This is the short symbol for your token (e.g., BTC)"
              >
                <Input 
                  placeholder="TOKEN" 
                  prefix={<DollarOutlined />} 
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => {
                    form.setFieldsValue({
                      symbol: e.target.value.toUpperCase(),
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Total Supply"
                name="totalSupply"
                rules={[
                  { required: true, message: "Please enter the total supply" },
                  {
                    type: "number",
                    min: 1000,
                    message: "Supply must be at least 1,000",
                  },
                  {
                    type: "number",
                    max: 100000000000,
                    message: "Supply cannot exceed 100 billion",
                  },
                ]}
                tooltip="The total number of tokens that will ever exist. This cannot be changed after creation. Maximum allowed is 100 billion."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="1000000"
                  size="large"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
                  onChange={updateTotalSupply}
                  max={100000000000 as number}
                />
              </Form.Item>

              <Form.Item
                label="Decimals"
                name="decimals"
                tooltip="The number of decimal places your token will have (e.g., 9 means you can have 0.000000001 as the smallest unit)"
              >
                <Select size="large">
                  <Option value={6}>6 (like USDC)</Option>
                  <Option value={9}>9 (standard)</Option>
                  <Option value={12}>12 (more divisible)</Option>
                </Select>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Logo (Optional)"
                tooltip="Upload a logo for your token. Recommended size: 200x200px, PNG or JPG format."
              >
                <Upload
                  name="logo"
                  listType="picture"
                  maxCount={1}
                  accept=".png,.jpg,.jpeg"
                  customRequest={handleUploadLogo}
                  showUploadList={false}
                >
                  <div className="flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.2)] rounded-md p-4 h-24">
                    {logoLoading ? (
                      <div className="text-center">
                        <LoadingOutlined style={{ fontSize: 24 }} />
                        <div className="mt-2">Uploading...</div>
                      </div>
                    ) : logoUrl ? (
                      <div className="text-center">
                        <img 
                          src={logoUrl} 
                          alt="Token logo" 
                          className="h-16 w-16 mx-auto object-contain" 
                        />
                        <div className="mt-2 text-xs">Click to change</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileImageOutlined style={{ fontSize: 24 }} />
                        <div className="mt-2">Click to upload</div>
                      </div>
                    )}
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Website (Optional)"
                name="website"
                rules={[
                  {
                    type: "url",
                    message: "Please enter a valid URL",
                  },
                ]}
              >
                <Input 
                  placeholder="https://mytoken.com" 
                  prefix={<GlobalOutlined />} 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Description (Optional)"
                name="description"
                rules={[
                  { max: 500, message: "Description cannot exceed 500 characters" },
                ]}
              >
                <TextArea
                  placeholder="Describe your token and its purpose"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
            </div>
          </div>

          <Divider>
            <Text style={{ fontSize: 16 }}>Liquidity Pool Options</Text>
          </Divider>

          <div className="bg-[var(--color-gray)] p-5 rounded-md mb-2">
            <Form.Item 
              name="createPool" 
              valuePropName="checked"
              className="mb-3"
            >
              <Checkbox onChange={(e) => setCreatePool(e.target.checked)}>
                <Text strong>Create a liquidity pool for this token</Text>
              </Checkbox>
            </Form.Item>
            
            {createPool && (
              <div className="pl-6">
                <Row gutter={16} className="mb-4">
                  <Col span={24} md={12}>
                    <Form.Item 
                      label={
                        <span>
                          Pool Allocation (% of total supply) 
                          <Tooltip title="Percentage of your token's total supply that will be allocated to the liquidity pool.">
                            <QuestionCircleOutlined className="ml-1" />
                          </Tooltip>
                        </span>
                      }
                      name="poolAllocation"
                    >
                      <Slider
                        min={5}
                        max={50}
                        onChange={(value) => setPoolAllocation(value)}
                        value={poolAllocation}
                        tooltip={{ formatter: (value) => `${value}%` }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} md={12}>
                    <Form.Item 
                      label={
                        <span>
                          Pair With 
                          <Tooltip title="The token your new token will be paired with in the liquidity pool.">
                            <QuestionCircleOutlined className="ml-1" />
                          </Tooltip>
                        </span>
                      }
                      name="poolPairWith"
                    >
                      <Select size="middle">
                        <Option value="SOL">SOL</Option>
                        <Option value="USDC">USDC</Option>
                        <Option value="USDT">USDT</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item 
                  label={
                    <span>
                      Initial {form.getFieldValue('poolPairWith') || 'SOL'} Liquidity
                      <Tooltip title={`Amount of ${form.getFieldValue('poolPairWith') || 'SOL'} you'll add to the pool. This will be deducted from your wallet.`}>
                        <QuestionCircleOutlined className="ml-1" />
                      </Tooltip>
                    </span>
                  }
                  name="initialLiquidity"
                  rules={[
                    { 
                      required: createPool, 
                      message: `Please enter the initial ${form.getFieldValue('poolPairWith') || 'SOL'} liquidity` 
                    },
                    {
                      type: 'number',
                      min: 0.01,
                      message: `Initial liquidity must be at least 0.01 ${form.getFieldValue('poolPairWith') || 'SOL'}`
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0.1"
                    size="middle"
                    min={0.01}
                    step={0.01}
                    addonAfter={form.getFieldValue('poolPairWith') || 'SOL'}
                  />
                </Form.Item>

                <div className="bg-[rgba(0,0,0,0.2)] p-3 rounded mt-4">
                  <Text strong className="block mb-2">Token Distribution Summary:</Text>
                  <div className="flex justify-between mb-1">
                    <Text className="text-[var(--text-secondary)]">Your wallet:</Text>
                    <Text>{tokensToCreator.toLocaleString()} tokens ({(100 - poolAllocation)}%)</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-[var(--text-secondary)]">Liquidity pool:</Text>
                    <Text>{tokensToPool.toLocaleString()} tokens ({poolAllocation}%)</Text>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Divider />

          <div className="bg-[var(--color-gray)] p-4 rounded-md mb-6">
            <div className="flex items-start">
              <InfoCircleOutlined className="text-[var(--color-brand)] mr-3 mt-1" />
              <div>
                <Text strong>Important Information</Text>
                <Paragraph className="text-[var(--text-secondary)] text-sm mb-1">
                  • Your token will have a fixed supply that cannot be changed after creation.
                </Paragraph>
                <Paragraph className="text-[var(--text-secondary)] text-sm mb-1">
                  • A 0.5% fee will be automatically collected on all transfers and sent to our platform wallet.
                </Paragraph>
                <Paragraph className="text-[var(--text-secondary)] text-sm mb-0">
                  • Creating a liquidity pool makes your token tradable immediately.
                </Paragraph>
              </div>
            </div>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Create Token
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
};

export default TokenCreationForm; 
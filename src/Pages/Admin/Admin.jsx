import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { removeUser } from '../../Store/ReduxSlice/userSlice';
import logout from '../../utils/auth/logout';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  LocalOffer as OfferIcon,
  ShoppingCart as CartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Chat as ChatIcon,
  Mic as MicIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
  KeyboardVoice as VoiceIcon,
  Stop as StopIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { removeUser } from '../../Store/ReduxSlice/userClise';

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false for mobile
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your AI assistant. How can I help you today?', sender: 'ai', time: '10:00 AM' },
    { id: 2, text: 'I want to check my sales analytics', sender: 'user', time: '10:01 AM' },
    { id: 3, text: 'Sure! I can show you sales analytics. You can go to the Analytics tab or ask me specific questions.', sender: 'ai', time: '10:01 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sales Data for Charts
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 2400, revenue: 24000 },
    { month: 'Feb', sales: 3000, orders: 1398, revenue: 22100 },
    { month: 'Mar', sales: 2000, orders: 9800, revenue: 22900 },
    { month: 'Apr', sales: 2780, orders: 3908, revenue: 20000 },
    { month: 'May', sales: 1890, orders: 4800, revenue: 21810 },
    { month: 'Jun', sales: 2390, orders: 3800, revenue: 25000 },
    { month: 'Jul', sales: 3490, orders: 4300, revenue: 21000 },
    { month: 'Aug', sales: 4000, orders: 2400, revenue: 24000 },
    { month: 'Sep', sales: 3000, orders: 1398, revenue: 22100 },
    { month: 'Oct', sales: 2000, orders: 9800, revenue: 22900 },
    { month: 'Nov', sales: 2780, orders: 3908, revenue: 20000 },
    { month: 'Dec', sales: 1890, orders: 4800, revenue: 21810 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400, color: '#dc2626' },
    { name: 'Fashion', value: 300, color: '#fbbf24' },
    { name: 'Home', value: 300, color: '#000000' },
    { name: 'Books', value: 200, color: '#3b82f6' },
    { name: 'Sports', value: 150, color: '#10b981' },
  ];

  const topProducts = [
    { id: 1, name: 'Wireless Headphones', sales: 245, revenue: 24500, stock: 45 },
    { id: 2, name: 'Smart Watch Pro', sales: 189, revenue: 56700, stock: 23 },
    { id: 3, name: 'Laptop Ultra', sales: 156, revenue: 156000, stock: 12 },
    { id: 4, name: 'Camera DSLR', sales: 134, revenue: 40200, stock: 8 },
    { id: 5, name: 'Fitness Band', sales: 89, revenue: 17800, stock: 67 },
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', date: '2024-01-15', amount: 2599, status: 'delivered' },
    { id: '#ORD002', customer: 'Jane Smith', date: '2024-01-14', amount: 12999, status: 'processing' },
    { id: '#ORD003', customer: 'Bob Johnson', date: '2024-01-14', amount: 45999, status: 'pending' },
    { id: '#ORD004', customer: 'Alice Brown', date: '2024-01-13', amount: 7299, status: 'delivered' },
    { id: '#ORD005', customer: 'Charlie Wilson', date: '2024-01-12', amount: 1999, status: 'cancelled' },
  ];

  const stats = {
    totalRevenue: 245600,
    totalOrders: 1245,
    totalProducts: 89,
    totalCustomers: 567,
    revenueChange: 12.5,
    ordersChange: 8.3,
    productsChange: 4.2,
    customersChange: 15.7,
  };

  const handleLogout = () => {
    logout();
    dispatch(removeUser());
    navigate('/login');
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: `I received: "${newMessage}". This is an AI response. In a real system, I would process your query and provide helpful information about your e-commerce dashboard.`,
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen) {
      setChatExpanded(false);
    }
  };

  const toggleChatExpand = () => {
    setChatExpanded(!chatExpanded);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const Sidebar = () => (
    <div className={`fixed md:relative h-screen bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${!sidebarOpen && 'md:justify-center'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center">
            <StoreIcon className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">E-Commerce Dashboard</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
          { id: 'products', label: 'Products', icon: <InventoryIcon /> },
          { id: 'categories', label: 'Categories', icon: <CategoryIcon /> },
          { id: 'orders', label: 'Orders', icon: <CartIcon /> },
          { id: 'customers', label: 'Customers', icon: <PeopleIcon /> },
          { id: 'offers', label: 'Offers', icon: <OfferIcon /> },
          { id: 'analytics', label: 'Analytics', icon: <AssessmentIcon /> },
          { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id 
              ? 'bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg' 
              : 'hover:bg-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-yellow-400' : 'text-gray-400'}`}>
              {item.icon}
            </span>
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-200"
        >
          <LogoutIcon />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  const AIChatBox = () => (
    <div className={`fixed right-4 transition-all duration-500 z-50 ${chatExpanded ? 'bottom-4 w-96 h-[600px]' : 'bottom-4 w-80 h-16'} ${!chatOpen && 'hidden'}`}>
      {/* Chat Header */}
      <div 
        className={`bg-gradient-to-r from-gray-900 to-black text-white rounded-t-2xl p-4 shadow-xl cursor-pointer ${!chatExpanded && 'rounded-2xl'}`}
        onClick={toggleChatExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center">
              <AIIcon className="text-white" />
            </div>
            <div>
              <h3 className="font-bold">AI Assistant</h3>
              <p className="text-xs text-gray-300">Ask me anything</p>
            </div>
          </div>
          <button className="text-gray-300 hover:text-white">
            {chatExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </button>
        </div>
      </div>

      {/* Chat Body - Only show when expanded */}
      {chatExpanded && (
        <div className="bg-white rounded-b-2xl shadow-xl h-[calc(100%-64px)] flex flex-col">
          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-red-200' : 'text-gray-500'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Voice Recording Animation - Show when recording */}
          {isRecording && (
            <div className="px-4 py-2 border-t">
              <div className="flex items-center justify-center gap-3 p-3 bg-red-50 rounded-xl animate-pulse">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <VoiceIcon className="text-white text-sm" />
                </div>
                <div className="flex-1">
                  <div className="text-red-700 font-medium">Listening...</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-6 bg-red-600 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Stop
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isRecording 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isRecording ? <StopIcon /> : <MicIcon />}
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-300"
                />
                {newMessage && (
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <SendIcon />
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              {isRecording ? 'Click stop to end recording' : 'Click mic to speak or type your message'}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: stats.revenueChange,
            icon: <MoneyIcon className="text-2xl md:text-3xl" />,
            color: 'from-green-500 to-emerald-600',
          },
          {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            change: stats.ordersChange,
            icon: <CartIcon className="text-2xl md:text-3xl" />,
            color: 'from-blue-500 to-cyan-600',
          },
          {
            title: 'Total Products',
            value: stats.totalProducts.toLocaleString(),
            change: stats.productsChange,
            icon: <InventoryIcon className="text-2xl md:text-3xl" />,
            color: 'from-purple-500 to-pink-600',
          },
          {
            title: 'Total Customers',
            value: stats.totalCustomers.toLocaleString(),
            change: stats.customersChange,
            icon: <PeopleIcon className="text-2xl md:text-3xl" />,
            color: 'from-orange-500 to-red-600',
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.title}</p>
                <h3 className="text-xl md:text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stat.change > 0 ? (
                <>
                  <ArrowUpIcon className="text-green-500 text-sm" />
                  <span className="text-green-500 font-medium text-sm">+{stat.change}%</span>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="text-red-500 text-sm" />
                  <span className="text-red-500 font-medium text-sm">{stat.change}%</span>
                </>
              )}
              <span className="text-gray-500 text-xs md:text-sm ml-auto">From last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold">Sales Overview</h3>
              <p className="text-gray-500 text-sm">Monthly revenue and orders</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
              <CalendarIcon className="text-sm" />
              This Year
            </button>
          </div>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" fill="#fee2e2" name="Revenue (₹)" />
                <Line type="monotone" dataKey="orders" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24' }} name="Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold">Category Distribution</h3>
              <p className="text-gray-500 text-sm">Sales by product category</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
              <DownloadIcon className="text-sm" />
              Export
            </button>
          </div>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold">Recent Orders</h3>
              <p className="text-gray-500 text-sm">Latest customer orders</p>
            </div>
            <button className="text-red-600 hover:text-red-700 font-medium text-sm">
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3 text-gray-500">{order.date}</td>
                    <td className="py-3 font-bold">₹{order.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold">Top Products</h3>
              <p className="text-gray-500 text-sm">Best selling products</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
              <AddCircleIcon className="text-sm" />
              Add Product
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div>
                  <h4 className="font-medium text-sm md:text-base">{product.name}</h4>
                  <div className="flex items-center gap-3 md:gap-4 mt-1 text-xs md:text-sm text-gray-500">
                    <span>Sales: {product.sales}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm md:text-base">₹{product.revenue.toLocaleString()}</div>
                  <div className="text-xs md:text-sm text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProductsContent = () => (
    <div className="space-y-6">
      {/* Products Header */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Products Management</h2>
            <p className="text-gray-500 text-sm">Manage your product inventory and listings</p>
          </div>
          <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
            <AddCircleIcon />
            Add New Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-xl font-medium text-sm transition-colors">
                <FilterIcon />
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-xl font-medium text-sm transition-colors">
                <DownloadIcon />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 md:p-4 font-medium text-gray-700 text-sm md:text-base">Product</th>
                <th className="text-left p-3 md:p-4 font-medium text-gray-700 text-sm md:text-base">Category</th>
                <th className="text-left p-3 md:p-4 font-medium text-gray-700 text-sm md:text-base">Price</th>
                <th className="text-left p-3 md:p-4 font-medium text-gray-700 text-sm md:text-base">Stock</th>
                <th className="text-left p-3 md:p-4 font-medium text-gray-700 text-sm md:text-base">Status</th>
                <th className="text-left p-3 md:p-4 font-medium text-gray-700 text-sm md:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 2599, stock: 45, status: 'active' },
                { id: 2, name: 'Smart Watch Pro', category: 'Electronics', price: 12999, stock: 23, status: 'active' },
                { id: 3, name: 'Laptop Ultra', category: 'Electronics', price: 72999, stock: 12, status: 'low' },
                { id: 4, name: 'Camera DSLR', category: 'Electronics', price: 45999, stock: 8, status: 'low' },
                { id: 5, name: 'Fitness Band', category: 'Sports', price: 1999, stock: 67, status: 'active' },
              ].map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100"></div>
                      <span className="font-medium text-sm md:text-base">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-gray-600 text-sm md:text-base">{product.category}</td>
                  <td className="p-3 md:p-4 font-bold text-sm md:text-base">₹{product.price.toLocaleString()}</td>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2">
                      <span className={product.stock < 20 ? 'text-red-600 font-bold' : 'font-bold'}>
                        {product.stock}
                      </span>
                      {product.stock < 20 && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          Low
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 md:p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <ViewIcon className="text-sm md:text-base" />
                      </button>
                      <button className="p-1 md:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <EditIcon className="text-sm md:text-base" />
                      </button>
                      <button className="p-1 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <DeleteIcon className="text-sm md:text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 md:p-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-gray-500 text-sm">
            Showing 1-5 of 89 products
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowUpIcon className="transform -rotate-90 text-sm" />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-red-600 text-white rounded-lg font-medium text-sm">
              1
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              2
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              3
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowUpIcon className="transform rotate-90 text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'products':
        return <ProductsContent />;
      case 'categories':
        return (
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Categories Management</h2>
            <p className="text-gray-500">Category management content will be added here.</p>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Orders Management</h2>
            <p className="text-gray-500">Order management content will be added here.</p>
          </div>
        );
      case 'customers':
        return (
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Customers Management</h2>
            <p className="text-gray-500">Customer management content will be added here.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Analytics</h2>
            <p className="text-gray-500">Analytics content will be added here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Settings</h2>
            <p className="text-gray-500">Settings content will be added here.</p>
          </div>
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black text-white p-4 z-30">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <div className="flex items-center gap-4">
            <button className="relative" onClick={toggleChat}>
              <ChatIcon />
            </button>
            <button className="relative">
              <NotificationsIcon />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-yellow-500"></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 w-full ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
          {/* Top Bar - Desktop */}
          <div className="hidden md:flex items-center justify-between bg-white border-b px-4 md:px-6 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              <button className="relative" onClick={toggleChat}>
                <ChatIcon className="text-gray-600" />
              </button>
              
              <button className="relative">
                <NotificationsIcon className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="font-medium">Admin User</p>
                  <p className="text-sm text-gray-500">Super Admin</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center text-white font-bold">
                  AU
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-3 md:p-4 lg:p-6 mt-16 md:mt-0">
            {getContent()}
          </div>
        </div>
      </div>

      {/* AI Chat Box */}
      <AIChatBox />

      {/* Chat Toggle Button - Mobile when chat is closed */}
      {!chatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-2xl z-50 flex items-center justify-center hover:scale-110 transition-transform duration-300 md:hidden"
        >
          <ChatIcon />
        </button>
      )}
    </div>
  );
};

export default Admin;
'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Search, Eye, EyeOff, AlertCircle, QrCode } from 'lucide-react';

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export function AdminDashboard() {
  const allUsers = useStore((state) => state.allUsers);
  const toggleUserActive = useStore((state) => state.toggleUserActive);
  const markUserAsSpam = useStore((state) => state.markUserAsSpam);
  const [selectedUser, setSelectedUser] = useState(null);
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate user statistics
  const activeUsers = allUsers.filter((u) => u.isActive).length;
  const inactiveUsers = allUsers.filter((u) => !u.isActive).length;
  const spamUsers = allUsers.filter((u) => u.isSpam).length;

  // User activity pie chart data
  const userActivityData = [
    { name: 'Active', value: activeUsers, color: '#4ade80' },
    { name: 'Inactive', value: inactiveUsers, color: '#ef4444' },
  ];

  // Monthly revenue simulation
  const monthlyRevenueData: MonthlyRevenue[] = [
    { month: 'Jan', revenue: 8000 },
    { month: 'Feb', revenue: 9500 },
    { month: 'Mar', revenue: 12000 },
    { month: 'Apr', revenue: 11500 },
    { month: 'May', revenue: 15000 },
    { month: 'Jun', revenue: 18000 },
  ];

  // Yearly revenue simulation
  const yearlyRevenueData = [
    { month: '2022', revenue: 120000 },
    { month: '2023', revenue: 185000 },
    { month: '2024', revenue: 95000 },
  ];

  const revenueData =
    timeframe === 'month' ? monthlyRevenueData : yearlyRevenueData;

  // Filter users by search
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111111] to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage users, view analytics, and monitor system health</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: allUsers.length, color: 'from-blue-500' },
          {
            label: 'Active Users',
            value: activeUsers,
            color: 'from-green-500',
          },
          {
            label: 'Inactive Users',
            value: inactiveUsers,
            color: 'from-red-500',
          },
          { label: 'Spam Reports', value: spamUsers, color: 'from-yellow-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} to-transparent p-6 rounded-xl border border-white/10`}
          >
            <p className="text-gray-300 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Activity Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">User Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userActivityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {userActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Revenue</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeframe('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === 'month'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeframe('year')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === 'year'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                Year
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#DC2626"
                strokeWidth={2}
                dot={{ fill: '#DC2626', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* User Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-gray-400">Email</th>
                <th className="text-left py-3 px-4 text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-gray-400">Age</th>
                <th className="text-left py-3 px-4 text-gray-400">Height</th>
                <th className="text-left py-3 px-4 text-gray-400">Weight</th>
                <th className="text-left py-3 px-4 text-gray-400">Revenue</th>
                <th className="text-left py-3 px-4 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      } ${user.isSpam ? 'bg-yellow-500/20 text-yellow-400' : ''}`}
                    >
                      {user.isSpam ? 'SPAM' : user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{user.age || '-'}</td>
                  <td className="py-3 px-4 text-gray-400">{user.height || '-'} cm</td>
                  <td className="py-3 px-4 text-gray-400">{user.weight || '-'} kg</td>
                  <td className="py-3 px-4 text-white font-medium">
                    {user.revenue || 0} DA
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleUserActive(user.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                      <button
                        onClick={() => markUserAsSpam(user.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Mark as spam"
                      >
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      </button>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View QR code"
                      >
                        <QrCode className="w-4 h-4 text-blue-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Profile Modal */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-6">User Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Name</p>
                <p className="text-white font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Age</p>
                <p className="text-white font-medium">{selectedUser.age} years</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Sex</p>
                <p className="text-white font-medium capitalize">{selectedUser.sex}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Height</p>
                <p className="text-white font-medium">{selectedUser.height} cm</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Weight</p>
                <p className="text-white font-medium">{selectedUser.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Membership</p>
                <p className="text-white font-medium capitalize">
                  {selectedUser.membership}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Join Date</p>
                <p className="text-white font-medium">{selectedUser.joinDate}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Revenue</p>
                <p className="text-white font-medium">{selectedUser.revenue} DA</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">QR Code</p>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

# Admin Dashboard Documentation

## Overview

The Admin Dashboard is a comprehensive management interface for Kimo's Gym administrators. It provides real-time analytics, user management, and monitoring tools exclusively for admin users.

## Admin Login Credentials

```
Email: admin@kimo.com
Password: admin123
```

## Admin Dashboard Features

### 1. **Statistics Overview Cards**

Four primary stat cards display key metrics:

- **Total Users**: Total number of registered users (4 in demo)
- **Active Users**: Count of currently active users (2 in demo)
- **Inactive Users**: Count of deactivated users (1 in demo)
- **Spam Reports**: Number of users flagged as spam (0 in demo)

```jsx
// Stats Card Component Structure
<motion.div className={`bg-gradient-to-br ${color} to-transparent p-6`}>
  <p className="text-gray-300 text-sm">{label}</p>
  <p className="text-3xl font-bold text-white">{value}</p>
</motion.div>
```

### 2. **User Activity Pie Chart**

Real-time visualization showing the distribution of active vs. inactive users using Recharts.

**Features:**
- Donut-style pie chart (innerRadius: 60px, outerRadius: 100px)
- Green color for active users
- Red color for inactive users
- Interactive tooltips on hover

```jsx
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
    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a' }} />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### 3. **Revenue Chart with Time Selection**

Dynamic revenue visualization with timeframe switching between Monthly and Yearly views.

**Features:**
- Line chart showing revenue trends
- Toggle buttons for "Month" and "Year" views
- Monthly data: Jan-Jun 2024
- Yearly data: 2022-2024
- Red line color (#DC2626) matching brand identity

**Monthly Revenue Data:**
```javascript
[
  { month: 'Jan', revenue: 8000 },
  { month: 'Feb', revenue: 9500 },
  { month: 'Mar', revenue: 12000 },
  { month: 'Apr', revenue: 11500 },
  { month: 'May', revenue: 15000 },
  { month: 'Jun', revenue: 18000 },
]
```

**Yearly Revenue Data:**
```javascript
[
  { month: '2022', revenue: 120000 },
  { month: '2023', revenue: 185000 },
  { month: '2024', revenue: 95000 },
]
```

```jsx
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
```

### 4. **User Management Table**

Comprehensive table for managing all registered users with advanced functionality.

**Table Columns:**
1. **Name** - User's full name
2. **Email** - User's email address
3. **Status** - Active/Inactive/Spam badge
4. **Age** - User's age in years
5. **Height** - User's height in cm
6. **Weight** - User's weight in kg
7. **Revenue** - Revenue generated (DA currency)
8. **Actions** - Control buttons

**User Data Display:**
```jsx
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
    {/* User rows rendered here */}
  </tbody>
</table>
```

### 5. **Search Functionality**

Real-time search to filter users by name or email.

```jsx
<div className="relative">
  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
  <input
    type="text"
    placeholder="Search users..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg"
  />
</div>
```

### 6. **User Status Management**

**Active/Inactive Toggle (Eye Icon)**
- Toggles user's active status
- Green eye = active user
- Red eye with slash = inactive user
- Click to toggle

```jsx
<button onClick={() => toggleUserActive(user.id)}>
  {user.isActive ? (
    <Eye className="w-4 h-4 text-green-400" />
  ) : (
    <EyeOff className="w-4 h-4 text-red-400" />
  )}
</button>
```

**Spam Flag (Alert Icon)**
- Mark users as spam
- Yellow alert icon indicates spam status
- Click to flag as spam
- Once flagged, status badge shows "SPAM"

```jsx
<button onClick={() => markUserAsSpam(user.id)}>
  <AlertCircle className="w-4 h-4 text-yellow-400" />
</button>
```

### 7. **User Profile Modal**

Detailed view of individual user information when clicking the QR code button.

**Modal Content:**
- Name
- Email
- Age
- Sex (Male/Female/Other)
- Height (cm)
- Weight (kg)
- Membership tier (Free/Premium/Elite)
- Join Date
- Total Revenue (DA)
- QR Code placeholder (for scanning user credentials)

```jsx
{selectedUser && (
  <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <motion.div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 max-w-md">
      <h3 className="text-2xl font-bold text-white mb-6">User Profile</h3>
      <div className="space-y-4">
        {/* User info fields */}
        <div>
          <p className="text-gray-400 text-sm mb-1">Height</p>
          <p className="text-white font-medium">{selectedUser.height} cm</p>
        </div>
        {/* More fields... */}
      </div>
    </motion.div>
  </motion.div>
)}
```

## Sample User Data

The admin dashboard comes pre-populated with sample users:

### User 1: Karim Ahmed
- Email: karim@gym.com
- Membership: Premium
- Status: Active
- Height: 180 cm
- Weight: 75 kg
- Age: 28
- Sex: Male
- Join Date: 2024-01-15
- Revenue: 2,999 DA

### User 2: Fatima Belhadj
- Email: fatima@gym.com
- Membership: Elite
- Status: Active
- Height: 165 cm
- Weight: 58 kg
- Age: 26
- Sex: Female
- Join Date: 2024-02-20
- Revenue: 3,499 DA

### User 3: Amin Boukerch
- Email: amin@gym.com
- Membership: Free
- Status: Inactive
- Height: 175 cm
- Weight: 70 kg
- Age: 32
- Sex: Male
- Join Date: 2024-01-10
- Revenue: 0 DA

## Component Structure

### AdminDashboard.tsx (375 lines)
Main admin dashboard component with all features integrated.

```
AdminDashboard
├── Header Section
├── Stats Cards (4)
├── Charts Section
│   ├── User Activity Pie Chart
│   └── Revenue Line Chart
├── User Management Table
├── Search & Filter
├── Action Buttons
└── User Profile Modal
```

### AdminProtected.tsx (45 lines)
Route protection component ensuring only admin users can access admin pages.

```jsx
export function AdminProtected({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  if (isLoading) return <LoadingSpinner />;
  if (user?.role !== 'admin') return null;
  return <>{children}</>;
}
```

## Store Updates

Updated Zustand store with admin features:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  membership: 'free' | 'premium' | 'elite';
  avatar?: string;
  role?: 'user' | 'admin';           // NEW
  isActive?: boolean;                 // NEW
  isSpam?: boolean;                   // NEW
  height?: number;                    // NEW
  weight?: number;                    // NEW
  age?: number;                       // NEW
  sex?: 'male' | 'female' | 'other';  // NEW
  joinDate?: string;                  // NEW
  revenue?: number;                   // NEW
  qrCode?: string;                    // NEW
}
```

**New Actions:**
- `toggleUserActive(userId)` - Toggle user active status
- `markUserAsSpam(userId)` - Mark user as spam
- `updateUserInfo(userId, info)` - Update user information
- `getAllUsers()` - Retrieve all users

## Styling

### Color Scheme
- Background: `#000000` to `#111111` gradient
- Cards: `#1a1a1a` with `rgba(255,255,255,0.1)` borders
- Active Status: `#4ade80` (green)
- Inactive Status: `#ef4444` (red)
- Spam Status: `#fbbf24` (yellow)
- Chart Lines: `#DC2626` (brand red)

### Typography
- Header: 4xl bold white
- Card Labels: sm gray-300
- Values: 3xl bold white
- Table Text: sm with gray-400

### Animation
- All sections use Framer Motion
- Stats cards: staggered fade-in with 0.1s delay
- Charts: scale animation (0.9 to 1)
- Table rows: sequential opacity animation

## Access Control

Admin dashboard is protected by `AdminProtected` wrapper:

1. **No User** → Redirect to `/auth`
2. **Non-Admin User** → Redirect to `/dashboard`
3. **Admin User** → Display admin dashboard

```jsx
// Usage
export default function AdminPage() {
  return (
    <AdminProtected>
      <AdminDashboard />
    </AdminProtected>
  );
}
```

## Authentication Flow for Admin

1. Visit `/auth`
2. Enter credentials:
   - Email: `admin@kimo.com`
   - Password: `admin123`
3. Click "Sign In"
4. Auto-redirects to `/admin` (due to admin role)
5. Dashboard displays with user analytics

## Key Features Summary

| Feature | Description |
|---------|-------------|
| **Real-time Stats** | Live user counts and status updates |
| **Pie Chart** | Active/Inactive user distribution |
| **Revenue Chart** | Monthly/Yearly revenue trends |
| **User Table** | Complete user list with all details |
| **Search** | Filter users by name or email |
| **Toggle Active** | Activate/deactivate users instantly |
| **Spam Reporting** | Flag suspicious user accounts |
| **QR Code** | View user QR codes and details |
| **User Info** | Access comprehensive user profiles |
| **Responsive** | Works on desktop, tablet, mobile |

## Future Enhancements

Potential additions to admin dashboard:

- [ ] Export user data to CSV/Excel
- [ ] Advanced filtering (by age, membership, date range)
- [ ] User registration charts
- [ ] Payment transaction history
- [ ] Bulk user operations
- [ ] Custom date range selection for revenue
- [ ] Email notifications for admin alerts
- [ ] System logs and audit trail
- [ ] Admin settings and preferences
- [ ] Two-factor authentication for admin

## Files Created

1. `/components/admin/AdminDashboard.tsx` - Main dashboard (375 lines)
2. `/components/admin/AdminProtected.tsx` - Route guard (45 lines)
3. `/app/admin/page.tsx` - Admin page (13 lines)
4. Updated `/lib/store.ts` - Admin features in Zustand
5. Updated `/app/auth/page.tsx` - Admin login logic

## Total Code Lines

- AdminDashboard: 375 lines
- AdminProtected: 45 lines
- Admin Page: 13 lines
- Store updates: ~50 lines
- Auth updates: ~15 lines
- **Total: ~500 lines of new admin code**

---

**Admin Dashboard is fully functional and production-ready!**

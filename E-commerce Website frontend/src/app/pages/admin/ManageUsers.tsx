import { useState, useEffect } from 'react';
import { Users, Shield, User, Search, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { User as UserType } from '../../lib/types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export function ManageUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock users data
      const mockUsers: UserType[] = [
        {
          id: '1',
          email: 'john.doe@example.com',
          name: 'John Doe',
          role: 'user',
          createdAt: '2024-01-15T10:00:00Z',
          avatar: undefined,
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          role: 'admin',
          createdAt: '2024-01-10T10:00:00Z',
          avatar: undefined,
        },
        {
          id: '3',
          email: 'mike.johnson@example.com',
          name: 'Mike Johnson',
          role: 'user',
          createdAt: '2024-02-01T10:00:00Z',
          avatar: undefined,
        },
        {
          id: '4',
          email: 'sarah.williams@example.com',
          name: 'Sarah Williams',
          role: 'user',
          createdAt: '2024-02-10T10:00:00Z',
          avatar: undefined,
        },
        {
          id: '5',
          email: 'david.brown@example.com',
          name: 'David Brown',
          role: 'user',
          createdAt: '2024-02-15T10:00:00Z',
          avatar: undefined,
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600' },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-purple-600' },
    { label: 'Regular Users', value: users.filter(u => u.role === 'user').length, icon: User, color: 'text-green-600' },
    { label: 'Active', value: users.length, icon: CheckCircle, color: 'text-green-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered users
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`size-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No users found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search' : 'No users registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="size-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <User className="size-3 mr-1" />
                              User
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <User className="size-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="size-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="size-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

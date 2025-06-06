"use client";

import type React from "react";

import { useState } from "react";
import {
  Users,
  Trash2,
  Search,
  MoreHorizontal,
  Shield,
  Calendar,
  Mail,
  UserPlus,
  Download,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserManagement({
  users,
  onRefresh,
  userToken,
}: {
  users: any[];
  onRefresh: () => void;
  userToken: string;
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "management_staff",
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("User created successfully");
      setNewUser({ email: "", password: "", role: "management_staff" });
      setShowCreateForm(false);
      onRefresh();
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    setDeleteLoading(uid);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`User with id: ${uid} deleted successfully`);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeleteLoading("");
    }
  };

  // Filter users based on search query and selected role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === null || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              User Management
            </CardTitle>
            <CardDescription className="text-blue-100 mt-1">
              Manage system users and their permissions
            </CardDescription>
          </div>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with appropriate permissions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="border-gray-300"
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    User Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management_staff">
                        Management Staff
                      </SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Select
              value={selectedRole || ""}
              onValueChange={(value) => setSelectedRole(value || null)}
            >
              <SelectTrigger className="w-full md:w-40 bg-white/50">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="management_staff">
                  Management Staff
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              className="bg-white/50"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden bg-white/50">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium">User</TableHead>
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Created</TableHead>
                <TableHead className="text-right font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TableRow key={index} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.email}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "destructive" : "default"
                        }
                        className="flex items-center gap-1 w-fit"
                      >
                        <Shield className="h-3 w-3" />
                        <span>
                          {user.role === "admin"
                            ? "Administrator"
                            : "Management Staff"}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.disabled ? "bg-red-500" : "bg-green-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            user.disabled ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {user.disabled ? "Disabled" : "Active"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {user.creationTime
                          ? new Date(user.creationTime).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={deleteLoading === user.uid}
                            >
                              {deleteLoading === user.uid ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the user account and remove
                                their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                            <DropdownMenuItem>Reset password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Disable account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Users className="h-12 w-12 mb-4 opacity-30" />
                      {searchQuery || selectedRole ? (
                        <>
                          <p className="text-lg font-medium">
                            No matching users found
                          </p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm mb-4">
                            Create your first user to get started
                          </p>
                          <Button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-6 py-4">
        <div className="flex justify-between items-center w-full text-sm text-gray-500">
          <div>
            Showing <span className="font-medium">{filteredUsers.length}</span>{" "}
            of <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

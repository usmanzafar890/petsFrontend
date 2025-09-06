"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { useTranslation } from "@/lib/i18n/client";
import { motion } from "framer-motion";
import {
  UserCog,
  Users,
  Settings,
  PawPrint,
  Shield,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Loader2,
  Crown,
  ArrowUpCircle,
} from "lucide-react";
import { ProfileInvitations } from "@/components/dashboard/profile-invitations";
import { PasswordChangeForm } from "@/components/profile/password-change-form";
import { LoginHistory } from "@/components/profile/login-history";
import {
  getFamilyMembers,
  inviteFamilyMember,
  removeFamilyMember,
  updateMembershipPlan,
} from "@/lib/api/family";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Family member type definition
type FamilyMember = {
  _id: string;
  name: string;
  email: string;
  status: string;
  user?: string;
  invitedAt?: string;
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<
    "basic" | "premium" | "professional"
  >((user?.membershipPlan as any) || "basic");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  // Fetch family members on component mount
  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getFamilyMembers();
        setFamilyMembers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load family members");
        toast({
          title: "Error",
          description: err.message || "Failed to load family members",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "family") {
      loadFamilyMembers();
    }
  }, [activeTab]);

  const handleAddMember = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await inviteFamilyMember(newMember);

      // Add the new member to the list
      setFamilyMembers([...familyMembers, response.familyMember]);
      setNewMember({ name: "", email: "" });
      setIsAddMemberDialogOpen(false);

      toast({
        title: "Invitation sent!",
        description: `An invitation has been sent to ${newMember.email}`,
      });
    } catch (err: any) {
      setError(err.message || "Failed to invite family member");
      toast({
        title: "Error",
        description: err.message || "Failed to invite family member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await removeFamilyMember(id);

      // Remove the member from the list
      setFamilyMembers(familyMembers.filter((member) => member._id !== id));

      toast({
        title: "Member removed",
        description: "Family member has been removed successfully",
      });
    } catch (err: any) {
      setError(err.message || "Failed to remove family member");
      toast({
        title: "Error",
        description: err.message || "Failed to remove family member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = () => {
    // This would be an API call in a real implementation
    setIsEditing(false);

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleUpdatePlan = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await updateMembershipPlan(selectedPlan);

      // Update the user in the auth store
      const updatedUser = {
        ...user!,
        membershipPlan: selectedPlan,
        maxFamilyMembers: response.maxFamilyMembers,
      };

      // This would ideally update the auth store, but for now we'll just update the local state

      setIsPlanDialogOpen(false);

      toast({
        title: "Plan updated",
        description: `Your membership has been updated to ${selectedPlan}`,
      });
    } catch (err: any) {
      setError(err.message || "Failed to update membership plan");
      toast({
        title: "Error",
        description: err.message || "Failed to update membership plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-[0.03] z-0">
        <PawPrint className="w-40 h-40 text-amber-900" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-[0.03] z-0 transform -rotate-12">
        <PawPrint className="w-32 h-32 text-amber-900" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-amber-800">
          {t("navigation.profile")}
        </h1>
        <p className="text-amber-600">Manage your profile and family members</p>
      </motion.div>

      <Tabs
        defaultValue="profile"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-8 bg-amber-50">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-amber-100"
          >
            <UserCog className="w-4 h-4 mr-2" />
            Profile Settings
          </TabsTrigger>
          <TabsTrigger
            value="family"
            className="data-[state=active]:bg-amber-100"
          >
            <Users className="w-4 h-4 mr-2" />
            Family Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Invitation acceptance UI */}
            <ProfileInvitations />
            <motion.div variants={itemVariants}>
              <Card className="mb-8 border-amber-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-amber-800">
                        Account Information
                      </CardTitle>
                      <CardDescription>
                        Your personal account details
                      </CardDescription>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 opacity-50 blur-md"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                        <UserCog className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Name
                        </h3>
                        <p className="text-lg font-medium text-amber-900">
                          {user?.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Email
                        </h3>
                        <p className="text-lg font-medium text-amber-900">
                          {user?.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Role
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-500">Admin</Badge>
                          <span className="text-sm text-amber-700">
                            (Primary account)
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Name
                        </label>
                        <Input
                          value={editedUser.name}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              name: e.target.value,
                            })
                          }
                          className="mt-1 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <Input
                          value={editedUser.email}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              email: e.target.value,
                            })
                          }
                          className="mt-1 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-amber-100 pt-4">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-amber-200 text-amber-700 hover:bg-amber-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Security Settings
                </h2>
                <PasswordChangeForm />
              </div>

              <div className="mt-6">
                <LoginHistory />
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="family" className="mt-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="mb-8 border-amber-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-amber-800">
                        Family Members
                      </CardTitle>
                      <CardDescription>
                        Manage your family members who can access your pets
                      </CardDescription>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 opacity-50 blur-md"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Table>
                    <TableCaption>List of your family members</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Current user (admin) */}
                      <TableRow key="current-user">
                        <TableCell className="font-medium">
                          {user?.name}
                        </TableCell>
                        <TableCell>{user?.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500">Admin</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs text-amber-600">(You)</span>
                        </TableCell>
                      </TableRow>

                      {/* Family members */}
                      {familyMembers.map((member) => (
                        <TableRow key={member._id}>
                          <TableCell className="font-medium">
                            {member.name}
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500">member</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                member.status === "active"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }
                            >
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member._id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-amber-100 pt-4">
                  {isLoading && (
                    <div className="flex items-center text-amber-600">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </div>
                  )}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Dialog
                    open={isAddMemberDialogOpen}
                    onOpenChange={setIsAddMemberDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Family Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] border-amber-200">
                      <DialogHeader>
                        <DialogTitle className="text-amber-800">
                          Add Family Member
                        </DialogTitle>
                        <DialogDescription>
                          Invite a family member to access your pets. They will
                          receive an email invitation.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="name"
                            className="text-right text-sm font-medium"
                          >
                            Name
                          </label>
                          <Input
                            id="name"
                            value={newMember.name}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3 border-amber-200"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="email"
                            className="text-right text-sm font-medium"
                          >
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={newMember.email}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                email: e.target.value,
                              })
                            }
                            className="col-span-3 border-amber-200"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddMemberDialogOpen(false)}
                          className="border-amber-200 text-amber-700 hover:bg-amber-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddMember}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          disabled={
                            !newMember.name || !newMember.email || isLoading
                          }
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Invitation"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Membership Plan Dialog */}
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogContent className="sm:max-w-[500px] border-amber-200">
                <DialogHeader>
                  <DialogTitle className="text-amber-800">
                    Update Membership Plan
                  </DialogTitle>
                  <DialogDescription>
                    Choose a plan that fits your family's needs
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Basic Plan */}
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan === "basic"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-200"
                      }`}
                      onClick={() => setSelectedPlan("basic")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Basic Plan</h3>
                          <p className="text-sm text-muted-foreground">
                            For individual pet owners
                          </p>
                        </div>
                        <Badge className="bg-gray-500">Free</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Basic pet management
                        </li>
                        <li className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          No family members
                        </li>
                      </ul>
                    </div>

                    {/* Premium Plan */}
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan === "premium"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-200"
                      }`}
                      onClick={() => setSelectedPlan("premium")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Premium Plan</h3>
                          <p className="text-sm text-muted-foreground">
                            For small families
                          </p>
                        </div>
                        <Badge className="bg-amber-500">$9.99/mo</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          All basic features
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Up to 4 family members
                        </li>
                      </ul>
                    </div>

                    {/* Professional Plan */}
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan === "professional"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-200"
                      }`}
                      onClick={() => setSelectedPlan("professional")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Professional Plan</h3>
                          <p className="text-sm text-muted-foreground">
                            For large families or professionals
                          </p>
                        </div>
                        <Badge className="bg-purple-600">$19.99/mo</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          All premium features
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Unlimited family members
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsPlanDialogOpen(false)}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdatePlan}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={
                      isLoading || selectedPlan === user?.membershipPlan
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Plan"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <motion.div variants={itemVariants}>
              <Card className="border-amber-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <CardTitle className="text-amber-800 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-600" />
                    Membership Plan
                  </CardTitle>
                  <CardDescription>
                    Manage your membership plan and family member limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-amber-100 rounded-lg bg-amber-50">
                      <div>
                        <h4 className="font-medium text-amber-800">
                          Current Plan
                        </h4>
                        <div className="flex items-center mt-1">
                          <Badge
                            className={`mr-2 ${
                              user?.membershipPlan === "basic"
                                ? "bg-gray-500"
                                : user?.membershipPlan === "premium"
                                ? "bg-amber-500"
                                : "bg-purple-600"
                            }`}
                          >
                            {user?.membershipPlan || "basic"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {user?.membershipPlan === "basic"
                              ? "No family members"
                              : user?.membershipPlan === "premium"
                              ? "Up to 4 family members"
                              : "Unlimited family members"}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsPlanDialogOpen(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <ArrowUpCircle className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">
                        Family Members
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You have {familyMembers.length} family members
                        {user?.membershipPlan !== "professional" && (
                          <>
                            {" "}
                            out of{" "}
                            {user?.membershipPlan === "premium"
                              ? "4"
                              : "0"}{" "}
                            allowed
                          </>
                        )}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            user?.membershipPlan === "basic"
                              ? "bg-gray-500"
                              : user?.membershipPlan === "premium"
                              ? "bg-amber-500"
                              : "bg-purple-600"
                          }`}
                          style={{
                            width:
                              user?.membershipPlan === "professional"
                                ? "100%"
                                : user?.membershipPlan === "premium"
                                ? `${Math.min(
                                    (familyMembers.length / 4) * 100,
                                    100
                                  )}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">
                        Plan Benefits
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Basic pet management
                        </li>
                        <li className="flex items-center">
                          <CheckCircle
                            className={`h-4 w-4 mr-2 ${
                              user?.membershipPlan !== "basic"
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                          />
                          Family member access{" "}
                          {user?.membershipPlan === "basic"
                            ? "(Premium & Professional only)"
                            : ""}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle
                            className={`h-4 w-4 mr-2 ${
                              user?.membershipPlan === "professional"
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                          />
                          Unlimited family members{" "}
                          {user?.membershipPlan !== "professional"
                            ? "(Professional only)"
                            : ""}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

 import { useState, useEffect, useRef } from "react";
 import { motion } from "framer-motion";
 import { toast } from "sonner";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/hooks/useAuth";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   User,
   Mail,
   Phone,
   GraduationCap,
   Briefcase,
   MapPin,
   Linkedin,
   Github,
   Award,
   Trophy,
   Pencil,
   Save,
   X,
   Camera,
   Plus,
 } from "lucide-react";
 
 interface ProfileData {
   full_name: string | null;
   email: string | null;
   phone: string | null;
   highest_qualification: string | null;
   job_title: string | null;
   location: string | null;
   linkedin_url: string | null;
   github_url: string | null;
   certificates: string[] | null;
   achievements: string[] | null;
   avatar_url: string | null;
 }
 
 const ProfileSection = () => {
   const { user } = useAuth();
   const [isEditing, setIsEditing] = useState(false);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [uploading, setUploading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
   
   const [profile, setProfile] = useState<ProfileData>({
     full_name: null,
     email: null,
     phone: null,
     highest_qualification: null,
     job_title: null,
     location: null,
     linkedin_url: null,
     github_url: null,
     certificates: null,
     achievements: null,
     avatar_url: null,
   });
   
   const [newCertificate, setNewCertificate] = useState("");
   const [newAchievement, setNewAchievement] = useState("");
 
   useEffect(() => {
     if (user) {
       fetchProfile();
     }
   }, [user]);
 
   const fetchProfile = async () => {
     if (!user) return;
     
     const { data, error } = await supabase
       .from("profiles")
       .select("*")
       .eq("id", user.id)
       .single();
 
     if (error) {
       console.error("Error fetching profile:", error);
     } else if (data) {
       setProfile({
         full_name: data.full_name,
         email: data.email,
         phone: (data as any).phone,
         highest_qualification: (data as any).highest_qualification,
         job_title: (data as any).job_title,
         location: (data as any).location,
         linkedin_url: (data as any).linkedin_url,
         github_url: (data as any).github_url,
         certificates: (data as any).certificates,
         achievements: (data as any).achievements,
         avatar_url: (data as any).avatar_url,
       });
     }
     setLoading(false);
   };
 
   const handleSave = async () => {
     if (!user) return;
     setSaving(true);
 
     const { error } = await supabase
       .from("profiles")
       .update({
         full_name: profile.full_name,
         phone: profile.phone,
         highest_qualification: profile.highest_qualification,
         job_title: profile.job_title,
         location: profile.location,
         linkedin_url: profile.linkedin_url,
         github_url: profile.github_url,
         certificates: profile.certificates,
         achievements: profile.achievements,
       } as any)
       .eq("id", user.id);
 
     if (error) {
       toast.error("Failed to save profile");
       console.error(error);
     } else {
       toast.success("Profile updated successfully!");
       setIsEditing(false);
     }
     setSaving(false);
   };
 
   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (!e.target.files || !e.target.files[0] || !user) return;
     
     const file = e.target.files[0];
     const fileExt = file.name.split(".").pop();
     const filePath = `${user.id}/avatar.${fileExt}`;
 
     setUploading(true);
 
     // Delete old avatar if exists
     await supabase.storage.from("avatars").remove([`${user.id}/avatar.png`, `${user.id}/avatar.jpg`, `${user.id}/avatar.jpeg`, `${user.id}/avatar.webp`]);
 
     const { error: uploadError } = await supabase.storage
       .from("avatars")
       .upload(filePath, file, { upsert: true });
 
     if (uploadError) {
       toast.error("Failed to upload avatar");
       console.error(uploadError);
       setUploading(false);
       return;
     }
 
     const { data: urlData } = supabase.storage
       .from("avatars")
       .getPublicUrl(filePath);
 
     const avatarUrl = urlData.publicUrl;
 
     const { error: updateError } = await supabase
       .from("profiles")
       .update({ avatar_url: avatarUrl } as any)
       .eq("id", user.id);
 
     if (updateError) {
       toast.error("Failed to update profile");
     } else {
       setProfile({ ...profile, avatar_url: avatarUrl });
       toast.success("Avatar updated!");
     }
     setUploading(false);
   };
 
   const addCertificate = () => {
     if (newCertificate.trim()) {
       setProfile({
         ...profile,
         certificates: [...(profile.certificates || []), newCertificate.trim()],
       });
       setNewCertificate("");
     }
   };
 
   const removeCertificate = (index: number) => {
     setProfile({
       ...profile,
       certificates: profile.certificates?.filter((_, i) => i !== index) || [],
     });
   };
 
   const addAchievement = () => {
     if (newAchievement.trim()) {
       setProfile({
         ...profile,
         achievements: [...(profile.achievements || []), newAchievement.trim()],
       });
       setNewAchievement("");
     }
   };
 
   const removeAchievement = (index: number) => {
     setProfile({
       ...profile,
       achievements: profile.achievements?.filter((_, i) => i !== index) || [],
     });
   };
 
   const getInitials = (name: string | null) => {
     if (!name) return "U";
     return name
       .split(" ")
       .map((n) => n[0])
       .join("")
       .toUpperCase()
       .slice(0, 2);
   };
 
   if (loading) {
     return (
       <Card className="glass">
         <CardContent className="p-8 flex items-center justify-center">
           <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
             className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full"
           />
         </CardContent>
       </Card>
     );
   }
 
   return (
     <Card className="glass overflow-hidden">
       <CardHeader className="flex flex-row items-center justify-between pb-2">
         <CardTitle className="flex items-center gap-2">
           <User className="w-5 h-5 text-primary" />
           My Profile
         </CardTitle>
         {!isEditing ? (
           <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
             <Pencil className="w-4 h-4 mr-2" />
             Edit
           </Button>
         ) : (
           <div className="flex gap-2">
             <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                 setIsEditing(false);
                 fetchProfile();
               }}
             >
               <X className="w-4 h-4 mr-2" />
               Cancel
             </Button>
             <Button size="sm" onClick={handleSave} disabled={saving}>
               <Save className="w-4 h-4 mr-2" />
               {saving ? "Saving..." : "Save"}
             </Button>
           </div>
         )}
       </CardHeader>
       <CardContent className="p-6">
         {/* Avatar Section */}
         <div className="flex flex-col items-center mb-6">
           <div className="relative">
             <Avatar className="w-24 h-24 border-4 border-primary/20">
               <AvatarImage src={profile.avatar_url || undefined} />
               <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                 {getInitials(profile.full_name)}
               </AvatarFallback>
             </Avatar>
             <button
               onClick={() => fileInputRef.current?.click()}
               disabled={uploading}
               className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
             >
               <Camera className="w-4 h-4" />
             </button>
             <input
               ref={fileInputRef}
               type="file"
               accept="image/*"
               onChange={handleAvatarUpload}
               className="hidden"
             />
           </div>
           {uploading && (
             <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
           )}
         </div>
 
         <div className="grid gap-4">
           {/* Basic Info */}
           <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <User className="w-4 h-4" />
                 Full Name
               </Label>
               {isEditing ? (
                 <Input
                   value={profile.full_name || ""}
                   onChange={(e) =>
                     setProfile({ ...profile, full_name: e.target.value })
                   }
                   placeholder="Enter your full name"
                 />
               ) : (
                 <p className="text-foreground font-medium">
                   {profile.full_name || "Not set"}
                 </p>
               )}
             </div>
 
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <Mail className="w-4 h-4" />
                 Email
               </Label>
               <p className="text-foreground font-medium">
                 {profile.email || user?.email || "Not set"}
               </p>
             </div>
 
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <Phone className="w-4 h-4" />
                 Phone
               </Label>
               {isEditing ? (
                 <Input
                   value={profile.phone || ""}
                   onChange={(e) =>
                     setProfile({ ...profile, phone: e.target.value })
                   }
                   placeholder="Enter your phone number"
                 />
               ) : (
                 <p className="text-foreground font-medium">
                   {profile.phone || "Not set"}
                 </p>
               )}
             </div>
 
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <MapPin className="w-4 h-4" />
                 Location
               </Label>
               {isEditing ? (
                 <Input
                   value={profile.location || ""}
                   onChange={(e) =>
                     setProfile({ ...profile, location: e.target.value })
                   }
                   placeholder="Enter your location"
                 />
               ) : (
                 <p className="text-foreground font-medium">
                   {profile.location || "Not set"}
                 </p>
               )}
             </div>
           </div>
 
           {/* Professional Info */}
           <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <Briefcase className="w-4 h-4" />
                 Current Role
               </Label>
               {isEditing ? (
                 <Input
                   value={profile.job_title || ""}
                   onChange={(e) =>
                     setProfile({ ...profile, job_title: e.target.value })
                   }
                   placeholder="Enter your current role"
                 />
               ) : (
                 <p className="text-foreground font-medium">
                   {profile.job_title || "Not set"}
                 </p>
               )}
             </div>
 
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <GraduationCap className="w-4 h-4" />
                 Highest Qualification
               </Label>
               {isEditing ? (
                 <Input
                   value={profile.highest_qualification || ""}
                   onChange={(e) =>
                     setProfile({ ...profile, highest_qualification: e.target.value })
                   }
                   placeholder="Enter your highest qualification"
                 />
               ) : (
                 <p className="text-foreground font-medium">
                   {profile.highest_qualification || "Not set"}
                 </p>
               )}
             </div>
           </div>
 
           {/* Social Links */}
           <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <Linkedin className="w-4 h-4" />
                 LinkedIn Profile
               </Label>
               {isEditing ? (
                 <Input
                   value={profile.linkedin_url || ""}
                   onChange={(e) =>
                     setProfile({ ...profile, linkedin_url: e.target.value })
                   }
                   placeholder="https://linkedin.com/in/yourprofile"
                 />
               ) : profile.linkedin_url ? (
                 <a
                   href={profile.linkedin_url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-primary hover:underline font-medium"
                 >
                   View Profile
                 </a>
               ) : (
                 <p className="text-foreground font-medium">Not set</p>
               )}
             </div>
 
             <div className="space-y-2">
               <Label className="flex items-center gap-2 text-muted-foreground">
                 <Github className="w-4 h-4" />
                 GitHub Profile
               </Label>
               {isEditing ? (
                 <Input
                   value={profile.github_url || ""}
                   onChange={(e) =>
                     setProfile({ ...profile, github_url: e.target.value })
                   }
                   placeholder="https://github.com/yourusername"
                 />
               ) : profile.github_url ? (
                 <a
                   href={profile.github_url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-primary hover:underline font-medium"
                 >
                   View Profile
                 </a>
               ) : (
                 <p className="text-foreground font-medium">Not set</p>
               )}
             </div>
           </div>
 
           {/* Certificates */}
           <div className="pt-4 border-t border-border/50">
             <Label className="flex items-center gap-2 text-muted-foreground mb-3">
               <Award className="w-4 h-4" />
               Certificates
             </Label>
             <div className="flex flex-wrap gap-2 mb-3">
               {profile.certificates?.map((cert, index) => (
                 <Badge
                   key={index}
                   variant="secondary"
                   className="flex items-center gap-1"
                 >
                   {cert}
                   {isEditing && (
                     <button
                       onClick={() => removeCertificate(index)}
                       className="ml-1 hover:text-destructive"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   )}
                 </Badge>
               ))}
               {(!profile.certificates || profile.certificates.length === 0) &&
                 !isEditing && (
                   <p className="text-muted-foreground text-sm">
                     No certificates added
                   </p>
                 )}
             </div>
             {isEditing && (
               <div className="flex gap-2">
                 <Input
                   value={newCertificate}
                   onChange={(e) => setNewCertificate(e.target.value)}
                   placeholder="Add a certificate"
                   onKeyPress={(e) => e.key === "Enter" && addCertificate()}
                 />
                 <Button variant="outline" size="icon" onClick={addCertificate}>
                   <Plus className="w-4 h-4" />
                 </Button>
               </div>
             )}
           </div>
 
           {/* Achievements */}
           <div className="pt-4 border-t border-border/50">
             <Label className="flex items-center gap-2 text-muted-foreground mb-3">
               <Trophy className="w-4 h-4" />
               Achievements
             </Label>
             <div className="flex flex-wrap gap-2 mb-3">
               {profile.achievements?.map((achievement, index) => (
                 <Badge
                   key={index}
                   variant="outline"
                   className="flex items-center gap-1"
                 >
                   {achievement}
                   {isEditing && (
                     <button
                       onClick={() => removeAchievement(index)}
                       className="ml-1 hover:text-destructive"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   )}
                 </Badge>
               ))}
               {(!profile.achievements || profile.achievements.length === 0) &&
                 !isEditing && (
                   <p className="text-muted-foreground text-sm">
                     No achievements added
                   </p>
                 )}
             </div>
             {isEditing && (
               <div className="flex gap-2">
                 <Input
                   value={newAchievement}
                   onChange={(e) => setNewAchievement(e.target.value)}
                   placeholder="Add an achievement"
                   onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                 />
                 <Button variant="outline" size="icon" onClick={addAchievement}>
                   <Plus className="w-4 h-4" />
                 </Button>
               </div>
             )}
           </div>
         </div>
       </CardContent>
     </Card>
   );
 };
 
 export default ProfileSection;
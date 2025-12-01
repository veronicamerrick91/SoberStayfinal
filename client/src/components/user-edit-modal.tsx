import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Check } from "lucide-react";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    role: "Tenant" | "Provider";
    email: string;
    phone?: string;
    status: "Active" | "Suspended" | "Pending";
    verified: boolean;
  };
  onSave: (updatedUser: any) => void;
}

export function UserEditModal({ open, onClose, user, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-white">Edit User: {user.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-white text-sm mb-2 block">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone
              </Label>
              <Input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="bg-background/50 border-white/10"
              />
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">Role</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "Tenant" })}
                  className={`flex-1 h-10 ${formData.role === "Tenant" ? "bg-primary text-primary-foreground" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                >
                  Tenant
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "Provider" })}
                  className={`flex-1 h-10 ${formData.role === "Provider" ? "bg-primary text-primary-foreground" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                >
                  Provider
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block flex items-center gap-2">
                <Check className="w-4 h-4" /> Verification
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, verified: !formData.verified })}
                  className={`flex-1 h-10 ${formData.verified ? "bg-green-500/80 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                >
                  {formData.verified ? "✓ Verified" : "Not Verified"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 border-border">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

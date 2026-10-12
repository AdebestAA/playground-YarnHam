import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import {
  useProfile,
  useUpdateProfile,
  useUpdateProfilePic,
} from "../../hooks/useAccount";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Avatar from "../../components/ui/Avatar";
import type { UpdateProfilePayload } from "../../types";
import {
  getUsernameFromEmail,
  revokeObjectUrls,
  validateAvatarFile,
} from "../../helpers";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();
  const updateProfilePic = useUpdateProfilePic();

  const [nickname, setNickname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const email = profile?.email ?? user?.email ?? "";
  const username = getUsernameFromEmail(email);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname ?? "");
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      revokeObjectUrls([preview]);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validationError = validateAvatarFile(selected);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    revokeObjectUrls([preview]);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleAvatarSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose an image first.");
      return;
    }
    updateProfilePic.mutate(file, {
      onSuccess: () => {
        revokeObjectUrls([preview]);
        setPreview(null);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload: UpdateProfilePayload = {};
    const nick = nickname.trim();
    const first = firstName.trim();
    const last = lastName.trim();

    if (first && first.length < 3) {
      toast.error("First name must be at least 3 characters.");
      return;
    }
    if (last && last.length < 3) {
      toast.error("Last name must be at least 3 characters.");
      return;
    }

    if (nick) payload.nickname = nick;
    if (first) payload.first_name = first;
    if (last) payload.last_name = last;

    if (Object.keys(payload).length === 0) {
      toast.error("Nothing to update — fill in at least one field.");
      return;
    }

    updateProfile.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-navy-500 hover:text-navy-900 mb-8 transition-colors group"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight mb-1">
            Your profile
          </h1>
          <p className="text-navy-500">
            Update your photo and personal details.
          </p>
        </div>

        {isError && (
          <div className="mb-6 rounded-xl border border-navy-200 bg-navy-50 px-4 py-3 text-sm text-navy-700">
            We couldn't load your saved details. You can still update them below.
          </div>
        )}

        <form onSubmit={handleAvatarSubmit} className="neu-card p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-navy-950 mb-5">
            Profile picture
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="shrink-0 mx-auto sm:mx-0">
              {preview || profile?.avatar ? (
                <img
                  src={preview ?? profile?.avatar ?? ""}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border border-navy-200"
                />
              ) : (
                <Avatar name={profile?.nickname || email} size="xl" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose image
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={updateProfilePic.isPending}
                  disabled={!file}
                >
                  Upload
                </Button>
              </div>

              {file && !fileError && (
                <p className="mt-3 text-sm text-navy-500 truncate">
                  Selected: <span className="font-medium text-navy-700">{file.name}</span>
                </p>
              )}
              {fileError ? (
                <p className="mt-3 text-sm text-red-600 font-medium">{fileError}</p>
              ) : (
                <p className="mt-3 text-xs text-navy-400">
                  JPEG or PNG, up to 2MB.
                </p>
              )}
            </div>
          </div>
        </form>

        <form onSubmit={handleDetailsSubmit} className="neu-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-950 mb-5">
            Personal details
          </h2>

          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              disabled
              readOnly
              className="!bg-navy-50 cursor-not-allowed text-navy-500"
            />

            <Input
              label="Nickname"
              type="text"
              placeholder={username}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="First name"
                type="text"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              isLoading={updateProfile.isPending}
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

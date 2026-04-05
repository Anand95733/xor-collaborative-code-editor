import { useState, useEffect } from "react";
import { initSocket } from "@/socket";

export function RoomProfiles({ roomId }: { roomId: string }) {
  const [profiles, setProfiles] = useState<{ name: string; peopleId: number }[]>([]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      const socket = await initSocket();

      const handleUpdate = (members: { name: string; peopleId: number }[]) => {
        setProfiles(members);
      };

      socket.on("updateRoom", handleUpdate);

      cleanup = () => {
        socket.off("updateRoom", handleUpdate);
      };
    };

    setup();

    return () => {
      cleanup?.();
    };
  }, [roomId]);

  return (
    <div className="room-profiles">
      {profiles.map((profile) => (
        <div key={profile.name} className="profile flex items-center gap-2 p-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sm font-bold text-white">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <span className="profile-name text-sm">{profile.name}</span>
        </div>
      ))}
    </div>
  );
}
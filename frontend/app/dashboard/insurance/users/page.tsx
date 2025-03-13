"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5001/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Registered Users</h2>
      <div className="flex flex-col space-y-4">
        {users.map((user) => (
          <Card
            key={user.did}
            className="p-6 shadow-lg rounded-2xl flex items-center space-x-4 cursor-pointer"
            onClick={() => router.push(`/dashboard/insurance/users/${user.did}`)}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full">
              <User size={24} />
            </div>
            <CardContent>
              <h3 className="text-lg font-semibold">User {user.did}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

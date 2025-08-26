"use client";
import { useRouter } from 'next/navigation';
import { FaUsers, FaMousePointer, FaEdit, FaTrash, FaEye, FaChartLine } from 'react-icons/fa';
import { MdUpdate, MdDashboard } from 'react-icons/md';
import { IoStatsChart } from 'react-icons/io5';
import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../context/socketContext";
import { URL } from "../config/url.js";

type User = {
    username: string;
    user_count: number;
};

export default function Dashboard() {
    const { socket } = useSocket()
    const router=useRouter()
    const [globalCount, setGlobalCount] = useState(0)
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    //gettgin admin credentails
    useEffect(() => {
        const check = async () => {
            const stored = localStorage.getItem("admin")
            if (stored) {
                const data = JSON.parse(stored)
            }else{
                router.push('/auth/signin')
            }
        }
        check()
    }, [])

    // 🔌 Socket handling
    useEffect(() => {
        if (!socket) return;

        console.log("Socket ID:", socket.id);

        socket.on("connected", () => {
            console.log("Socket connection established");
        });

        socket.on("leaderboard-update", (data: { global_count: number, users: User[] }) => {
            setGlobalCount(data.global_count)
            setUsers(data.users);
        });

        return () => {
            socket.off("connected");
            socket.off("leaderboard-update");
        };
    }, [socket]);



    // Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await axios.get(URL);
            setGlobalCount(res.data.global_count)
            setUsers(res.data.users || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Update user count
    const updateUserCount = async (username: string, newCount: number) => {
        socket?.emit("update", { username, newCount })
    };

    // Delete user
    const deleteUser = async (username: string) => {
        socket?.emit("delete", username)
    };


    let totalUsers = 0;
    let avgClicksPerUser = 0;

    if (users.length > 0) {
        totalUsers = users.length;
        avgClicksPerUser = Math.round(globalCount / totalUsers);
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <MdDashboard className="text-4xl text-indigo-600" />
                <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaUsers className="text-2xl text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Global Clicks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Global Clicks</p>
                            <p className="text-3xl font-bold text-gray-900">{globalCount.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaMousePointer className="text-2xl text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Realtime Clicks */}

                {/* Average Clicks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Per User</p>
                            <p className="text-3xl font-bold text-gray-900">{avgClicksPerUser}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <IoStatsChart className="text-2xl text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FaUsers className="text-indigo-600" />
                        User Management
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-gray-500" />
                                        Username
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <FaMousePointer className="text-gray-500" />
                                        Clicks
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaEdit className="text-gray-500" />
                                        Actions
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length > 0 && users.map((user, index) => (
                                <tr key={user.username} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={user.user_count}
                                                onChange={(e) =>
                                                    setUsers((prev) =>
                                                        prev.map((u) =>
                                                            u.username === user.username
                                                                ? { ...u, user_count: Number(e.target.value) }
                                                                : u
                                                        )
                                                    )
                                                }
                                                className="border-2 border-gray-300 rounded-lg px-3 py-2 w-24 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{user.user_count.toLocaleString()}</span>
                                                <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                                                        style={{ width: `${Math.min((user.user_count / Math.max(...users.map(u => u.user_count))) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => updateUserCount(user.username, user.user_count)}
                                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                <MdUpdate />
                                                Update
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.username)}
                                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                <FaTrash />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500">Start by adding some users to manage.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

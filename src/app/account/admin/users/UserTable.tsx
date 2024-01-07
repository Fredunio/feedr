import { TUser } from "@/app/models/User";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";

function UserTable({
  users,
}: {
  users: (TUser & {
    _id: string;
  })[];
}) {
  return (
    <div>
      <table className="w-full text-center table-auto min-w-max">
        <thead>
          <tr className="border-1 rounded-lg">
            <th className="p-4  border-blue-gray-100 bg-blue-gray-50">Name</th>
            <th className="p-4  border-blue-gray-100 bg-blue-gray-50">Email</th>
            <th className="p-4  border-blue-gray-100 bg-blue-gray-50">Admin</th>
            <th className="p-4  border-blue-gray-100 bg-blue-gray-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="border-1 border-t-0">
          {users?.map((user) => (
            <tr key={user._id} className="even:bg-slate-100/50 ">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.admin ? "Yes" : "No"}</td>
              <td className="px-4 py-2 flex gap-2 justify-center">
                <Link
                  href={`/account/admin/users/${user._id}`}
                  title="Edit User"
                  type="button"
                  className="border-1 hover:bg-slate-50 active:bg-slate-100 text-slate-900 text-lg px-4 py-2 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Link>
                <button
                  title="Delete User"
                  type="button"
                  className="border-1 hover:bg-red-50 active:bg-red-100 text-red-700 text-lg px-4 py-2 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
